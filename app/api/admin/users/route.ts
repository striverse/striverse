import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

function isAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return false;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role?: string };
    return decoded.role === "ADMIN";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, fullName: true, email: true, phone: true, role: true,
        isVerified: true, isBlocked: true, referralCode: true, referredById: true,
        createdAt: true,
        purchaseWallet: { select: { lockedSTV: true, unlockedSTV: true, totalPurchasedUSDT: true } },
        bonusWallet: { select: { referralPending: true, referralAvailable: true, referralWithdrawn: true } },
      },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin users GET:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch users." }, { status: 500 });
  }
}
