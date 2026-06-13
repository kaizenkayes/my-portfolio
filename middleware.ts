/**
 * Middleware — প্রতিটি page request-এ চলে, route protect করে
 * ───────────────────────────────────────────────────────────
 * ১. ইতিমধ্যে login থাকলে /login বা /register-এ গেলে → dashboard
 * ২. login না থাকলে /dashboard-এ গেলে → /login
 * ৩. admin ছাড়া কেউ /new, /edit, /delete URL-এ গেলে → dashboard (block)
 */
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const DASHBOARD_PREFIX = "/dashboard";
const AUTH_ROUTES = ["/login", "/register"];
const ADMIN_WRITE_PATTERNS = ["/new", "/edit", "/delete"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth; // JWT থেকে decode করা session (logged in user)

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);
  const isAdminWrite = ADMIN_WRITE_PATTERNS.some((p) => pathname.includes(p));

  // লগইন করা user auth পেজে যেতে চাইলে dashboard-এ পাঠাও
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
  }

  // অলগইন user dashboard access করতে চাইলে login-এ পাঠাও
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // শুধু admin create/edit/delete করতে পারবে — user role হলে block
  if (isDashboard && session && isAdminWrite) {
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
    }
  }

  return NextResponse.next(); // কোনো rule match না হলে request চালিয়ে যাও
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
