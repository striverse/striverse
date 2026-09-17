-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Network" AS ENUM ('BEP20', 'ERC20', 'TRC20');

-- CreateEnum
CREATE TYPE "public"."PurchaseStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "public"."Rank" AS ENUM ('STRIVE_ONE', 'STRIVE_PRIME', 'STRIVE_CORE', 'STRIVE_LEGEND', 'STRIVE_X');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."UserRole" NOT NULL DEFAULT 'USER',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "referralCode" TEXT NOT NULL,
    "referredById" TEXT,
    "totalReferrals" INTEGER NOT NULL DEFAULT 0,
    "referralEarnings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "image" TEXT,
    "country" TEXT,
    "walletAddress" TEXT,
    "walletNetwork" "public"."Network",
    "currentRank" "public"."Rank" NOT NULL DEFAULT 'STRIVE_ONE',
    "directBusiness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "withdrawEnabled" BOOLEAN NOT NULL DEFAULT true,
    "purchaseEnabled" BOOLEAN NOT NULL DEFAULT true,
    "bonusConversionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "walletLocked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Purchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usdtAmount" DOUBLE PRECISION NOT NULL,
    "stvAmount" DOUBLE PRECISION NOT NULL,
    "network" "public"."Network" NOT NULL,
    "txHash" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "proofImage" TEXT NOT NULL,
    "status" "public"."PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "adminRemarks" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PresaleSettings" (
    "id" TEXT NOT NULL,
    "tokenPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0009,
    "hardCap" DOUBLE PRECISION NOT NULL DEFAULT 500000,
    "raisedAmount" DOUBLE PRECISION NOT NULL DEFAULT 150000,
    "manualInvestors" INTEGER NOT NULL DEFAULT 0,
    "totalTokens" BIGINT NOT NULL DEFAULT 8888888888,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PresaleSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PurchaseWallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalPurchasedUSDT" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPurchasedSTV" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "lockedSTV" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unlockedSTV" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "purchaseCount" INTEGER NOT NULL DEFAULT 0,
    "lastPurchaseAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PurchaseWallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BonusWallet" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cashbackPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashbackAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cashbackWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referralPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referralAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "referralWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "performancePending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "performanceAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "performanceWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specialPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specialAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "specialWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalAvailable" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalPending" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalWithdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BonusWallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "public"."User"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_txHash_key" ON "public"."Purchase"("txHash");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseWallet_userId_key" ON "public"."PurchaseWallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BonusWallet_userId_key" ON "public"."BonusWallet"("userId");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PurchaseWallet" ADD CONSTRAINT "PurchaseWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BonusWallet" ADD CONSTRAINT "BonusWallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
