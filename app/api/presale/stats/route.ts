import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const settings = await prisma.presaleSettings.findFirst();

    // Keep the public presale card live even when a fresh database has not
    // been seeded with PresaleSettings yet. Admin-configured values still win.
    const presaleEndDate = settings?.endDate?.toISOString() ?? "2027-04-08T18:29:59.000Z";
    const fallback = {
      raisedAmount: 150000,
      hardCap: 500000,
      tokenPrice: 0.0009,
      totalTokens: BigInt(8888888888),
      manualInvestors: 50000,
    };
    const effective = settings ?? fallback;

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
    const investors = (effective.manualInvestors ?? 0) + approvedInvestors;
    const manualRaised = effective.raisedAmount ?? 0;
    const approvedRaised = aggregate._sum.usdtAmount ?? 0;
    const raised = manualRaised + approvedRaised;
    const potentialUsers = Number(appMap.get("hero_potential_users") ?? 1000000);
    const communityDriven = Number(appMap.get("hero_community_driven") ?? 100);

    const progress = effective.hardCap > 0
      ? Number(((raised / effective.hardCap) * 100).toFixed(2))
      : 0;

    return NextResponse.json({
      success: true,
      raised,
      hardCap: effective.hardCap,
      tokenPrice: effective.tokenPrice,
      totalTokens: effective.totalTokens.toString(),
      endDate: presaleEndDate,
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