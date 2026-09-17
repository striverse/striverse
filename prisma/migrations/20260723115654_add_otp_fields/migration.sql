/*
  Warnings:

  - You are about to drop the column `totalAvailable` on the `BonusWallet` table. All the data in the column will be lost.
  - You are about to drop the column `totalPending` on the `BonusWallet` table. All the data in the column will be lost.
  - You are about to drop the column `totalWithdrawn` on the `BonusWallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."BonusWallet" DROP COLUMN "totalAvailable",
DROP COLUMN "totalPending",
DROP COLUMN "totalWithdrawn";

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3);
