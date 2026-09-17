ALTER TABLE "User" ADD COLUMN "recoveryResetCodeHash" TEXT;
ALTER TABLE "User" ADD COLUMN "recoveryResetCodeExpiresAt" TIMESTAMP(3);
