import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Presale settings
    const settings = await prisma.presaleSettings.findFirst();

    if (!settings) {
      return NextResponse.json(
        {
          success: false,
          message: "Presale settings not found.",
        },
        {
          status: 404,
        }
      );
    }

    // Approved purchases total
    const aggregate = await prisma.purchase.aggregate({
      _sum: {
        usdtAmount: true,
      },
      where: {
        status: "APPROVED",
      },
    });

    // Investors count
    const approvedInvestors = await prisma.user.count({
  where: {
    purchases: {
      some: {
        status: "APPROVED",
      },
    },
  },
});
const investors =
  (settings.manualInvestors ?? 0) + approvedInvestors;

    // Raised amount
    const manualRaised = settings.raisedAmount ?? 0;
const approvedRaised = aggregate._sum.usdtAmount ?? 0;

const raised = manualRaised + approvedRaised;

    // Progress
    const progress =
      settings.hardCap > 0
        ? Number(((raised / settings.hardCap) * 100).toFixed(2))
        : 0;

    return NextResponse.json({
      success: true,

      raised,

      hardCap: settings.hardCap,

      tokenPrice: settings.tokenPrice,

      totalTokens: settings.totalTokens.toString(),

      endDate: settings.endDate,

      progress,

      investors,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load presale stats.",
      },
      {
        status: 500,
      }
    );
  }
}