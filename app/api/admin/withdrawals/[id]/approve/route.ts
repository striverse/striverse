import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
export async function POST(_:Request,{params}:{params:Promise<{id:string}>}){
 if(!(await verifyAdmin())) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
 const {id}=await params;
 const item=await prisma.referralWithdrawal.findUnique({where:{id}});
 if(!item) return NextResponse.json({success:false,message:"Withdrawal not found."},{status:404});
 const updated=await prisma.referralWithdrawal.updateMany({where:{id,status:"PENDING"},data:{status:"APPROVED"}});
 if(updated.count!==1) return NextResponse.json({success:false,message:"Withdrawal is already processed or not found."},{status:409});
 await prisma.notification.create({data:{userId:item.userId,title:"Withdrawal approved",message:`Your ${item.amount.toFixed(2)} USDT withdrawal was approved by admin.`,type:"WITHDRAWAL_APPROVED"}});
 return NextResponse.json({success:true,message:"Withdrawal approved. Complete the external USDT transfer separately."});
}
