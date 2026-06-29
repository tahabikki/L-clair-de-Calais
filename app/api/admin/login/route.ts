import { NextResponse, NextRequest } from "next/server";
import { createSessionToken, COOKIE_NAME } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USER || "admin";
  const validPassword = process.env.ADMIN_PASSWORD || "changeme";

  if (username !== validUser || password !== validPassword) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
