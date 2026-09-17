import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not configured.");
    }

    const decoded = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      include: {
        purchaseWallet: true,
        bonusWallet: true,
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

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        image: user.image,
        country: user.country,
        walletAddress: user.walletAddress,
        currentRank: user.currentRank,
        totalReferrals: user.totalReferrals,
        referralEarnings: user.referralEarnings,
        directBusiness: user.directBusiness,

        wallet: {
          totalPurchasedUSDT:
            user.purchaseWallet?.totalPurchasedUSDT ?? 0,
          totalPurchasedSTV:
            user.purchaseWallet?.totalPurchasedSTV ?? 0,
          lockedSTV:
            user.purchaseWallet?.lockedSTV ?? 0,
          unlockedSTV:
            user.purchaseWallet?.unlockedSTV ?? 0,
          purchaseCount:
            user.purchaseWallet?.purchaseCount ?? 0,
        },

        bonus: {
          cashback: {
            pending:
              user.bonusWallet?.cashbackPending ?? 0,
            available:
              user.bonusWallet?.cashbackAvailable ?? 0,
            withdrawn:
              user.bonusWallet?.cashbackWithdrawn ?? 0,
          },

          referral: {
            pending:
              user.bonusWallet?.referralPending ?? 0,
            available:
              user.bonusWallet?.referralAvailable ?? 0,
            withdrawn:
              user.bonusWallet?.referralWithdrawn ?? 0,
          },

          performance: {
            pending:
              user.bonusWallet?.performancePending ?? 0,
            available:
              user.bonusWallet?.performanceAvailable ?? 0,
            withdrawn:
              user.bonusWallet?.performanceWithdrawn ?? 0,
          },

          special: {
            pending:
              user.bonusWallet?.specialPending ?? 0,
            available:
              user.bonusWallet?.specialAvailable ?? 0,
            withdrawn:
              user.bonusWallet?.specialWithdrawn ?? 0,
          },
        },
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized.",
      },
      {
        status: 401,
      }
    );
  }
}