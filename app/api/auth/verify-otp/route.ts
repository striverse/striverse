import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required.",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (user.isVerified) {
      return NextResponse.json({
        success: true,
        message: "Email already verified.",
      });
    }

    if (!user.otp || !user.otpExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP not found.",
        },
        {
          status: 400,
        }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid OTP.",
        },
        {
          status: 400,
        }
      );
    }

    if (new Date() > user.otpExpiresAt) {
      return NextResponse.json(
        {
          success: false,
          message: "OTP has expired.",
        },
        {
          status: 400,
        }
      );
    }

    await prisma.$transaction(async (tx) => {
      // Verify user
      await tx.user.update({
        where: {
          id: user.id,
        },
        data: {
          isVerified: true,
          otp: null,
          otpExpiresAt: null,
        },
      });

      // Create Purchase Wallet if it doesn't exist
      const purchaseWallet = await tx.purchaseWallet.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!purchaseWallet) {
        await tx.purchaseWallet.create({
          data: {
            userId: user.id,
          },
        });
      }

      // Create Bonus Wallet if it doesn't exist
      const bonusWallet = await tx.bonusWallet.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!bonusWallet) {
        await tx.bonusWallet.create({
          data: {
            userId: user.id,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "OTP verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}