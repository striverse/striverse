import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, resetCode } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const code = String(resetCode || "").trim();

    if (!normalizedEmail || !code) {
      return NextResponse.json({ success: false, message: "Email and reset code are required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || user.role !== "USER") {
      return NextResponse.json({ success: false, message: "Invalid recovery details." }, { status: 401 });
    }
    if (!user.recoveryUsed || !user.recoveryResetCodeHash || !user.recoveryResetCodeExpiresAt) {
      return NextResponse.json({ success: false, message: "No approved recovery reset is available." }, { status: 409 });
    }
    if (user.recoveryResetCodeExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ success: false, message: "Recovery reset code has expired." }, { status: 410 });
    }

    const validCode = await bcrypt.compare(code, user.recoveryResetCodeHash);
    if (!validCode) {
      return NextResponse.json({ success: false, message: "Invalid recovery reset code." }, { status: 401 });
    }

    return NextResponse.json({ success: true, message: "Reset code verified. Create your new recovery phrase on this device." });
  } catch (error) {
    console.error("Recovery code verification error:", error);
    return NextResponse.json({ success: false, message: "Unable to verify recovery code." }, { status: 500 });
  }
}
