import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

function userId(req: Request) {
  const token = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("token="))?.split("=")[1];
  if (!token) return null;
  try { return (jwt.verify(token, process.env.JWT_SECRET!) as { id: string }).id; } catch { return null; }
}

export async function GET(req: Request) {
  const id = userId(req);
  if (!id) return NextResponse.json({ success: false }, { status: 401 });
  const notifications = await prisma.notification.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 30 });
  const unread = await prisma.notification.count({ where: { userId: id, isRead: false } });
  return NextResponse.json({ success: true, notifications, unread });
}

export async function PATCH(req: Request) {
  const id = userId(req);
  if (!id) return NextResponse.json({ success: false }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body.all === true) await prisma.notification.updateMany({ where: { userId: id, isRead: false }, data: { isRead: true } });
  else if (typeof body.id === "string") await prisma.notification.updateMany({ where: { id: body.id, userId: id }, data: { isRead: true } });
  return NextResponse.json({ success: true });
}
