import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

async function verifyAdmin(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      id: string;
      role: string;
    };

    if (decoded.role !== "DEVELOPER") {
      return null;
    }

    return decoded;
  } catch {
    return null;
  }
}

// GET SETTINGS
export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const settings = await prisma.presaleSettings.findFirst();

  if (!settings) {
    return NextResponse.json(
      {
        success: false,
        message: "Settings not initialized.",
      },
      {
        status: 404,
      }
    );
  }

  return NextResponse.json({
    success: true,
    settings: {
      ...settings,
      totalTokens: settings.totalTokens.toString(),
    },
  });
}

// UPDATE SETTINGS
export async function PUT(req: NextRequest) {
  const admin = await verifyAdmin(req);

  if (!admin) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body = await req.json();

  const current = await prisma.presaleSettings.findFirst();

  if (!current) {
    return NextResponse.json(
      {
        success: false,
        message: "Settings not initialized.",
      },
      {
        status: 404,
      }
    );
  }

  const updated = await prisma.presaleSettings.update({
    where: {
      id: current.id,
    },
    data: {
  tokenPrice: Number(body.tokenPrice),
  hardCap: Number(body.hardCap),
  raisedAmount: Number(body.raisedAmount),

  manualInvestors: Number(body.manualInvestors),

  totalTokens: BigInt(body.totalTokens),
  startDate: new Date(body.startDate),
  endDate: new Date(body.endDate),
},
  });

  return NextResponse.json({
    success: true,
    message: "Settings updated successfully.",
    settings: {
      ...updated,
      totalTokens: updated.totalTokens.toString(),
    },
  });
}