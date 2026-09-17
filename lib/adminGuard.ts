import { NextRequest } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";

export async function requireStaff(_req?: NextRequest) {
  const user = await verifyAdmin();
  return user;
}

export async function requireDeveloper(_req?: NextRequest) {
  const user = await verifyAdmin();
  if (!user || user.role !== "DEVELOPER") return null;
  return user;
}
