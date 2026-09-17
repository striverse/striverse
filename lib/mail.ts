const RESEND_API_URL = "https://api.resend.com/emails";

export async function sendOTP(email: string, otp: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and EMAIL_FROM must be configured to send OTP emails.");
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "STRIVERSE OTP Verification",
        html: `
          <div style="font-family:Arial,sans-serif;padding:20px;background:#f4f4f4">
            <div style="max-width:600px;margin:auto;background:#fff;padding:30px;border-radius:10px">
              <h2 style="text-align:center;color:#2563eb;">Welcome to STRIVERSE</h2>
              <p>Your OTP is:</p>
              <h1 style="text-align:center;font-size:42px;letter-spacing:8px;color:#2563eb;">${otp}</h1>
              <p>This OTP is valid for <strong>5 minutes</strong>.</p>
              <hr>
              <small>Do not share this OTP with anyone.</small>
            </div>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Resend API Error:", details);
      throw new Error(`Resend API request failed (${response.status}).`);
    }

    console.log("OTP Email Sent");
  } catch (error) {
    console.error("Resend Error:", error);
    throw error;
  }
}
