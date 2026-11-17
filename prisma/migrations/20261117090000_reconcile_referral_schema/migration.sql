CREATE TABLE IF NOT EXISTS "ReferralConversion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "usdtAmount" DOUBLE PRECISION NOT NULL,
    "stvAmount" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL DEFAULT 1000,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReferralConversion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ReferralConversion_userId_createdAt_idx"
ON "ReferralConversion"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "ReferralWithdrawal_userId_status_idx"
ON "ReferralWithdrawal"("userId", "status");

CREATE INDEX IF NOT EXISTS "SecurityAuditLog_userId_createdAt_idx"
ON "SecurityAuditLog"("userId", "createdAt");

CREATE INDEX IF NOT EXISTS "SecurityAuditLog_action_createdAt_idx"
ON "SecurityAuditLog"("action", "createdAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'ReferralWithdrawal_userId_fkey'
          AND conrelid = '"ReferralWithdrawal"'::regclass
    ) THEN
        ALTER TABLE "ReferralWithdrawal"
        ADD CONSTRAINT "ReferralWithdrawal_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'ReferralConversion_userId_fkey'
          AND conrelid = '"ReferralConversion"'::regclass
    ) THEN
        ALTER TABLE "ReferralConversion"
        ADD CONSTRAINT "ReferralConversion_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END
$$;
