import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JWTPayload {
  userId: string;
  email: string;
}

// Create a JWT token
export function createToken(payload: JWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}

// Verify a JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Set auth cookie in response
export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

// Clear auth cookie
export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("auth_token");
}

// Get current user from cookies (for API routes)
export async function getCurrentUser(
  request: NextRequest,
): Promise<JWTPayload | null> {
  const token = request.cookies.get("auth_token")?.value;

  if (!token) return null;

  return verifyToken(token);
}

// Get current user from server components
export async function getCurrentUserFromCookies(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  return verifyToken(token);
}
