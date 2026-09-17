import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await prisma.user.update({
    where: {
      email: "admin@striverse.com",
    },
    data: {
      password: hashedPassword,
    },
  });

  console.log("✅ Admin password reset successfully!");
  console.log("Email: admin@striverse.com");
  console.log("Password: admin123");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });