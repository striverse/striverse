import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { purchaseId } = await req.json();

    if (!purchaseId) {
      return NextResponse.json(
        { success: false, message: "Purchase ID is required." },
        { status: 400 }
      );
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
    });

    if (!purchase) {
      return NextResponse.json(
        { success: false, message: "Purchase not found." },
        { status: 404 }
      );
    }

    if (purchase.status === "APPROVED") {
      return NextResponse.json(
        { success: false, message: "Already approved." },
        { status: 400 }
      );
    }

    // Update purchase status
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        status: "APPROVED",
      },
    });

    const aggregate = await prisma.purchase.aggregate({
  _sum: {
    usdtAmount: true,
  },
  where: {
    status: "APPROVED",
  },
});

console.log("Approved Total:", aggregate._sum.usdtAmount);
    return NextResponse.json({
      success: true,
      message: "Purchase approved successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server Error",
      },
      {
        status: 500,
      }
    );
  }
}