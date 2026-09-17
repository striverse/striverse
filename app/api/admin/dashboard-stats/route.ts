import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/adminGuard";

export async function GET() {
  try {
    const admin = await requireStaff();
    if (!admin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const [totalUsers, pendingPurchases, approvedPurchases, approvedRevenue] = await Promise.all([
      prisma.user.count({ where: { role: "USER" } }),
      prisma.purchase.count({ where: { status: "PENDING" } }),
      prisma.purchase.count({ where: { status: "APPROVED" } }),
      prisma.purchase.aggregate({
        _sum: { usdtAmount: true },
        where: { status: "APPROVED" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        pendingPurchases,
        approvedPurchases,
        revenue: approvedRevenue._sum.usdtAmount ?? 0,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Failed to load dashboard stats." }, { status: 500 });
  }
}
