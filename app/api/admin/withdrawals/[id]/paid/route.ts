import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdmin } from "@/lib/adminAuth";
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await verifyAdmin())) return NextResponse.json({success:false,message:"Unauthorized"},{status:401});
  const {id}=await params; const body=await req.json().catch(()=>({})); const payoutTxHash=String(body.payoutTxHash||"").trim();
  if(payoutTxHash.length<8||payoutTxHash.length>200) return NextResponse.json({success:false,message:"Enter the external payout transaction hash/reference."},{status:400});
  const item=await prisma.referralWithdrawal.findUnique({where:{id}}); if(!item) return NextResponse.json({success:false,message:"Withdrawal not found."},{status:404});
  const updated=await prisma.referralWithdrawal.updateMany({where:{id,status:"APPROVED"},data:{status:"PAID",payoutTxHash}});
  if(updated.count!==1) return NextResponse.json({success:false,message:"Only an approved withdrawal can be marked paid."},{status:409});
  await prisma.bonusWallet.update({where:{userId:item.userId},data:{referralWithdrawn:{increment:item.amount}}});
  await prisma.notification.create({data:{userId:item.userId,title:"Withdrawal paid",message:`Your ${item.amount.toFixed(2)} USDT withdrawal has been marked paid.`,type:"WITHDRAWAL_PAID"}});
  return NextResponse.json({success:true,message:"Withdrawal marked paid."});
}
