import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
  const now = new Date();
  const rewards = await prisma.partnerReward.findMany({where:{status:"PENDING",unlockAt:{lte:now}},orderBy:{createdAt:"asc"},take:500});
  let released = 0;
  for (const reward of rewards) {
    try {
      await prisma.$transaction(async tx => {
        const claimed = await tx.partnerReward.updateMany({where:{id:reward.id,status:"PENDING"},data:{status:"AVAILABLE",releasedAt:now}});
        if (claimed.count !== 1) return;
        await tx.bonusWallet.upsert({where:{userId:reward.beneficiaryId},create:{userId:reward.beneficiaryId,referralAvailable:reward.amount},update:{referralPending:{decrement:reward.amount},referralAvailable:{increment:reward.amount}}});
        await tx.user.update({where:{id:reward.beneficiaryId},data:{referralEarnings:{increment:reward.amount}}});
        await tx.notification.create({data:{userId:reward.beneficiaryId,title:"Partner reward unlocked",message:`${reward.amount.toFixed(2)} USDT is now available in your Partner wallet.`,type:"PARTNER_REWARD_UNLOCKED"}});
        if (reward.kind === "DIRECT") {
          await tx.purchase.updateMany({where:{id:reward.purchaseId},data:{referralBonusReleased:true}});
        }
        released++;
      });
    } catch (e) { console.error("Partner reward release failed", reward.id, e); }
  }
  return NextResponse.json({success:true,released});
}
