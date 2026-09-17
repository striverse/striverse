import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
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

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Access denied.",
        },
        {
          status: 403,
        }
      );
    }

    const [
      totalUsers,
      verifiedUsers,
      purchases,
      pendingPurchases,
      approvedPurchases,
      rejectedPurchases,
      recentUsers,
      recentPurchases,
    ] = await Promise.all([
      prisma.user.count({
        where: {
          role: "USER",
        },
      }),

      prisma.user.count({
        where: {
          role: "USER",
          isVerified: true,
        },
      }),

      prisma.purchase.findMany(),

      prisma.purchase.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.purchase.count({
        where: {
          status: "APPROVED",
        },
      }),

      prisma.purchase.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.user.findMany({
        where: {
          role: "USER",
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      prisma.purchase.findMany({
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    const approved = purchases.filter(
  (purchase) => purchase.status === "APPROVED"
);

const totalRaised = approved.reduce(
  (sum, purchase) => sum + purchase.usdtAmount,
  0
);

const totalSTVSold = approved.reduce(
  (sum, purchase) => sum + purchase.stvAmount,
  0
);

    // Demo Sales Chart
    // Next version will load from database
    const last7Days = [];

for (let i = 6; i >= 0; i--) {
  const date = new Date();
  date.setDate(date.getDate() - i);

  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  const dailyPurchases = purchases.filter(
    (purchase) =>
      purchase.status === "APPROVED" &&
      purchase.createdAt >= start &&
      purchase.createdAt <= end
  );

  const amount = dailyPurchases.reduce(
    (sum, purchase) => sum + purchase.usdtAmount,
    0
  );

  last7Days.push({
  day: date.toLocaleDateString("en-US", {
    weekday: "short",
  }),
  total: amount,
});
}

    return NextResponse.json({
      success: true,

      analytics: {
        totalUsers,
        verifiedUsers,
        totalRaised,
        totalSTVSold,
        pendingPurchases,
        approvedPurchases,
        rejectedPurchases,
      },

      recentUsers,
      recentPurchases,
      
      salesChart: last7Days,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load analytics.",
      },
      {
        status: 500,
      }
    );
  }
}