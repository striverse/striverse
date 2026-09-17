import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, recoveryPhrase } = await req.json();
    if (!email || !recoveryPhrase) {
      return NextResponse.json({ success: false, message: "Email and recovery phrase are required." }, { status: 400 });
    }
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
      include: { purchaseWallet: true, bonusWallet: true },
    });
    if (!user) return NextResponse.json({ success: false, message: "Invalid email or recovery phrase." }, { status: 401 });
    if (user.role !== "USER") return NextResponse.json({ success: false, message: "Please use the Admin Login page." }, { status: 403 });
    if (user.isBlocked) return NextResponse.json({ success: false, message: "Your account has been blocked. Please contact support." }, { status: 403 });
    if (!user.recoveryPhraseHash) return NextResponse.json({ success: false, message: "Recovery login is not configured for this account." }, { status: 401 });

    const normalizedPhrase = String(recoveryPhrase).trim().toLowerCase().replace(/\s+/g, " ");
    const valid = await bcrypt.compare(normalizedPhrase, user.recoveryPhraseHash);
    if (!valid) return NextResponse.json({ success: false, message: "Invalid email or recovery phrase." }, { status: 401 });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    const response = NextResponse.json({
      success: true,
      message: "Login successful.",
      user: {
        id: user.id, fullName: user.fullName, email: user.email, role: user.role,
        currentRank: user.currentRank, totalReferrals: user.totalReferrals,
        referralEarnings: user.referralEarnings,
        wallet: {
          totalPurchasedUSDT: user.purchaseWallet?.totalPurchasedUSDT ?? 0,
          totalPurchasedSTV: user.purchaseWallet?.totalPurchasedSTV ?? 0,
          lockedSTV: user.purchaseWallet?.lockedSTV ?? 0,
          unlockedSTV: user.purchaseWallet?.unlockedSTV ?? 0,
          purchaseCount: user.purchaseWallet?.purchaseCount ?? 0,
        },
        bonus: {
          referral: {
            pending: user.bonusWallet?.referralPending ?? 0,
            available: user.bonusWallet?.referralAvailable ?? 0,
            withdrawn: user.bonusWallet?.referralWithdrawn ?? 0,
          },
        },
      },
    });
    response.cookies.set("token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    console.error("LOGIN ERROR", error);
    return NextResponse.json({ success: false, message: "Login failed." }, { status: 500 });
  }
}
