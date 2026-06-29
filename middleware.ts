import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/adminAuth";

function isProtectedRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") return true;
  if (pathname === "/api/content" && request.method === "POST") return true;
  if (pathname === "/api/upload" && request.method === "POST") return true;
  return false;
}

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (!isProtectedRequest(request)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const isValid = await verifySessionToken(token);

  if (isValid) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/admin")) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export const config = {
  matcher: ["/admin/:path*", "/api/content", "/api/upload"]
};
