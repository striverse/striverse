import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: string };

    const { walletAddress } = await req.json();

    if (!walletAddress || walletAddress.trim() === "") {
      return NextResponse.json(
        { message: "Wallet address is required." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        walletAddress,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Wallet updated successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}