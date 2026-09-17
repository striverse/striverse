import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("; ").find((c) => c.startsWith("token="))?.split("=")[1];
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const { id } = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const [wallet, pending] = await Promise.all([
      prisma.bonusWallet.upsert({ where: { userId: id }, create: { userId: id }, update: {} }),
      prisma.purchase.findMany({
        where: { user: { referredById: id }, status: "APPROVED", referralBonusReleased: false, referralBonusUSDT: { gt: 0 }, referralUnlockAt: { not: null } },
        select: { id: true, packageName: true, referralBonusUSDT: true, referralUnlockAt: true, createdAt: true },
        orderBy: { referralUnlockAt: "asc" },
      }),
    ]);

    return NextResponse.json({ success: true, wallet: {
      pending: wallet.referralPending,
      available: wallet.referralAvailable,
      withdrawn: wallet.referralWithdrawn,
    }, pendingUnlocks: pending });
  } catch {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }
}
