import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("User@123", 10);

  const user = await prisma.user.upsert({
    where: {
      email: "user@striverse.com",
    },

    update: {
      password,
      isVerified: true,
      role: "USER",
    },

    create: {
      fullName: "Test User",
      email: "user@striverse.com",
      phone: "9999999999",
      password,

      isVerified: true,
      role: "USER",

      referralCode: "STVTEST001",
    },
  });

  console.log("✅ Test User Ready");
  console.log("Email:", user.email);
  console.log("Referral Code:", user.referralCode);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });