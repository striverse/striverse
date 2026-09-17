import jwt, { JwtPayload } from "jsonwebtoken";

export interface UserJwtPayload {
  id: string;
  email: string;
  role: string;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

export function generateToken(payload: UserJwtPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: "7d",
  });
}

export function verifyToken(token: string): UserJwtPayload {
  try {
    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded === "string" ||
      !decoded ||
      typeof decoded !== "object"
    ) {
      throw new Error("Invalid token");
    }

    const payload = decoded as JwtPayload;

    return {
      id: payload.id as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error("JWT VERIFY ERROR:", error);
    throw error;
  }
}