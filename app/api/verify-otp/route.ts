import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and OTP are required.",
        },
        { status: 400 }
      );
    }

    const result = verifyOTP(email, otp);

    if (!result.success) {
      return NextResponse.json(result, {
        status: 400,
      });
    }

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully.",
    });

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification failed.",
      },
      {
        status: 500,
      }
    );
  }
}