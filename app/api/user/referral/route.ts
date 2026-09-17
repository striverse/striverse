import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie");

    if (!cookie) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        { success: false },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        referralCode: true,
        totalReferrals: true,
        referralEarnings: true,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });
  } catch {
    return NextResponse.json(
      { success: false },
      { status: 401 }
    );
  }
}