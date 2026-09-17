import { prisma } from "@/lib/prisma";
import { generateReferralCode } from "@/lib/referral";

type RegisterUserData = { fullName: string; email: string; phone: string; referralCode: string };

export async function registerUser(data: RegisterUserData) {
  const { fullName, email, phone, referralCode } = data;
  if (!fullName || !email || !phone || !referralCode?.trim()) throw new Error("All fields and a referral code are required.");
  const normalizedReferralCode = referralCode.trim().toUpperCase();
  const isMasterSignupCode = normalizedReferralCode === "STV88888";
  const referrer = isMasterSignupCode
    ? null
    : await prisma.user.findUnique({ where: { referralCode: normalizedReferralCode } });
  if (!isMasterSignupCode && !referrer) throw new Error("Invalid referral code.");
  const existingUser = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (existingUser) throw new Error("Email already registered.");
  let newReferralCode = generateReferralCode();
  while (await prisma.user.findUnique({ where: { referralCode: newReferralCode } })) newReferralCode = generateReferralCode();
  return { fullName, email: email.trim().toLowerCase(), phone, newReferralCode, referrer };
}
