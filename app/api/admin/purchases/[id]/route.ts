import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const { status, remarks } = await req.json();

    if (!["APPROVED", "REJECTED"].includes(status)) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid status",
    },
    {
      status: 400,
    }
  );
}

    const purchase = await prisma.purchase.findUnique({
      where: { id },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase not found",
        },
        {
          status: 404,
        }
      );
    }

    if (purchase.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase already processed",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.purchase.update({
        where: { id },
        data: {
          status,
          adminRemarks: remarks,
        },
      });

      if (status === "APPROVED") {
        await tx.purchaseWallet.update({
          where: { userId: purchase.userId },
          data: {
            totalPurchasedUSDT: { increment: purchase.usdtAmount },
            totalPurchasedSTV: { increment: purchase.stvAmount },
            lockedSTV: { increment: purchase.stvAmount },
            purchaseCount: { increment: 1 },
            lastPurchaseAt: new Date(),
          },
        });

        if (purchase.referralBonusUSDT > 0) {
          const buyer = await tx.user.findUnique({ where: { id: purchase.userId }, select: { referredById: true } });
          if (buyer?.referredById) {
            await tx.bonusWallet.upsert({
              where: { userId: buyer.referredById },
              create: { userId: buyer.referredById, referralPending: purchase.referralBonusUSDT },
              update: { referralPending: { increment: purchase.referralBonusUSDT } },
            });
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: `Purchase ${status.toLowerCase()} successfully.`,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}