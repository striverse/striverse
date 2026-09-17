import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/referral";

const WORDS = ["nova","orbit","stellar","cosmic","luna","aurora","orion","nebula","celestial","quantum","eclipse","galaxy","vertex","pulse","zenith","comet","meteor","solstice","equinox","infinity","radiant","voyager","astral","horizon","phoenix","spectrum","gravity","zen","matrix","vortex","prism","atlas"];

function generateRecoveryPhrase() {
  const bytes = crypto.randomBytes(12);
  return Array.from(bytes, b => WORDS[b % WORDS.length]).join(" ");
}

export async function POST(req: Request) {
  try {
    const { fullName, email, phone, password, referralCode } = await req.json();
    if (!fullName || !email || !phone || !referralCode?.trim()) {
      return NextResponse.json({ success: false, message: "All fields and a referral code are required." }, { status: 400 });
    }

    const normalizedReferralCode = referralCode.trim().toUpperCase();
    const isMasterSignupCode = normalizedReferralCode === "STV88888";
    const referrer = isMasterSignupCode
      ? null
      : await prisma.user.findUnique({ where: { referralCode: normalizedReferralCode } });
    if (!isMasterSignupCode && !referrer) {
      return NextResponse.json({ success: false, message: "Invalid referral code." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existingUser) return NextResponse.json({ success: false, message: "Email already registered." }, { status: 409 });

    let newReferralCode = generateReferralCode();
    while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } })) newReferralCode = generateReferralCode();

    const recoveryPhrase = generateRecoveryPhrase();
    const recoveryPhraseHash = await bcrypt.hash(recoveryPhrase, 12);
    const hashedPassword = await bcrypt.hash(crypto.randomBytes(32).toString("hex"), 12);

    const user = await prisma.$transaction(async tx => {
      const created = await tx.user.create({
        data: {
          fullName, email: email.toLowerCase(), phone, password: hashedPassword,
          isVerified: true, referralCode: newReferralCode,
          ...(referrer ? { referredBy: { connect: { id: referrer.id } } } : {}),
          recoveryPhraseHash, recoveryCreatedAt: new Date(),
        },
      });
      await tx.purchaseWallet.create({ data: { userId: created.id } });
      await tx.bonusWallet.create({ data: { userId: created.id } });
      if (referrer) {
        await tx.user.update({ where: { id: referrer.id }, data: { totalReferrals: { increment: 1 } } });
      }
      return created;
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Save your recovery phrase securely.",
      user: { id: user.id, fullName: user.fullName, email: user.email, referralCode: user.referralCode },
      recoveryPhrase,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ success: false, message: "Registration failed." }, { status: 500 });
  }
}
