import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const existing = await prisma.presaleSettings.findFirst();

  if (existing) {
    return NextResponse.json({
      message: "Already initialized",
    });
  }

  const settings = await prisma.presaleSettings.create({
    data: {
      tokenPrice: 0.0009,
      hardCap: 500000,
      raisedAmount: 150000,
      totalTokens: BigInt(8888888888),
      startDate: new Date(),
      endDate: new Date("2026-08-08T23:59:59"),
    },
  });

  return NextResponse.json(settings);
}