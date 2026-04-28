import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ROUTES = ["/login", "/register"];
const ADMIN_WRITE_PATTERNS = ["/new", "/edit", "/delete"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);
  const isAdminWrite = ADMIN_WRITE_PATTERNS.some((p) => pathname.includes(p));

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
  }

  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isDashboard && session && isAdminWrite) {
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
