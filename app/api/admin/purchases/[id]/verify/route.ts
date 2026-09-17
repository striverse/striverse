import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin();
  if (!admin) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { confirmedNetwork, confirmedAmount, confirmedRecipient, confirmedToken, confirmedTx, confirmations } = body;
    const purchase = await prisma.purchase.findUnique({ where: { id } });
    if (!purchase) return NextResponse.json({ success: false, message: "Purchase not found." }, { status: 404 });
    if (purchase.status !== "PENDING") return NextResponse.json({ success: false, message: "Purchase is already processed." }, { status: 400 });
    const checks = [
      confirmedNetwork === purchase.network,
      Number(confirmedAmount) === purchase.usdtAmount,
      confirmedRecipient === purchase.walletAddress,
      confirmedTx === purchase.txHash,
      typeof confirmedToken === "string" && confirmedToken.trim().length >= 8,
      Number(confirmations) >= 1,
    ];
    if (checks.some((v) => !v)) {
      await prisma.purchase.update({ where: { id }, data: { verificationStatus: "FAILED", verificationMessage: "Verification checklist did not pass." } });
      return NextResponse.json({ success: false, message: "Verification checklist failed." }, { status: 400 });
    }
    const verified = await prisma.purchase.updateMany({
      where: { id, status: "PENDING", verificationStatus: "NOT_VERIFIED" },
      data: { verificationStatus: "VERIFIED", verificationMessage: "Admin verification checklist completed.", verifiedAt: new Date() },
    });
    if (verified.count !== 1) return NextResponse.json({ success: false, message: "Purchase verification was already processed." }, { status: 409 });
    return NextResponse.json({ success: true, message: "Purchase verified. It is now eligible for approval." });
  } catch (error) {
    console.error("Purchase verification error:", error);
    return NextResponse.json({ success: false, message: "Verification failed." }, { status: 500 });
  }
}
