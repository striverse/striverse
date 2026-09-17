import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";

export async function GET() {
  const admin = await verifyAdmin();

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
  try {
    const purchases = await prisma.purchase.findMany({
      
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    console.log("Purchases:", purchases);
    return NextResponse.json({
      success: true,
      purchases,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch purchases.",
      },
      {
        status: 500,
      }
    );
  }
}
