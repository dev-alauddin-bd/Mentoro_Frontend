import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set([
  "/",
  "/courses",
  "/about",
  "/contact",
  "/unauthorizationd",
]);

const AUTH_ROUTES = new Set(["/login", "/register", "/signup"]);

const DASHBOARD_BASE = "/dashboard";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("refreshToken")?.value;

  // skip next/static/api/files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // PUBLIC ROUTES
  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  // LOGIN / REGISTER
  if (AUTH_ROUTES.has(pathname)) {
    if (token) {
      // already logged in → go dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // PROTECTED DASHBOARD ROUTES
  if (pathname.startsWith(DASHBOARD_BASE)) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // token exists → allow route (NO backend call here)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/signup"],
};