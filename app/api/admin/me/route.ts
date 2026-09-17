import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/adminAuth";
export async function GET(_req:NextRequest){const admin=await verifyAdmin();if(!admin)return NextResponse.json({success:false,message:"Unauthorized"},{status:401});return NextResponse.json({success:true,admin:{id:admin.id,fullName:admin.fullName,email:admin.email,role:admin.role,permissions:admin.role==='DEVELOPER'?['*']:admin.adminPermissions.filter(p=>p.enabled).map(p=>`${p.module}:${p.action}`)}});}
