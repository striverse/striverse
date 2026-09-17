type OTPData = {
  otp: string;
  expiresAt: number;
};

const otpStore = new Map<string, OTPData>();

// Generate 6-digit OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Save OTP for an email
export function saveOTP(email: string, otp: string) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
  });
}

// Verify OTP
export function verifyOTP(email: string, otp: string) {
  const data = otpStore.get(email);

  if (!data) {
    return {
      success: false,
      message: "OTP not found.",
    };
  }

  if (Date.now() > data.expiresAt) {
    otpStore.delete(email);

    return {
      success: false,
      message: "OTP expired.",
    };
  }

  if (data.otp !== otp) {
    return {
      success: false,
      message: "Invalid OTP.",
    };
  }

  otpStore.delete(email);

  return {
    success: true,
    message: "OTP Verified",
  };
}