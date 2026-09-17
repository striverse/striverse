import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { getPartnerConfig } from "@/lib/partner-config";
import { isWithinOperatingHours } from "@/lib/operating-hours";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
    if (!token) return NextResponse.json({ success:false, message:"Unauthorized" }, { status:401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id:string };
    const { amount } = await req.json();
    const usdt = Number(amount);
    if (!Number.isFinite(usdt) || usdt <= 0) return NextResponse.json({ success:false, message:"Enter a valid amount." }, { status:400 });
    const config = await getPartnerConfig();
    if (!isWithinOperatingHours(new Date(), config.timezone, config.operatingStartHour, config.operatingEndHour)) return NextResponse.json({success:false,message:`Conversions are accepted only between ${config.operatingStartHour}:00 and ${config.operatingEndHour}:00 (${config.timezone}).`},{status:403});
    const RATE=config.conversionRate;
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where:{id:decoded.id}, select:{bonusConversionEnabled:true, bonusWallet:true} });
      if (!user) throw new Error("USER_NOT_FOUND");
      if (!user.bonusConversionEnabled) throw new Error("CONVERSION_DISABLED");
      if ((user.bonusWallet?.referralAvailable ?? 0) < usdt) throw new Error("INSUFFICIENT_BALANCE");
      const stv = usdt * RATE;
      const wallet = await tx.bonusWallet.update({ where:{userId:decoded.id}, data:{ referralAvailable:{decrement:usdt} } });
      const purchaseWallet = await tx.purchaseWallet.upsert({ where:{userId:decoded.id}, create:{userId:decoded.id, lockedSTV:stv, totalPurchasedSTV:0}, update:{lockedSTV:{increment:stv}} });
      const conversion = await tx.referralConversion.create({ data:{userId:decoded.id, usdtAmount:usdt, stvAmount:stv, rate:RATE} });
      await tx.notification.create({data:{userId:decoded.id,title:"Referral USDT converted",message:`${usdt.toFixed(2)} USDT converted to ${stv.toLocaleString()} locked STV.`,type:"REFERRAL_CONVERTED"}});
      return { conversion, available:wallet.referralAvailable, lockedSTV:purchaseWallet.lockedSTV };
    });
    return NextResponse.json({ success:true, message:"Referral USDT converted to locked STV.", ...result });
  } catch (error) {
    const msg=error instanceof Error?error.message:"";
    const map:Record<string,[string,number]>={USER_NOT_FOUND:["User not found.",404],CONVERSION_DISABLED:["STV conversion is currently disabled.",403],INSUFFICIENT_BALANCE:["Insufficient available referral USDT.",400]};
    if(map[msg]) return NextResponse.json({success:false,message:map[msg][0]},{status:map[msg][1]});
    console.error("Referral conversion error",error);
    return NextResponse.json({success:false,message:"Unable to convert referral USDT."},{status:500});
  }
}
