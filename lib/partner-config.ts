import { prisma } from "@/lib/prisma";

export const DEFAULT_PARTNER_CONFIG = {
  directPercent: 20,
  level1Percent: 15,
  level2Percent: 10,
  level3Percent: 5,
  unlockHours: 24,
  minWithdrawalUSDT: 50,
  conversionRate: 1000,
  settlementDays: 10,
  withdrawalProcessingHours: 48,
  operatingStartHour: 10,
  operatingEndHour: 18,
  timezone: "Asia/Kolkata",
  special3Set: 50,
  special6Set: 150,
  special9Set: 300,
};

export async function getPartnerConfig(tx: typeof prisma = prisma) {
  return tx.partnerRewardConfig.upsert({
    where: { id: "default-partner-config" },
    create: { id: "default-partner-config", ...DEFAULT_PARTNER_CONFIG },
    update: {},
  });
}

export function assertPercentages(values: Record<string, unknown>) {
  const names = ["directPercent", "level1Percent", "level2Percent", "level3Percent"];
  for (const name of names) {
    const value = Number(values[name]);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      throw new Error(`Invalid ${name}`);
    }
  }
}
