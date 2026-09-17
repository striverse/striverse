import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
import { createUserNotification } from "@/lib/notifications";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await verifyAdmin();

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const { remarks } = await req.json();

    const purchase = await prisma.purchase.findUnique({
      where: {
        id,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase not found.",
        },
        { status: 404 }
      );
    }

    if (purchase.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase already processed.",
        },
        { status: 400 }
      );
    }

    await prisma.purchase.update({
      where: {
        id,
      },
      data: {
        status: "REJECTED",
        adminRemarks: remarks || null,
      },
    });

    await prisma.notification.create({
      data: {
        userId: purchase.userId,
        title: "Purchase rejected",
        message: remarks ? `Your ${purchase.packageName} purchase was rejected: ${remarks}` : `Your ${purchase.packageName} purchase was rejected by admin.`,
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
      { status: 500 }
    );
  }
}