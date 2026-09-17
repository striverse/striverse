import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email address required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    // Security kosam user exists/no-exists reveal cheyyakunda same message ivvadam better.
    if (!user) {
      return NextResponse.json({
        success: true,
        message:
          "Account unte password reset instructions email ki pampincham.",
      });
    }

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    const token = crypto.randomBytes(32).toString("hex");

    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const resetUrl =
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    console.log("PASSWORD RESET URL:", resetUrl);

    return NextResponse.json({
      success: true,
      message:
        "Password reset link generate ayyindi. Email sending setup chesina tarvata email ki vastundi.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}