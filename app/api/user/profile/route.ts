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
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        walletAddress: true,
        isVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // STV balance is derived from approved purchases; User has no persisted
    // stvBalance field in the current Prisma schema.
    const stvAggregate = await prisma.purchase.aggregate({
      _sum: { stvAmount: true },
      where: {
        userId: user.id,
        status: "APPROVED",
      },
    });

    const stvBalance = stvAggregate._sum.stvAmount ?? 0;

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        stvBalance,
      },
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