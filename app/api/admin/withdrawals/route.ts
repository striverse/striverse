import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
  const withdrawals = await prisma.referralWithdrawal.findMany({ orderBy:{createdAt:"desc"}, include:{user:{select:{id:true,fullName:true,email:true,referralCode:true}}} });
  return NextResponse.json({success:true, withdrawals});
}
