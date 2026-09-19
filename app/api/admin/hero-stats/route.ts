import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDeveloper, requireStaff } from "@/lib/adminGuard";

const DEFAULTS = {
  community: 50000,
  raised: 150000,
  potentialUsers: 1000000,
  communityDriven: 100,
  tokenPrice: 0.0009,
  hardCap: 500000,
  endDate: "2027-04-08T18:29:59.000Z",
};

async function getValues() {
  const settings = await prisma.presaleSettings.findFirst();
  const appSettings = await prisma.appSetting.findMany({
    where: { key: { in: ["hero_potential_users", "hero_community_driven", "presale_allocated_tokens", "presale_sold_manual"] } },
  });
  const map = new Map(appSettings.map((item) => [item.key, item.value]));
  return {
    community: settings?.manualInvestors ?? DEFAULTS.community,
    tokenPrice: settings?.tokenPrice ?? DEFAULTS.tokenPrice,
    hardCap: settings?.hardCap ?? DEFAULTS.hardCap,
    endDate: settings?.endDate?.toISOString() ?? DEFAULTS.endDate,
    raised: settings?.raisedAmount ?? DEFAULTS.raised,
    potentialUsers: Number(map.get("hero_potential_users") ?? DEFAULTS.potentialUsers),
    communityDriven: Number(map.get("hero_community_driven") ?? DEFAULTS.communityDriven),
    presaleAllocatedTokens: Number(map.get("presale_allocated_tokens") ?? 2222222222),
    presaleSoldManual: Number(map.get("presale_sold_manual") ?? 0),
  };
}

export async function GET() {
  const admin = await requireStaff();
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, stats: await getValues() });
}

export async function PUT(req: NextRequest) {
  const admin = await requireDeveloper(req);
  if (!admin) return NextResponse.json({ success: false, message: "Developer access required." }, { status: 403 });

  try {
    const body = await req.json();
    const community = Math.max(0, Math.round(Number(body.community)));
    const raised = Math.max(0, Number(body.raised));
    const potentialUsers = Math.max(0, Math.round(Number(body.potentialUsers)));
    const communityDriven = Math.min(100, Math.max(0, Number(body.communityDriven)));
    const tokenPrice = Math.max(0, Number(body.tokenPrice));
    const hardCap = Math.max(0, Number(body.hardCap));
    const endDate = new Date(String(body.endDate));
    const presaleAllocatedTokens = Math.max(0, Number(body.presaleAllocatedTokens));
    const presaleSoldManual = Math.max(0, Number(body.presaleSoldManual));

    if (![community, raised, potentialUsers, communityDriven, tokenPrice, hardCap, presaleAllocatedTokens, presaleSoldManual].every(Number.isFinite) || Number.isNaN(endDate.getTime())) {
      return NextResponse.json({ success: false, message: "Invalid hero statistics." }, { status: 400 });
    }

    const settings = await prisma.presaleSettings.findFirst();

    await prisma.$transaction(async (tx) => {
      if (settings) {
        await tx.presaleSettings.update({
          where: { id: settings.id },
          data: { manualInvestors: community, raisedAmount: raised, tokenPrice, hardCap, endDate },
        });
      } else {
        await tx.presaleSettings.create({
          data: { manualInvestors: community, raisedAmount: raised, tokenPrice, hardCap, endDate, startDate: new Date() },
        });
      }
      for (const [key, value] of [
        ["hero_potential_users", String(potentialUsers)],
        ["hero_community_driven", String(communityDriven)],
        ["presale_allocated_tokens", String(presaleAllocatedTokens)],
        ["presale_sold_manual", String(presaleSoldManual)],
      ]) {
        await tx.appSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
      await tx.securityAuditLog.create({
        data: {
          userId: admin.id,
          actorRole: admin.role,
          action: "HERO_STATS_UPDATED",
          metadata: JSON.stringify({ community, raised, potentialUsers, communityDriven, tokenPrice, hardCap, endDate, presaleAllocatedTokens, presaleSoldManual }),
        },
      });
    });

    return NextResponse.json({ success: true, message: "Hero statistics updated.", stats: { community, raised, potentialUsers, communityDriven, tokenPrice, hardCap, endDate: endDate.toISOString(), presaleAllocatedTokens, presaleSoldManual } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update hero statistics." }, { status: 500 });
  }
}
