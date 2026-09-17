import { NextRequest, NextResponse } from "next/server";

import { generateOTP, saveOTP } from "@/lib/otp";
import { sendOTP } from "@/lib/mail";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email } = body;

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email is required.",
        },
        {
          status: 400,
        }
      );
    }

    // Generate OTP
    const otp = generateOTP();

    // Save OTP in memory
    saveOTP(email, otp);

    // Send OTP Email
    await sendOTP(email, otp);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (error) {
    console.error("Send OTP Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to send OTP.",
      },
      {
        status: 500,
      }
    );
  }
}