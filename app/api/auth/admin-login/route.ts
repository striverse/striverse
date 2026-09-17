import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/jwt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).trim().toLowerCase() },
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    if (user.role !== "ADMIN" && user.role !== "DEVELOPER") {
      return NextResponse.json(
        { message: "Admin or Developer access required." },
        { status: 403 }
      );
    }

    if (user.isBlocked) {
      return NextResponse.json({ message: "This account is blocked." }, { status: 403 });
    }

    const validPassword = await bcrypt.compare(String(password), user.password);
    if (!validPassword) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ message: "Unable to sign in." }, { status: 500 });
  }
}
