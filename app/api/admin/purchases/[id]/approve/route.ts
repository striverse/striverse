import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
import { createUserNotification } from "@/lib/notifications";
import { getPartnerConfig } from "@/lib/partner-config";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
  try {
    const { id } = await params;
    const purchase = await prisma.purchase.findUnique({where:{id}});
    if (!purchase) return NextResponse.json({success:false,message:"Purchase not found."},{status:404});
    if (purchase.status !== "PENDING") return NextResponse.json({success:false,message:"Purchase already processed."},{status:409});

    const testMode = process.env.NEXT_PUBLIC_STRIVERSE_TEST_MODE === "true";
    if (!testMode && purchase.verificationStatus !== "VERIFIED") {
      return NextResponse.json({success:false,message:"Payment must be verified before approval."},{status:400});
    }

    const config = await getPartnerConfig();
    const now = new Date();
    const unlockAt = new Date(now.getTime() + config.unlockHours * 60 * 60 * 1000);

    await prisma.$transaction(async tx => {
      const claimed = await tx.purchase.updateMany({where:{id,status:"PENDING"},data:{status:"APPROVED", verificationStatus:testMode && purchase.verificationStatus === "NOT_VERIFIED" ? "VERIFIED" : purchase.verificationStatus, verifiedAt:purchase.verifiedAt ?? now}});
      if (claimed.count !== 1) throw new Error("PURCHASE_ALREADY_PROCESSED");

      await tx.purchaseWallet.upsert({
        where:{userId:purchase.userId},
        create:{userId:purchase.userId,totalPurchasedUSDT:purchase.usdtAmount,totalPurchasedSTV:purchase.stvAmount,lockedSTV:purchase.stvAmount,purchaseCount:1,lastPurchaseAt:now},
        update:{totalPurchasedUSDT:{increment:purchase.usdtAmount},totalPurchasedSTV:{increment:purchase.stvAmount},lockedSTV:{increment:purchase.stvAmount},purchaseCount:{increment:1},lastPurchaseAt:now},
      });

      await createUserNotification(tx,purchase.userId,"Purchase approved",`${purchase.packageName} purchase approved. ${purchase.stvAmount.toLocaleString()} STV has been added to your locked balance.` ,"PURCHASE_APPROVED");

      // Direct + exactly three partner levels. No level 4 is created.
      const buyer = await tx.user.findUnique({where:{id:purchase.userId},select:{referredById:true}});
      let ancestorId = buyer?.referredById ?? null;
      const payouts = [
        {kind:"DIRECT",level:null,percent:config.directPercent},
        {kind:"LEVEL_1",level:1,percent:config.level1Percent},
        {kind:"LEVEL_2",level:2,percent:config.level2Percent},
        {kind:"LEVEL_3",level:3,percent:config.level3Percent},
      ];
      for (const payout of payouts) {
        if (!ancestorId || payout.percent <= 0) break;
        const amount = purchase.usdtAmount * (payout.percent / 100);
        if (amount <= 0) break;
        await tx.partnerReward.create({data:{beneficiaryId:ancestorId,sourceUserId:purchase.userId,purchaseId:purchase.id,kind:payout.kind,level:payout.level,amount,unlockAt,status:"PENDING"}});
        await tx.bonusWallet.upsert({where:{userId:ancestorId},create:{userId:ancestorId,referralPending:amount},update:{referralPending:{increment:amount}}});
        await createUserNotification(tx,ancestorId,`${payout.kind === "DIRECT" ? "Partner reward" : `Partner Level ${payout.level} reward`} pending`,`${amount.toFixed(2)} USDT is pending and will unlock after ${config.unlockHours} hours.` ,"PARTNER_REWARD_PENDING");
        const ancestor = await tx.user.findUnique({where:{id:ancestorId},select:{referredById:true}});
        ancestorId = ancestor?.referredById ?? null;
      }
      // Cumulative 3/6/9 set incentives. A set is 3 qualified L1 + 6 qualified L2 + 9 qualified L3 users.
      async function qualifiedCounts(rootId:string){
        let frontier=[rootId]; const counts=[0,0,0];
        for(let depth=1;depth<=3;depth++){
          const children=await tx.user.findMany({where:{referredById:{in:frontier},role:"USER"},select:{id:true}});
          const ids=children.map(x=>x.id);
          if(!ids.length) break;
          const qualified=await tx.purchase.findMany({where:{userId:{in:ids},status:"APPROVED"},select:{userId:true},distinct:["userId"]});
          counts[depth-1]=qualified.length; frontier=ids;
        }
        return counts;
      }
      const rewardRecipients:string[]=[];
      let specialAncestor=buyer?.referredById ?? null;
      for(let i=0;i<4 && specialAncestor;i++){ rewardRecipients.push(specialAncestor); const u=await tx.user.findUnique({where:{id:specialAncestor},select:{referredById:true}}); specialAncestor=u?.referredById??null; }
      for(const recipient of rewardRecipients){
        const [l1,l2,l3]=await qualifiedCounts(recipient);
        const sets=Math.min(Math.floor(l1/3),Math.floor(l2/6),Math.floor(l3/9));
        const milestones:[number,string,number][]=[[3,"SPECIAL_3_SET",config.special3Set],[6,"SPECIAL_6_SET",config.special6Set],[9,"SPECIAL_9_SET",config.special9Set]];
        for(const [threshold,kind,amount] of milestones){
          if(sets>=threshold && amount>0){
            const exists=await tx.partnerReward.findFirst({where:{beneficiaryId:recipient,kind,purchaseId:purchase.id}});
            const anyMilestone=await tx.partnerReward.findFirst({where:{beneficiaryId:recipient,kind}});
            if(!exists && !anyMilestone){
              const specialUnlock=new Date(now.getTime()+config.unlockHours*60*60*1000);
              await tx.partnerReward.create({data:{beneficiaryId:recipient,sourceUserId:purchase.userId,purchaseId:purchase.id,kind,level:null,amount,unlockAt:specialUnlock,status:"PENDING"}});
              await tx.bonusWallet.upsert({where:{userId:recipient},create:{userId:recipient,referralPending:amount},update:{referralPending:{increment:amount}}});
              await createUserNotification(tx,recipient,"Partner milestone reward pending",`${amount.toFixed(2)} USDT milestone reward is pending and will unlock after ${config.unlockHours} hours.` ,"PARTNER_MILESTONE_PENDING");
            }
          }
        }
      }
    });
    return NextResponse.json({success:true,message:"Purchase approved successfully."});
  } catch (error) {
    if (error instanceof Error && error.message === "PURCHASE_ALREADY_PROCESSED") return NextResponse.json({success:false,message:"Purchase already processed."},{status:409});
    console.error("Purchase approval error",error);
    return NextResponse.json({success:false,message:"Approval failed. Please refresh and try again."},{status:500});
  }
}
