import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDeveloper, requireStaff } from "@/lib/adminGuard";
import { assertPercentages, getPartnerConfig } from "@/lib/partner-config";

export async function GET() {
  const admin = await requireStaff();
  if (!admin) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
  const config = await getPartnerConfig();
  if (admin.role !== "DEVELOPER") {
    return NextResponse.json({success:true, config:{unlockHours:config.unlockHours,minWithdrawalUSDT:config.minWithdrawalUSDT,conversionRate:config.conversionRate,settlementDays:config.settlementDays,withdrawalProcessingHours:config.withdrawalProcessingHours,operatingStartHour:config.operatingStartHour,operatingEndHour:config.operatingEndHour,timezone:config.timezone,special3Set:config.special3Set,special6Set:config.special6Set,special9Set:config.special9Set}});
  }
  return NextResponse.json({success:true, config});
}

export async function PUT(req: NextRequest) {
  const admin = await requireDeveloper(req);
  if (!admin) return NextResponse.json({success:false,message:"Developer access required."},{status:403});
  try {
    const body = await req.json();
    assertPercentages(body);
    const current = await getPartnerConfig();
    const data = {
      directPercent:Number(body.directPercent), level1Percent:Number(body.level1Percent), level2Percent:Number(body.level2Percent), level3Percent:Number(body.level3Percent),
      unlockHours:Math.max(1,Math.round(Number(body.unlockHours ?? current.unlockHours))),
      minWithdrawalUSDT:Math.max(0,Number(body.minWithdrawalUSDT ?? current.minWithdrawalUSDT)),
      conversionRate:Math.max(1,Number(body.conversionRate ?? current.conversionRate)),
      settlementDays:Math.max(1,Math.round(Number(body.settlementDays ?? current.settlementDays))),
      withdrawalProcessingHours:Math.max(1,Math.round(Number(body.withdrawalProcessingHours ?? current.withdrawalProcessingHours))),
      operatingStartHour:Math.min(23,Math.max(0,Math.round(Number(body.operatingStartHour ?? current.operatingStartHour)))),
      operatingEndHour:Math.min(23,Math.max(0,Math.round(Number(body.operatingEndHour ?? current.operatingEndHour)))),
      timezone:String(body.timezone ?? current.timezone),
      special3Set:Math.max(0,Number(body.special3Set ?? current.special3Set)), special6Set:Math.max(0,Number(body.special6Set ?? current.special6Set)), special9Set:Math.max(0,Number(body.special9Set ?? current.special9Set)),
    };
    const updated = await prisma.partnerRewardConfig.update({where:{id:current.id},data});
    await prisma.securityAuditLog.create({data:{userId:admin.id,actorRole:admin.role,action:"PARTNER_CONFIG_UPDATED",metadata:JSON.stringify({direct:data.directPercent,l1:data.level1Percent,l2:data.level2Percent,l3:data.level3Percent})}});
    return NextResponse.json({success:true,message:"Partner Program settings updated.",config:updated});
  } catch (e) {
    return NextResponse.json({success:false,message:e instanceof Error?e.message:"Invalid settings."},{status:400});
  }
}
