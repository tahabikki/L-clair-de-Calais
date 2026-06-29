import { NextRequest, NextResponse } from "next/server";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";

function isProtectedRequest(request: NextRequest): boolean {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin")) return true;
  if (pathname === "/api/content" && request.method === "POST") return true;
  if (pathname === "/api/upload" && request.method === "POST") return true;
  return false;
}

function unauthorized(): NextResponse {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin"' }
  });
}

export function middleware(request: NextRequest): NextResponse {
  if (!isProtectedRequest(request)) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Basic ")) {
    return unauthorized();
  }

  const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  const [user, password] = decoded.split(":");

  if (user !== ADMIN_USER || password !== ADMIN_PASSWORD) {
    return unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content", "/api/upload"]
};
