import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function verifyAdmin() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id:string; email:string; role:string };
    const user = await prisma.user.findUnique({where:{id:decoded.id},include:{adminPermissions:true}});
    if (!user || (user.role !== "ADMIN" && user.role !== "DEVELOPER") || user.isBlocked) return null;
    return user;
  } catch { return null; }
}

export async function hasAdminPermission(userId:string,module:string,action="VIEW") {
  const user=await prisma.user.findUnique({where:{id:userId},select:{role:true}});
  if(user?.role==="DEVELOPER") return true;
  const p=await prisma.adminPermission.findUnique({where:{adminId_module_action:{adminId:userId,module,action}}});
  return Boolean(p?.enabled);
}
