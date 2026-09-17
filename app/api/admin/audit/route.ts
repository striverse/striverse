import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

    const payload = verifyToken(token);
    if (payload.role !== "ADMIN") return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action")?.trim() || undefined;
    const limit = Math.min(Math.max(Number(searchParams.get("limit") || 100), 1), 200);

    const logs = await prisma.securityAuditLog.findMany({
      where: action ? { action } : undefined,
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ success: true, logs });
  } catch {
    return NextResponse.json({ success: false, message: "Unable to load audit logs" }, { status: 500 });
  }
}
