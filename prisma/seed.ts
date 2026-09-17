import { PrismaClient, UserRole, Rank } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const packageDefaults = [
  ["LUNA", 100, 100000, 1],
  ["AURORA", 300, 300000, 2],
  ["ANDROMEDA", 500, 500000, 3],
  ["ORION", 700, 700000, 4],
  ["CELESTIA", 1000, 1000000, 5],
] as const;

async function upsertStaff(fullName: string, email: string, phone: string, password: string, role: UserRole, referralCode: string) {
  const hashed = await bcrypt.hash(password, 10);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { fullName, phone, password: hashed, role, isVerified: true, referralCode, currentRank: Rank.STRIVE_ONE },
    });
    console.log(`✓ Updated ${role}: ${email}`);
  } else {
    await prisma.user.create({
      data: { fullName, email, phone, password: hashed, role, isVerified: true, referralCode, currentRank: Rank.STRIVE_ONE },
    });
    console.log(`✓ Created ${role}: ${email}`);
  }
}

async function main() {
  // Exactly one Developer + three Admin test accounts.
  await upsertStaff("Developer", "developer@striverse.com", "9999999998", "Developer@123", UserRole.DEVELOPER, "DEV10001");
  await upsertStaff("Admin One", "admin@striverse.com", "9999999999", "Admin@123", UserRole.ADMIN, "ADMIN10001");
  await upsertStaff("Admin Two", "admin2@striverse.com", "9999999997", "Admin@123", UserRole.ADMIN, "ADMIN10002");
  await upsertStaff("Admin Three", "admin3@striverse.com", "9999999996", "Admin@123", UserRole.ADMIN, "ADMIN10003");

  for (const [name, usdtAmount, stvAmount, sortOrder] of packageDefaults) {
    await prisma.presalePackage.upsert({
      where: { name },
      update: { usdtAmount, sortOrder, isActive: true },
      create: { name, usdtAmount, stvAmount, sortOrder, isActive: true },
    });
  }

  await prisma.partnerRewardConfig.upsert({where:{id:"default-partner-config"},create:{id:"default-partner-config",directPercent:20,level1Percent:15,level2Percent:10,level3Percent:5,unlockHours:24,minWithdrawalUSDT:50,conversionRate:1000,settlementDays:10,withdrawalProcessingHours:48,operatingStartHour:10,operatingEndHour:18,timezone:"Asia/Kolkata",special3Set:50,special6Set:150,special9Set:300},update:{}});
  const adminModules=["users","purchases","withdrawals","referrals","notifications","analytics"];
  for (const email of ["admin@striverse.com","admin2@striverse.com","admin3@striverse.com"]) { const a=await prisma.user.findUnique({where:{email}}); if(a) { await prisma.adminPermission.deleteMany({where:{adminId:a.id}}); await prisma.adminPermission.createMany({data:adminModules.map(module=>({adminId:a.id,module,action:"VIEW",scope:"ASSIGNED",enabled:true}))}); } }
  console.log("✓ Presale packages and Partner Program configuration seeded");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
