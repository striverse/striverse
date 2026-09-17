import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { Network } from "@prisma/client";
import { getPartnerConfig } from "@/lib/partner-config";
import { isWithinOperatingHours } from "@/lib/operating-hours";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const { amount, walletAddress, network } = await req.json();
    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0) return NextResponse.json({ success: false, message: "Enter a valid amount." }, { status: 400 });
    if (!walletAddress || String(walletAddress).trim().length < 8) return NextResponse.json({ success: false, message: "Wallet address is required." }, { status: 400 });
    if (!Object.values(Network).includes(network)) return NextResponse.json({ success: false, message: "Invalid network." }, { status: 400 });

    const config = await getPartnerConfig();
    if (!isWithinOperatingHours(new Date(), config.timezone, config.operatingStartHour, config.operatingEndHour)) return NextResponse.json({success:false,message:`Withdrawals are accepted only between ${config.operatingStartHour}:00 and ${config.operatingEndHour}:00 (${config.timezone}).`},{status:403});
    if (value < config.minWithdrawalUSDT) return NextResponse.json({success:false,message:`Minimum withdrawal is ${config.minWithdrawalUSDT} USDT.`},{status:400});
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({ where: { id: decoded.id }, select: { withdrawEnabled: true, bonusWallet: true } });
      if (!user) throw new Error("USER_NOT_FOUND");
      if (!user.withdrawEnabled) throw new Error("WITHDRAW_DISABLED");
      if ((user.bonusWallet?.referralAvailable ?? 0) < value) throw new Error("INSUFFICIENT_BALANCE");
      const wallet = await tx.bonusWallet.update({ where: { userId: decoded.id }, data: { referralAvailable: { decrement: value } } });
      const withdrawal = await tx.referralWithdrawal.create({ data: { userId: decoded.id, amount: value, walletAddress: String(walletAddress).trim(), network, status: "PENDING" } });
      await tx.notification.create({
        data: {
          userId: decoded.id,
          title: "Withdrawal submitted",
          message: `${value.toFixed(2)} USDT withdrawal request is pending admin review.`,
          type: "WITHDRAWAL_PENDING",
        },
      });
      return { withdrawal, available: wallet.referralAvailable };
    });
    return NextResponse.json({ success: true, message: "Withdrawal request submitted for admin review.", withdrawal: result.withdrawal, available: result.available });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    const map: Record<string, [string, number]> = { USER_NOT_FOUND: ["User not found.",404], WITHDRAW_DISABLED:["Withdrawals are currently disabled.",403], INSUFFICIENT_BALANCE:["Insufficient available referral USDT.",400] };
    if (map[msg]) return NextResponse.json({ success:false, message:map[msg][0] }, { status:map[msg][1] });
    console.error("Referral withdrawal error", error);
    return NextResponse.json({ success:false, message:"Unable to submit withdrawal." }, { status:500 });
  }
}
