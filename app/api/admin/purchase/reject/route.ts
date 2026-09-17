import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { purchaseId } = await req.json();

    await prisma.purchase.update({
      where: {
        id: purchaseId,
      },
      data: {
        status: "REJECTED",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Purchase rejected successfully.",
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