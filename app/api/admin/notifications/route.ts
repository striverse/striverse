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
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // Pending purchases
    const pendingPurchases = await prisma.purchase.count({
      where: {
        status: "PENDING",
      },
    });

    const pendingWithdrawals = await prisma.referralWithdrawal.count({ where: { status: "PENDING" } });

    // Users waiting for verification
    const pendingUsers = await prisma.user.count({
      where: {
        isVerified: false,
      },
    });

    return NextResponse.json({
      success: true,
      pendingPurchases,
      pendingUsers,
      pendingWithdrawals,
      unread: pendingPurchases + pendingUsers + pendingWithdrawals,
    });
  } catch (error) {
    console.error("Notifications API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}