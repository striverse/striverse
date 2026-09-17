import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDeveloper, requireStaff } from "@/lib/adminGuard";

export async function GET() {
  const admin = await requireDeveloper();
  if (!admin) return NextResponse.json({ success:false, message:"Developer access required." }, {status:403});
  const packages = await prisma.presalePackage.findMany({ orderBy:{sortOrder:"asc"} });
  return NextResponse.json({success:true, packages});
}

export async function PUT(req: NextRequest) {
  const admin = await requireDeveloper(req);
  if (!admin) return NextResponse.json({ success:false, message:"Developer access required." }, {status:403});
  const body = await req.json();
  if (!Array.isArray(body.packages) || body.packages.length < 1 || body.packages.length > 10) {
    return NextResponse.json({success:false,message:"Provide valid package records."},{status:400});
  }
  for (const item of body.packages) {
    if (!item.name || Number(item.usdtAmount) <= 0 || Number(item.stvAmount) <= 0) {
      return NextResponse.json({success:false,message:"Invalid package values."},{status:400});
    }
  }
  await prisma.$transaction(async tx => {
    for (const item of body.packages) {
      await tx.presalePackage.upsert({
        where:{name:String(item.name)},
        update:{usdtAmount:Number(item.usdtAmount),stvAmount:Number(item.stvAmount),isActive:item.isActive !== false,sortOrder:Number(item.sortOrder ?? 0),isCollapsed:item.isCollapsed === true},
        create:{name:String(item.name),usdtAmount:Number(item.usdtAmount),stvAmount:Number(item.stvAmount),isActive:item.isActive !== false,sortOrder:Number(item.sortOrder ?? 0),isCollapsed:item.isCollapsed === true},
      });
    }
    await tx.securityAuditLog.create({data:{userId:admin.id,actorRole:admin.role,action:"PACKAGES_UPDATED",metadata:JSON.stringify({count:body.packages.length})}});
  });
  return NextResponse.json({success:true,message:"Packages updated."});
}
