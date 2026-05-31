// proxy.ts (Legacy reference - use middleware.ts for Next.js 13+)
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = new Set(["/", "/courses", "/about", "/contact", "/unauthorizationd"]);
const LOGIN_REGISTER = new Set(["/login", "/register", "/signup"]);
const DASHBOARD_BASE = "/dashboard";

const ROLE_DASHBOARDS: Record<string, string> = {
  admin: "/dashboard/admin",
  instructor: "/dashboard/instructor",
  student: "/dashboard/student",
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("refreshToken")?.value;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }


  const verifySessionWithBackend = async (): Promise<string | null> => {
    if (!token) return null;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-session`, {
        method: "GET",
        headers: {
          "Cookie": `refreshToken=${token}`,
        },
        cache: "no-store"
      });
      if (!res.ok) return null;
      const result = await res.json();
      return result?.data?.role || null;
    } catch {
      return null;
    }
  };

  if (LOGIN_REGISTER.has(pathname)) {
    if (token) {
      const userRole = await verifySessionWithBackend();
      if (userRole) {
        const target = ROLE_DASHBOARDS[userRole] || "/dashboard/student";
        return NextResponse.redirect(new URL(target, request.url));
      }
    }
    return NextResponse.next();
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  if (pathname.startsWith(DASHBOARD_BASE)) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const userRole = await verifySessionWithBackend();

    if (!userRole) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("refreshToken");
      return response;
    }

    if (pathname === DASHBOARD_BASE || pathname === `${DASHBOARD_BASE}/`) {
      const target = ROLE_DASHBOARDS[userRole] || "/dashboard/student";
      return NextResponse.redirect(new URL(target, request.url));
    }

    const requiredRole = pathname.split("/")[2];

    if (ROLE_DASHBOARDS[requiredRole] && userRole !== requiredRole) {
      return NextResponse.redirect(new URL("/unauthorizationd", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/signup"],
};
