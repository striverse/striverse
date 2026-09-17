import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";

function generateRecoveryResetCode() {
  return crypto.randomBytes(18).toString("base64url");
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const users = await prisma.user.findMany({
      where: { role: "USER", recoveryRequestedAt: { not: null }, recoveryUsed: false },
      select: { id: true, fullName: true, email: true, phone: true, referralCode: true, recoveryRequestedAt: true, createdAt: true },
      orderBy: { recoveryRequestedAt: "asc" },
    });
    return NextResponse.json({ success: true, requests: users });
  } catch (error) {
    console.error("Admin recovery list error:", error);
    return NextResponse.json({ success: false, message: "Unable to load recovery requests." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

  try {
    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ success: false, message: "User ID is required." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== "USER") return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });
    if (user.recoveryUsed) return NextResponse.json({ success: false, message: "One-time recovery has already been used." }, { status: 409 });
    if (!user.recoveryRequestedAt) return NextResponse.json({ success: false, message: "No recovery request is pending." }, { status: 400 });

    const resetCode = generateRecoveryResetCode();
    const resetCodeHash = await bcrypt.hash(resetCode, 12);
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        recoveryUsed: true,
        recoveryResetAt: new Date(),
        recoveryRequestedAt: null,
        recoveryResetCodeHash: resetCodeHash,
        recoveryResetCodeExpiresAt: resetExpiresAt,
        recoveryPhraseHash: null,
      },
    });

    // Admin receives only a short-lived reset code. The new recovery phrase is created by the user and never exposed to admin.
    return NextResponse.json({
      success: true,
      message: "One-time recovery reset approved. Give the reset code to the verified user through a trusted channel.",
      resetCode,
      expiresAt: resetExpiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Admin recovery reset error:", error);
    return NextResponse.json({ success: false, message: "Recovery reset failed." }, { status: 500 });
  }
}
