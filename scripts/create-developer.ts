import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const email = process.env.DEVELOPER_EMAIL?.trim().toLowerCase();
const password = process.env.DEVELOPER_PASSWORD;
const fullName = process.env.DEVELOPER_NAME?.trim() || "STRIVERSE Developer";

if (!email || !password) {
  throw new Error("Set DEVELOPER_EMAIL and DEVELOPER_PASSWORD before running this script.");
}

if (password.length < 12) {
  throw new Error("DEVELOPER_PASSWORD must be at least 12 characters long.");
}

async function main() {
  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing && existing.role === "USER") {
    throw new Error(`Refusing to promote existing USER account ${email}. Use a dedicated developer email.`);
  }

  const user = existing
    ? await prisma.user.update({
        where: { email },
        data: {
          fullName,
          password: passwordHash,
          role: "DEVELOPER",
          isBlocked: false,
          isVerified: true,
        },
      })
    : await prisma.user.create({
        data: {
          fullName,
          email,
          phone: "",
          password: passwordHash,
          role: "DEVELOPER",
          isVerified: true,
          referralCode: `DEV-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`,
        },
      });

  console.log(`Developer account ready: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
