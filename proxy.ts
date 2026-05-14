import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

//==================================================================================
//                                SECURITY PROXY (WATCHDOG)
//==================================================================================
// Description: Global route protection and role-based access control (RBAC).
// Features: jose JWT validation, watchdog logging, and dynamic role mapping.
//==================================================================================

const PUBLIC_ROUTES = ["/", "/courses", "/about", "/contact", "/unauthorized"];
const AUTH_ROUTES = ["/login", "/register"];

// Map routes to required roles for Mentoro
const ROLE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard/admin": ["admin"],
  "/dashboard/instructor": ["instructor"],
  "/dashboard/student": ["student"],
  "/dashboard": ["student", "instructor", "admin"],
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // 🛡️ SECURITY WATCHDOG: RADAR SCAN
  console.log(`\x1b[36m[WATCHDOG]\x1b[0m 📡 Scanning route: ${pathname}`);

  // 1. Allow static assets, internal requests and public routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. Handle Authentication Routes (Login/Register)
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (refreshToken) {
      try {
        const secret = new TextEncoder().encode(
          process.env.REFRESH_TOKEN_SECRET || "fallback-secret",
        );
        await jwtVerify(refreshToken, secret);
        console.log(`\x1b[33m[WATCHDOG]\x1b[0m 🔄 Session active. Diverting from ${pathname} to dashboard.`);
        
        return NextResponse.redirect(new URL("/dashboard", request.url));
      } catch (e) {
        console.log(`\x1b[31m[WATCHDOG] ⚠️ Session stale on ${pathname}. Clearance provided for re-authentication.\x1b[0m`);
        return NextResponse.next();
      }
    }
    return NextResponse.next();
  }

  // 3. Handle Protected Dashboard/Role Routes
  const isProtectedRoute = Object.keys(ROLE_PERMISSIONS).some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    if (!refreshToken) {
      console.error(`\x1b[41m\x1b[37m[WATCHDOG] ❌ CRITICAL: Unauthorized access attempt at ${pathname}. No token found.\x1b[0m`);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.REFRESH_TOKEN_SECRET || "fallback-secret",
      );
      const { payload } = await jwtVerify(refreshToken, secret);
      const userRole = (payload.role as string) || "GUEST";

      console.log(`\x1b[32m[WATCHDOG]\x1b[0m 🛂 Identity Confirmed: [${userRole}] | Destination: ${pathname}`);

      // Specific redirection for base /dashboard route
      if (pathname === "/dashboard") {
        const roleMap: Record<string, string> = {
          admin: "/dashboard/admin",
          instructor: "/dashboard/instructor",
          student: "/dashboard/student",
        };
        const target = roleMap[userRole] || "/dashboard/student";
        console.log(`\x1b[33m[WATCHDOG]\x1b[0m 🔄 Routing generic dashboard to ${target} for ${userRole}.`);
        return NextResponse.redirect(new URL(target, request.url));
      }

      // Check for RBAC Permissions
      for (const [route, allowedRoles] of Object.entries(ROLE_PERMISSIONS)) {
        if (pathname.startsWith(route)) {
          if (!allowedRoles.includes(userRole)) {
            console.error(`\x1b[41m\x1b[37m[WATCHDOG] 🚫 RBAC DENIAL: Role [${userRole}] is NOT authorized for [${route}].\x1b[0m`);
            return NextResponse.redirect(new URL("/unauthorized", request.url));
          }
        }
      }

      console.log(`\x1b[32m[WATCHDOG]\x1b[0m ✅ ACCESS GRANTED to ${userRole}. Proceeding...`);
      return NextResponse.next();
    } catch (error) {
       console.error(`\x1b[41m\x1b[37m[WATCHDOG] 💥 SECURITY BREACH: Token invalid or expired at ${pathname}.\x1b[0m`);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
