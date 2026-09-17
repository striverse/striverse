import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest) {
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
      id: string;
    };

    const {
      fullName,
      phone,
      walletAddress,
    } = await req.json();

    const user = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        fullName,
        phone,
        walletAddress,
      },
    });

    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}