import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.presaleSettings.findFirst();

    if (!settings) {
      return NextResponse.json({ success: false, message: "Presale settings not found." }, { status: 404 });
    }

    const [aggregate, approvedInvestors, appSettings] = await Promise.all([
      prisma.purchase.aggregate({
        _sum: { usdtAmount: true },
        where: { status: "APPROVED" },
      }),
      prisma.user.count({
        where: { purchases: { some: { status: "APPROVED" } } },
      }),
      prisma.appSetting.findMany({
        where: { key: { in: ["hero_potential_users", "hero_community_driven"] } },
      }),
    ]);

    const appMap = new Map(appSettings.map((item) => [item.key, item.value]));
    const investors = (settings.manualInvestors ?? 0) + approvedInvestors;
    const manualRaised = settings.raisedAmount ?? 0;
    const approvedRaised = aggregate._sum.usdtAmount ?? 0;
    const raised = manualRaised + approvedRaised;
    const potentialUsers = Number(appMap.get("hero_potential_users") ?? 1000000);
    const communityDriven = Number(appMap.get("hero_community_driven") ?? 100);

    const progress = settings.hardCap > 0
      ? Number(((raised / settings.hardCap) * 100).toFixed(2))
      : 0;

    return NextResponse.json({
      success: true,
      raised,
      hardCap: settings.hardCap,
      tokenPrice: settings.tokenPrice,
      totalTokens: settings.totalTokens.toString(),
      endDate: settings.endDate,
      progress,
      investors,
      community: investors,
      potentialUsers,
      communityDriven,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to load presale stats." }, { status: 500 });
  }
}