import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await verifyAdmin();

if (!admin) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    {
      status: 401,
    }
  );
}
  try {
    const purchases = await prisma.purchase.findMany({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        createdAt: true,
        usdtAmount: true,
        status: true,
      },
    });

    const revenueMap = new Map<string, number>();

    purchases.forEach((purchase) => {
      if (purchase.status !== "APPROVED") return;

      const date = purchase.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      revenueMap.set(
        date,
        (revenueMap.get(date) || 0) + purchase.usdtAmount
      );
    });

    const revenue = Array.from(revenueMap.entries()).map(
      ([date, raised]) => ({
        date,
        raised,
      })
    );

    const status = [
      {
        name: "Approved",
        value: purchases.filter(
          (p) => p.status === "APPROVED"
        ).length,
      },
      {
        name: "Pending",
        value: purchases.filter(
          (p) => p.status === "PENDING"
        ).length,
      },
      {
        name: "Rejected",
        value: purchases.filter(
          (p) => p.status === "REJECTED"
        ).length,
      },
    ];

    return NextResponse.json({
      success: true,
      revenue,
      status,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load chart data.",
      },
      {
        status: 500,
      }
    );
  }
}