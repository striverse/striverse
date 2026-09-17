import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";

export async function POST(req: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { purchaseId, remarks } = await req.json();

    if (!purchaseId) {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const purchase = await prisma.purchase.findUnique({
      where: {
        id: purchaseId,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase not found.",
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
          message: `Purchase is already ${purchase.status.toLowerCase()}.`,
        },
        {
          status: 400,
        }
      );
    }

    await prisma.purchase.update({
      where: {
        id: purchaseId,
      },
      data: {
        status: "REJECTED",
      },
    });

    await prisma.notification.create({
      data: {
        userId: purchase.userId,
        title: "Purchase Rejected",
        message: remarks ? `Your ${purchase.packageName} purchase was rejected. ${remarks}` : `Your ${purchase.packageName} purchase was rejected. Please review the payment details and try again.`,
        type: "PURCHASE_REJECTED",
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
        message: "Reject failed.",
      },
      {
        status: 500,
      }
    );
  }
}