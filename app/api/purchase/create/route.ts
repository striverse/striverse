import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/jwt";
import { Network, PurchaseStatus } from "@prisma/client";
import { getPartnerConfig } from "@/lib/partner-config";
import { isWithinOperatingHours } from "@/lib/operating-hours";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie");

    if (!cookieHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const token = cookieHeader
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const decoded = verifyToken(token);

    const formData = await req.formData();

    const usdtAmount = formData.get("usdtAmount") as string;
    const submittedPackageName = formData.get("packageName") as string | null;
    const network = formData.get("network") as string;
    const txHash = formData.get("txHash") as string;
    const walletAddress = formData.get("walletAddress") as string;
    const proofFile = formData.get("proofImage") as File | null;

    if (
      !usdtAmount ||
      !network ||
      !txHash ||
      !walletAddress ||
      !proofFile
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required.",
        },
        {
          status: 400,
        }
      );
    }

    const packageNamesByAmount: Record<number, string> = {
      100: "LUNA",
      300: "AURORA",
      500: "ANDROMEDA",
      700: "ORION",
      1000: "CELESTIA",
    };
    const packageName = submittedPackageName?.trim() || packageNamesByAmount[Number(usdtAmount)];

    if (!packageName) {
      return NextResponse.json(
        { success: false, message: "Invalid package selected." },
        { status: 400 }
      );
    }

    const selectedPackage = await prisma.presalePackage.findFirst({
      where: { name: packageName, isActive: true },
    });

    if (!selectedPackage) {
      return NextResponse.json({ success: false, message: "Invalid or inactive package." }, { status: 400 });
    }

    const MAX_PROOF_BYTES = 8 * 1024 * 1024;
    const allowedProofTypes = new Set(["image/png", "image/jpeg"]);
    if (!allowedProofTypes.has(proofFile.type) || proofFile.size <= 0 || proofFile.size > MAX_PROOF_BYTES) {
      return NextResponse.json(
        { success: false, message: "Payment proof must be a PNG or JPEG image up to 8MB." },
        { status: 400 }
      );
    }

    const normalizedTxHash = txHash.trim();
    const normalizedWalletAddress = walletAddress.trim();
    if (normalizedTxHash.length < 8 || normalizedTxHash.length > 200 || normalizedWalletAddress.length < 8 || normalizedWalletAddress.length > 120) {
      return NextResponse.json(
        { success: false, message: "Invalid transaction hash or wallet address." },
        { status: 400 }
      );
    }

    // Validate package + exact amount; never trust a client-calculated STV amount.
    const amount = Number(usdtAmount);

    if (amount !== selectedPackage.usdtAmount) {
      return NextResponse.json(
        {
          success: false,
          message: "Purchase amount does not match the selected package.",
        },
        {
          status: 400,
        }
      );
    }

    // Validate network
    const validNetworks = Object.values(Network);

if (!validNetworks.includes(network as Network)) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid network.",
    },
    {
      status: 400,
    }
  );
}

const networkEnum = network as Network;

    // Check duplicate transaction hash
    const existingPurchase = await prisma.purchase.findUnique({
      where: {
        txHash,
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction hash already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // STV presale closes on April 8, 2027 at 23:59:59 IST.
    // Enforce the same cutoff on the server so purchases cannot be submitted after the public countdown ends.
    const presaleSettings = await prisma.presaleSettings.findFirst();
    const presaleEnd = presaleSettings?.endDate ?? new Date("2027-04-08T18:29:59.000Z");
    if (new Date() > presaleEnd) {
      return NextResponse.json(
        { success: false, message: "STV Token Presale has ended. New purchases are no longer accepted." },
        { status: 403 }
      );
    }

    // Check operating hours before writing the payment proof to disk.
    const partnerConfig = await getPartnerConfig();
    if (!isWithinOperatingHours(new Date(), partnerConfig.timezone, partnerConfig.operatingStartHour, partnerConfig.operatingEndHour)) {
      return NextResponse.json({success:false,message:`Purchases are accepted only between ${partnerConfig.operatingStartHour}:00 and ${partnerConfig.operatingEndHour}:00 (${partnerConfig.timezone}).`},{status:403});
    }

    // Create uploads folder
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads"
    );

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, {
        recursive: true,
      });
    }

    // Generate unique filename
    const extension = proofFile.type === "image/jpeg" ? "jpg" : "png";

    const filename = `${crypto.randomUUID()}.${extension}`;

    // Save screenshot
    const bytes = await proofFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    fs.writeFileSync(
      path.join(uploadDir, filename),
      buffer
    );

    // Create purchase. Direct reward is configured centrally; package-level referral percentages are not used.
    const purchase = await prisma.purchase.create({
      data: {
        userId: decoded.id,
        usdtAmount: amount,
        stvAmount: selectedPackage.stvAmount,
        packageName: selectedPackage.name,
        referralBonusUSDT: amount * (partnerConfig.directPercent / 100),
        referralUnlockAt: new Date(Date.now() + partnerConfig.unlockHours * 60 * 60 * 1000),
        network: networkEnum,
        txHash: normalizedTxHash,
        walletAddress: normalizedWalletAddress,
        proofImage: `/uploads/${filename}`,
        status: PurchaseStatus.PENDING,
      },
    });

    await prisma.notification.create({
      data: {
        userId: decoded.id,
        title: "Purchase submitted",
        message: `${packageName} purchase for ${amount} USDT is pending admin verification.`,
        type: "PURCHASE_PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Purchase submitted successfully.",
      purchase,
    });
  } catch (error) {
    console.error("Purchase Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Purchase failed.",
      },
      {
        status: 500,
      }
    );
  }
}