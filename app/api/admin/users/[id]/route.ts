import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get JWT Token
    const token = req.cookies.get("token")?.value;

    if (!token) {
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

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as {
      role: string;
    };

    if (decoded.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    // Get User ID
    const { id } = await params;

    // Find User
    const user = await prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        purchases: {
          orderBy: {
            createdAt: "desc",
          },

          select: {
            id: true,
            usdtAmount: true,
            stvAmount: true,
            network: true,
            walletAddress: true,
            txHash: true,
            proofImage: true,
            status: true,
            adminRemarks: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // Calculate Totals
    const totalUSDT = user.purchases.reduce(
      (sum, purchase) => sum + purchase.usdtAmount,
      0
    );

    const totalSTV = user.purchases.reduce(
      (sum, purchase) => sum + purchase.stvAmount,
      0
    );

    const approvedPurchases = user.purchases.filter(
      (purchase) => purchase.status === "APPROVED"
    ).length;

    const pendingPurchases = user.purchases.filter(
      (purchase) => purchase.status === "PENDING"
    ).length;

    const rejectedPurchases = user.purchases.filter(
      (purchase) => purchase.status === "REJECTED"
    ).length;
    console.log(user?.purchases);
    return NextResponse.json({
      success: true,

      user,

      analytics: {
        totalPurchases: user.purchases.length,
        approvedPurchases,
        pendingPurchases,
        rejectedPurchases,
        totalUSDT,
        totalSTV,
      },

      totalUSDT,
      totalSTV,
    });
  } catch (error) {
    console.error("User Details Error:", error);
     
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await prisma.user.findUnique({where:{id:(jwt.verify(req.cookies.get("token")?.value||"",process.env.JWT_SECRET!) as {id:string}).id}});
    if (!admin || (admin.role!=="ADMIN" && admin.role!=="DEVELOPER")) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
    const {id}=await params; const body=await req.json();
    const data:any={};
    if(typeof body.isBlocked==='boolean') data.isBlocked=body.isBlocked;
    if(admin.role==='DEVELOPER' && typeof body.walletLocked==='boolean') data.walletLocked=body.walletLocked;
    if(!Object.keys(data).length)return NextResponse.json({success:false,message:"No permitted changes."},{status:400});
    const user=await prisma.user.update({where:{id},data,select:{id:true,fullName:true,isBlocked:true,walletLocked:true}});
    await prisma.securityAuditLog.create({data:{userId:admin.id,actorRole:admin.role,action:"USER_STATUS_UPDATED",metadata:JSON.stringify({targetUserId:id,changes:data})}});
    return NextResponse.json({success:true,user});
  } catch(e){console.error(e);return NextResponse.json({success:false,message:"Failed to update user."},{status:500});}
}
