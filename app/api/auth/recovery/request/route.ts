import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPhone = String(phone || "").replace(/\D/g, "");
    if (!normalizedEmail || !normalizedPhone) return NextResponse.json({ success: false, message: "Registered email and mobile number are required." }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || user.role !== "USER" || String(user.phone || "").replace(/\D/g, "") !== normalizedPhone) return NextResponse.json({ success: false, message: "Registered email and mobile number do not match." }, { status: 401 });
    if (user.recoveryUsed) return NextResponse.json({ success: false, message: "Your one-time recovery has already been used." }, { status: 409 });

    await prisma.user.update({ where: { id: user.id }, data: { recoveryRequestedAt: new Date() } });
    await prisma.notification.create({data:{userId:user.id,title:"Recovery request submitted",message:"Your one-time recovery reset request is pending admin verification.",type:"RECOVERY_REQUESTED"}});
    return NextResponse.json({ success: true, message: "Recovery request submitted for admin verification." });
  } catch (error) {
    console.error("Recovery request error:", error);
    return NextResponse.json({ success: false, message: "Unable to submit recovery request." }, { status: 500 });
  }
}
