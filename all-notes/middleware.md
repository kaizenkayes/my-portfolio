// ==========================================
// FILE: middleware.ts
// ==========================================
// মিডলওয়্যার ফাইল - প্রতিটি রিকোয়েস্টের আগে রান করে
// রুট প্রটেকশন, রিডাইরেক্ট, এবং অথোরাইজেশন হ্যান্ডল করে

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

// ==========================================
// 1. অথ ইন্সট্যান্স তৈরি করা
// ==========================================
// authConfig ব্যবহার করে NextAuth ইন্সট্যান্স তৈরি করছি
// এই auth() ফাংশন middleware হিসেবে কাজ করবে
const { auth } = NextAuth(authConfig);

// ==========================================
// 2. কনস্ট্যান্ট ডিফাইন (রুট প্যাটার্ন)
// ==========================================

// ড্যাশবোর্ড রুটের প্রিফিক্স
const DASHBOARD_PREFIX = "/dashboard";

// অথেন্টিকেশন রুট (লগইন/রেজিস্টার)
// এই রুটগুলোতে লগইন করা ইউজার প্রবেশ করতে পারবে না
const AUTH_ROUTES = ["/login", "/register"];

// এডমিন রাইট অপারেশনের প্যাটার্ন
// শুধু এডমিন রোল এই অপারেশনগুলো করতে পারবে
const ADMIN_WRITE_PATTERNS = ["/new", "/edit", "/delete"];

// ==========================================
// 3. মেইন মিডলওয়্যার ফাংশন
// ==========================================
// এই ফাংশন প্রতিটি রিকোয়েস্টের আগে রান করবে
export default auth((req) => {
  // বর্তমান URL এর পাথনেম বের করছি
  const { pathname } = req.nextUrl;
  
  // বর্তমান সেশন চেক করছি (ইউজার লগইন করছে কিনা)
  const session = req.auth;

  // ==========================================
  // 4. রুট চেকিং (কোন টাইপের রুটে আছে?)
  // ==========================================
  
  // চেক করছি: এটি কি অথ রুট? (লগিন/রেজিস্টার)
  const isAuthRoute = AUTH_ROUTES.some((r) => pathname.startsWith(r));
  
  // চেক করছি: এটি কি ড্যাশবোর্ড রুট?
  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX);
  
  // চেক করছি: এডমিন রাইট অপারেশন দরকার কিনা (নিউ/এডিট/ডিলিট)
  const isAdminWrite = ADMIN_WRITE_PATTERNS.some((p) => pathname.includes(p));

  // ==========================================
  // 5. রুল ১: অথ রুটে লগইন করা ইউজার
  // ==========================================
  // যদি ইউজার লগইন করে থাকে এবং অথ রুটে যেতে চায়
  // তাহলে ড্যাশবোর্ডে রিডাইরেক্ট করো
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
  }

  // ==========================================
  // 6. রুল ২: ড্যাশবোর্ডে লগইন ছাড়া
  // ==========================================
  // যদি ড্যাশবোর্ডে যেতে চায় কিন্তু লগইন না করে থাকে
  // তাহলে লগইন পেজে রিডাইরেক্ট করো
  if (isDashboard && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ==========================================
  // 7. রুল ৩: এডমিন রাইট অপারেশন চেক
  // ==========================================
  // যদি ড্যাশবোর্ডে থাকে এবং এডমিন রাইট অপারেশন চায়
  // কিন্তু ইউজারের রোল "admin" না হয়
  // তাহলে ড্যাশবোর্ডের হোমপেজে রিডাইরেক্ট করো
  if (isDashboard && session && isAdminWrite) {
    if (session.user?.role !== "admin") {
      return NextResponse.redirect(new URL(DASHBOARD_PREFIX, req.url));
    }
  }

  // ==========================================
  // 8. ডিফল্ট: সব কিছু ঠিক থাকলে
  // ==========================================
  // কোন রিডাইরেক্ট না করে স্বাভাবিকভাবে রিকোয়েস্ট প্রসেস করো
  return NextResponse.next();
});

// ==========================================
// 9. ম্যাটচার কনফিগারেশন
// ==========================================
// কোন কোন রুটে এই মিডলওয়্যার রান করবে তা নির্ধারণ করে
export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    // এই রেগুলার এক্সপ্রেশন মানে:
    // - api রুট বাদ দাও (API routes)
    // - _next/static বাদ দাও (Next.js static assets)
    // - _next/image বাদ দাও (Next.js image optimization)
    // - favicon.ico বাদ দাও
    // - ফাইল এক্সটেনশন (.jpg, .png, .css, ইত্যাদি) বাদ দাও
    // - বাকি সব রুটে মিডলওয়্যার রান করবে
  ],
};

