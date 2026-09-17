import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireDeveloper, requireStaff } from "@/lib/adminGuard";

export async function GET(){
 const admin=await requireDeveloper();
 if(!admin) return NextResponse.json({success:false,message:"Developer access required."},{status:403});
 return NextResponse.json({success:true,wallets:await prisma.paymentWallet.findMany({orderBy:{network:"asc"}})});
}
export async function PUT(req:NextRequest){
 const admin=await requireDeveloper(req);
 if(!admin) return NextResponse.json({success:false,message:"Developer access required."},{status:403});
 const body=await req.json();
 if(!Array.isArray(body.wallets)) return NextResponse.json({success:false,message:"Invalid wallets"},{status:400});
 for(const w of body.wallets){
  if(!["TRC20","BEP20","ERC20"].includes(w.network) || typeof w.address!=="string" || w.address.trim().length<8) return NextResponse.json({success:false,message:"Invalid wallet configuration"},{status:400});
  await prisma.paymentWallet.upsert({where:{network:w.network},update:{address:w.address.trim(),isActive:w.isActive!==false},create:{network:w.network,address:w.address.trim(),isActive:w.isActive!==false}});
 }
 await prisma.securityAuditLog.create({data:{userId:admin.id,actorRole:admin.role,action:"PAYMENT_WALLETS_UPDATED",metadata:JSON.stringify({networks:body.wallets.map((w:any)=>w.network)})}});
 return NextResponse.json({success:true,message:"Payment wallets updated."});
}
