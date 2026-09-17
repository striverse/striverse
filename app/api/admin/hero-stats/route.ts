import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/adminGuard";

const DEFAULTS = {
  community: 50000,
  raised: 150000,
  potentialUsers: 1000000,
  communityDriven: 100,
};

async function getValues() {
  const settings = await prisma.presaleSettings.findFirst();
  const appSettings = await prisma.appSetting.findMany({
    where: { key: { in: ["hero_potential_users", "hero_community_driven"] } },
  });
  const map = new Map(appSettings.map((item) => [item.key, item.value]));
  return {
    community: settings?.manualInvestors ?? DEFAULTS.community,
    raised: settings?.raisedAmount ?? DEFAULTS.raised,
    potentialUsers: Number(map.get("hero_potential_users") ?? DEFAULTS.potentialUsers),
    communityDriven: Number(map.get("hero_community_driven") ?? DEFAULTS.communityDriven),
  };
}

export async function GET() {
  const admin = await requireStaff();
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, stats: await getValues() });
}

export async function PUT(req: NextRequest) {
  const admin = await requireStaff(req);
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const community = Math.max(0, Math.round(Number(body.community)));
    const raised = Math.max(0, Number(body.raised));
    const potentialUsers = Math.max(0, Math.round(Number(body.potentialUsers)));
    const communityDriven = Math.min(100, Math.max(0, Number(body.communityDriven)));

    if (![community, raised, potentialUsers, communityDriven].every(Number.isFinite)) {
      return NextResponse.json({ success: false, message: "Invalid hero statistics." }, { status: 400 });
    }

    const settings = await prisma.presaleSettings.findFirst();
    if (!settings) {
      return NextResponse.json({ success: false, message: "Presale settings not found." }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.presaleSettings.update({
        where: { id: settings.id },
        data: { manualInvestors: community, raisedAmount: raised },
      });
      for (const [key, value] of [
        ["hero_potential_users", String(potentialUsers)],
        ["hero_community_driven", String(communityDriven)],
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
          metadata: JSON.stringify({ community, raised, potentialUsers, communityDriven }),
        },
      });
    });

    return NextResponse.json({ success: true, message: "Hero statistics updated.", stats: { community, raised, potentialUsers, communityDriven } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to update hero statistics." }, { status: 500 });
  }
}
