import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const session = verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { id: true, email: true, recoveryCreatedAt: true, recoveryUsed: true, recoveryRequestedAt: true, recoveryResetAt: true, isBlocked: true, walletLocked: true, updatedAt: true },
    });
    if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    return NextResponse.json({ success: true, security: {
      recovery: { configured: Boolean(user.recoveryCreatedAt), used: user.recoveryUsed, requestedAt: user.recoveryRequestedAt, resetAt: user.recoveryResetAt },
      account: { blocked: user.isBlocked, walletLocked: user.walletLocked },
      session: { lastAccountUpdate: user.updatedAt },
    }});
  } catch {
    return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    const session = verifyToken(token);
    const body = await req.json().catch(() => ({}));
    const action = body?.action;
    const allowed = ["SETTINGS_VIEW", "LOGOUT", "RECOVERY_VIEW", "REFERRAL_VIEW"];
    if (!allowed.includes(action)) return NextResponse.json({ success: false, message: "Invalid security action" }, { status: 400 });
    await prisma.securityAuditLog.create({ data: {
      userId: session.id,
      actorRole: session.role === "ADMIN" ? "ADMIN" : "USER",
      action,
      metadata: JSON.stringify({ path: req.nextUrl.pathname }),
      ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      userAgent: req.headers.get("user-agent") ?? null,
    }});
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to record security event" }, { status: 500 });
  }
}
