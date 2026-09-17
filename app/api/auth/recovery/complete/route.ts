import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, resetCode, recoveryPhrase } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const phrase = String(recoveryPhrase || "").trim().toLowerCase().replace(/\s+/g, " ");
    const code = String(resetCode || "").trim();

    if (!normalizedEmail || !code || !phrase) {
      return NextResponse.json({ success: false, message: "Email, reset code, and new recovery phrase are required." }, { status: 400 });
    }

    const words = phrase.split(" ");
    if (words.length !== 12) {
      return NextResponse.json({ success: false, message: "Recovery phrase must contain exactly 12 words." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || user.role !== "USER") return NextResponse.json({ success: false, message: "Invalid recovery details." }, { status: 401 });
    if (!user.recoveryUsed || !user.recoveryResetCodeHash || !user.recoveryResetCodeExpiresAt) {
      return NextResponse.json({ success: false, message: "No approved recovery reset is available." }, { status: 409 });
    }
    if (user.recoveryResetCodeExpiresAt.getTime() < Date.now()) {
      return NextResponse.json({ success: false, message: "Recovery reset code has expired." }, { status: 410 });
    }

    const validCode = await bcrypt.compare(code, user.recoveryResetCodeHash);
    if (!validCode) return NextResponse.json({ success: false, message: "Invalid recovery reset code." }, { status: 401 });

    const recoveryPhraseHash = await bcrypt.hash(phrase, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { recoveryPhraseHash, recoveryCreatedAt: new Date(), recoveryResetCodeHash: null, recoveryResetCodeExpiresAt: null },
    });
    await prisma.notification.create({data:{userId:user.id,title:"Recovery completed",message:"Your new recovery phrase has been saved. Store it securely and never share it.",type:"RECOVERY_COMPLETED"}});

    return NextResponse.json({ success: true, message: "New recovery phrase saved successfully. Store it securely." });
  } catch (error) {
    console.error("Recovery completion error:", error);
    return NextResponse.json({ success: false, message: "Unable to complete recovery." }, { status: 500 });
  }
}
