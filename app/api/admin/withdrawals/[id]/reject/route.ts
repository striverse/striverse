import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){
 if(!(await verifyAdmin())) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
 const {id}=await params; const body=await req.json().catch(()=>({})); const remarks=String(body.remarks||"").slice(0,500);
 const result=await prisma.$transaction(async tx=>{
  const item=await tx.referralWithdrawal.findUnique({where:{id}}); if(!item) throw new Error("NOT_FOUND");
  const updated=await tx.referralWithdrawal.updateMany({where:{id,status:"PENDING"},data:{status:"REJECTED",adminRemarks:remarks}}); if(updated.count!==1) throw new Error("PROCESSED");
  const wallet=await tx.bonusWallet.update({where:{userId:item.userId},data:{referralAvailable:{increment:item.amount}}});
  await tx.notification.create({data:{userId:item.userId,title:"Withdrawal rejected",message:remarks?`Your ${item.amount.toFixed(2)} USDT withdrawal was rejected: ${remarks}`:`Your ${item.amount.toFixed(2)} USDT withdrawal was rejected. The amount has been returned to your available referral balance.`,type:"WITHDRAWAL_REJECTED"}});
  return wallet.referralAvailable;
 });
 return NextResponse.json({success:true,message:"Withdrawal rejected and amount returned to available referral balance.",available:result});
}