// ==========================================
// COMPLETE SUMMARY (বাংলায় সম্পূর্ণ ব্যাখ্যা):
// ==========================================

/*
🔹 **এই middleware.ts ফাইলটি কী করে?**
এটি Next.js অ্যাপ্লিকেশনের গার্ড হিসেবে কাজ করে। প্রতিটি রিকোয়েস্টের আগে চেক করে:
- কে কোথায় প্রবেশ করতে পারে
- কখন কোথায় রিডাইরেক্ট করতে হবে
- কোন রুটে কোন রোল প্রয়োজন

🔹 **কেন মিডলওয়্যার দরকার?**
UI তে লিংক লুকালেও, সরাসরি URL টাইপ করে কেউ ড্যাশবোর্ডে ঢুকতে পারে। 
মিডলওয়্যার এটি প্রতিরোধ করে।

🔹 **থ্রি লেয়ার প্রটেকশন সিস্টেম:**

**লেয়ার ১: অথ রুট প্রটেকশন**
```typescript
// /login বা /register এ গেলে
if (isAuthRoute && session) {
  // লগইন করা ইউজার লগইন পেজ দেখতে পাবে না
  return redirect to /dashboard
}


লেয়ার ২: ড্যাশবোর্ড প্রটেকশন

typescript
// /dashboard/* এ গেলে
if (isDashboard && !session) {
  // শুধু লগইন করা ইউজার প্রবেশ করতে পারবে
  return redirect to /login
}
লেয়ার ৩: এডমিন অপারেশন প্রটেকশন

typescript
// /dashboard/new, /dashboard/post/edit, /dashboard/delete
if (isDashboard && session && isAdminWrite) {
  if (session.user?.role !== "admin") {
    // নরমাল ইউজার এই অপারেশন করতে পারবে না
    return redirect to /dashboard
  }
}
🔹 পৃথক রুটের উদাহরণ এবং আচরণ:

URL	লগইন স্ট্যাটাস	রোল	ফলাফল
/login	না	-	লগইন পেজ দেখাবে
/login	হ্যাঁ	user	/dashboard এ রিডাইরেক্ট
/dashboard	না	-	/login এ রিডাইরেক্ট
/dashboard	হ্যাঁ	user	ড্যাশবোর্ড দেখাবে
/dashboard/new	হ্যাঁ	user	/dashboard এ রিডাইরেক্ট
/dashboard/new	হ্যাঁ	admin	নিউ পেজ দেখাবে
/dashboard/post/edit/1	হ্যাঁ	user	/dashboard এ রিডাইরেক্ট
/dashboard/post/edit/1	হ্যাঁ	admin	এডিট পেজ দেখাবে
🔹 ম্যাটচার রেগুলার এক্সপ্রেশন ডিটেইল:

typescript
matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]

// এক্সপ্ল্যানেশন:
// ^ (?! ... )   - এই প্যাটার্নগুলোর সাথে ম্যাচ করবে না
// api           - API রাউট বাদ
// _next/static  - স্ট্যাটিক ফাইল বাদ
// _next/image   - ইমেজ অপটিমাইজেশন বাদ
// favicon.ico   - ফেভিকন বাদ
// .*\..*        - যেকোনো ফাইল এক্সটেনশন বাদ (.jpg, .png, .css, .js)

// যেসব রুটে রান করবে:
✅ /dashboard
✅ /dashboard/profile
✅ /blog/post-1
✅ /admin/settings

// যেসব রুটে রান করবে না:
❌ /api/users
❌ /_next/static/chunk.js
❌ /_next/image?url=/image.jpg
❌ /favicon.ico
❌ /logo.png
🔹 NextResponse এর ব্যবহার:

typescript
// 1. রিডাইরেক্ট
return NextResponse.redirect(new URL("/login", req.url));

// 2. চলতে দেওয়া
return NextResponse.next();

// 3. রাইট পাথের জন্য (জটিল ক্ষেত্রে)
return NextResponse.rewrite(new URL("/new-path", req.url));
🔹 কনফ্লিক্ট এভয়েড করার টিপস:

typescript
// এই লেভেলিং চেক করুন:
// 1. প্রথমে অথ রুট চেক (সবচেয়ে স্পেসিফিক)
// 2. তারপর ড্যাশবোর্ড চেক (জেনেরিক)
// 3. তারপর এডমিন চেক (মোস্ট স্পেসিফিক)

// ভুল অর্ডার:
if (isDashboard && !session) {}  // 👈 এটা আগে থাকলে
if (isDashboard && isAdminWrite) {} // 👈 এটা পরে কাজ করবে না

// সঠিক অর্ডার:
if (isAdminWrite && session) {}     // 👈 সবচেয়ে স্পেসিফিক আগে
if (isDashboard && !session) {}     // 👈 তারপর জেনেরিক
if (isAuthRoute && session) {}      // 👈 সবার শেষে
🔹 প্র্যাকটিক্যাল ব্যবহারের উদাহরণ:

১. ডায়নামিক রাউট প্রটেকশন:

typescript
// /dashboard/[userId]/edit
const match = pathname.match(/\/dashboard\/([^\/]+)\/edit/);
if (match && session) {
  const userId = match[1];
  if (session.user.id !== userId && session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
}
২. অ্যাডমিন এরিয়ার সাব-রাউট:

typescript
const ADMIN_ROUTES = ["/admin/users", "/admin/settings"];
const isAdminRoute = ADMIN_ROUTES.some(r => pathname.startsWith(r));

if (isAdminRoute && session?.user.role !== "admin") {
  return NextResponse.redirect(new URL("/dashboard", req.url));
}
৩. API রাউট প্রটেকশন (যদি ম্যাচারে api বাদ না দাও):

typescript
// যদি ম্যাচারে api বাদ না দিয়ে থাকো
if (pathname.startsWith('/api/admin') && session?.user.role !== "admin") {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
🔹 পারফরম্যান্স অপটিমাইজেশন:

typescript
// 1. যেসব রুটে মিডলওয়্যার লাগবে না, ম্যাচারে বাদ দাও
export const config = {
  matcher: [
    "/dashboard/:path*",  // শুধু ড্যাশবোর্ড
    "/admin/:path*"       // এবং এডমিন এরিয়াতে রান করবে
  ]
};

// 2. লাইটওয়েট অপারেশন রাখো (কোনো ডাটাবেস কল করো না)
// 3. session চেকই যথেষ্ট (JWT টোকেন থেকে আসে)
🔹 কমন সিকিউরিটি ইস্যু এবং সলিউশন:

সমস্যা	কেন হয়	সলিউশন
ইউজার /login দেখে লগইন থাকা অবস্থায়	চেক করে নাই	isAuthRoute && session চেক দাও
নরমাল ইউজার /admin/edit দেখে	এডমিন চেক নাই	session.user?.role চেক করো
সরাসরি API কল করে ডাটা পরিবর্তন	API middleware বাদ দিয়েছো	API রাউটে নিজের চেক যোগ করো
রিডাইরেক্ট লুপ	ভুল চেক অর্ডার	স্পেসিফিক থেকে জেনেরিক চেক করো
🔹 লগিং এবং ডিবাগিং:

typescript
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;
  
  // ডেভেলপমেন্টে লগ দেখাও
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${pathname} - Session:`, !!session);
  }
  
  // রেস্ট লজিক...
});
🔹 এডভান্সড প্যাটার্ন: ডায়নামিক এডমিন চেক:

typescript
// বিভিন্ন অপারেশনের জন্য ভিন্ন ভিন্ন এডমিন লেভেল
const ADMIN_LEVELS = {
  "/new": "write",
  "/edit": "write", 
  "/delete": "admin",
  "/settings": "admin",
  "/analytics": "view"
};

const requiredLevel = ADMIN_LEVELS[pathname];
if (requiredLevel) {
  const userRole = session.user?.role;
  if (userRole !== "admin") {
    const hasAccess = requiredLevel === "write" && userRole === "editor";
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }
}
*/

// ==========================================
// MIDDLEWARE BEST PRACTICES সমারি:
// ==========================================
/*
✅ DO:
- রিডাইরেক্ট লজিক পরিষ্কার রাখো
- ম্যাটচার কনফিগারেশন ব্যবহার করো
- শুধু অথোরাইজেশন চেক করো (ডাটাবেস কল করো না)
- স্পেসিফিক রুল আগে লিখো

❌ DON'T:
- মিডলওয়্যারে ডাটাবেস কল করো না
- ভারী কম্পিউটেশন করো না
- ফরেন API কল করো না
- সব রুটে মিডলওয়্যার রান করো না
*/ 
