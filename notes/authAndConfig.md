// ==========================================
// FILE 1: auth.config.ts
// ==========================================
// কনফিগারেশন ফাইল - শুধু কনফিগ ফাইল, প্রোভাইডার ছাড়া

import type { NextAuthConfig } from "next-auth";

// ==========================================
// অথেন্টিকেশন কনফিগারেশন (বেসিক সেটআপ)
// ==========================================
export const authConfig: NextAuthConfig = {
  // প্রোভাইডার খালি থাকবে (অন্য ফাইলে যোগ হবে)
  providers: [],
  
  // ==========================================
  // কাস্টম পেজ রাউটিং
  // ==========================================
  pages: {
    signIn: "/login",    // ইউজার লগইন না থাকলে এখানে রিডাইরেক্ট হবে
    error: "/login",     // কোন error হলে এখানে রিডাইরেক্ট হবে
  },
  
  // ==========================================
  // কলব্যাক ফাংশন
  // ==========================================
  callbacks: {
    // authorized কলব্যাক: নির্ধারণ করে ইউজার কোন রুটে access পাবে
    authorized({ auth, request: { nextUrl } }) {
      // auth অবজেক্টে ইউজারের তথ্য থাকবে (লগইন করলে)
      const isLoggedIn = !!auth?.user;
      
      // ড্যাশবোর্ড রুট চেক করছে
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      
      // যদি ড্যাশবোর্ড পেইজ হয়:
      if (isOnDashboard) {
        // লগইন থাকলে true (access দেবে)
        if (isLoggedIn) return true;
        // লগইন না থাকলে false (লগিন পেইজে রিডাইরেক্ট করবে)
        else return false;
      }
      
      // অন্যান্য সব রুটে সবসময় access দেবে
      return true;
    },
  },
} satisfies NextAuthConfig;

// ==========================================
// auth.config.ts SUMMARY:
// ==========================================
/*
🔹 এই ফাইলটি শুধুমাত্র কনফিগারেশন ধারণ করে
🔹 providers খালি রাখা হয়েছে কারণ provider গুলো auth.ts এ যোগ করা হবে
🔹 authorized কলব্যাক middleware হিসেবে কাজ করে - রুট প্রটেক্ট করে
🔹 satisfies কিওয়ার্ড টাইপ সেফটি নিশ্চিত করে
*/


// ==========================================
// FILE 2: auth.ts
// ==========================================
// মেইন অথেন্টিকেশন ফাইল - প্রোভাইডার এবং সমস্ত ফিচার সহ

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { loginSchema } from "@/lib/validations/schemas";
import type { NextAuthConfig } from "next-auth";
import { authConfig } from "./auth.config";

// ==========================================
// 1. TYPESCRIPT টাইপ এক্সটেনশন (Session এর জন্য)
// ==========================================
// next-auth মডিউলে Session টাইপ এক্সটেন্ড করছি
declare module "next-auth" {
  interface Session {
    user: {
      id: string;           // ইউজারের আইডি (মঙ্গুডিবি থেকে)
      name: string;         // ইউজারের নাম
      email: string;        // ইউজারের ইমেইল
      role: "admin" | "user";  // ইউজারের রোল (অ্যাডমিন/ইউজার)
      image?: string;       // প্রোফাইল ইমেজ (অপশনাল)
    };
  }

  interface User {
    role: "admin" | "user";  // ইউজার অবজেক্টে রোল ফিল্ড যোগ করছি
  }
}

// ==========================================
// 2. JWT টাইপ এক্সটেনশন
// ==========================================
// @auth/core/jwt মডিউলে JWT টাইপ এক্সটেন্ড করছি
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;             // JWT টোকেনে আইডি স্টোর হবে
    role: "admin" | "user"; // JWT টোকেনে রোল স্টোর হবে
  }
}

// ==========================================
// 3. অথেন্টিকেশন কনফিগারেশন (auth.config এর সাথে মার্জ)
// ==========================================
const authConfigExtended: NextAuthConfig = {
  // আগের কনফিগারেশন থেকে সব নিচ্ছি
  ...authConfig,
  
  // ==========================================
  // 4. প্রোভাইডার (লগইন মাধ্যম)
  // ==========================================
  providers: [
    Credentials({
      name: "credentials",  // প্রোভাইডারের নাম
      
      // লগইন ফর্মের ফিল্ড ডিফাইন করছি
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      
      // ==========================================
      // 5. AUTHORIZE ফাংশন (মূল লজিক)
      // ==========================================
      async authorize(credentials) {
        // STEP 1: Zod দিয়ে ইনপুট ভ্যালিডেশন
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;  // ভুল ইনপুট → null
        
        // STEP 2: ডাটাবেস কানেক্ট করো
        await connectDB();
        
        // STEP 3: ইউজার খোঁজো (পাসওয়ার্ড সহ)
        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password",  // পাসওয়ার্ড ফিল্ড আনতে বলছি (ডিফল্ট লুকানো)
        );
        if (!user) return null;  // ইউজার নেই → null
        
        // STEP 4: পাসওয়ার্ড ম্যাচ করো
        const isValid = await user.comparePassword(parsed.data.password);
        if (!isValid) return null;  // পাসওয়ার্ড ভুল → null
        
        // STEP 5: সফল হলে ইউজার অবজেক্ট রিটার্ন করো
        return {
          id: (user._id as { toString(): string }).toString(),
          name: user.name as string,
          email: user.email as string,
          role: user.role as "admin" | "user",
          image: (user.image as string | undefined) ?? undefined,
        };
      },
    }),
  ],
  
  // ==========================================
  // 6. সেশন কনফিগারেশন
  // ==========================================
  session: {
    strategy: "jwt",                    // JWT স্ট্র্যাটেজি ব্যবহার করবি
    maxAge: 30 * 24 * 60 * 60,        // ৩০ দিন পর সেশন expire হবে
  },
  
  // ==========================================
  // 7. কলব্যাক ফাংশন (JWT আর সেশন ম্যানেজ)
  // ==========================================
  callbacks: {
    // JWT কলব্যাক: টোকেন তৈরির সময়
    async jwt({ token, user }) {
      // যদি ইউজার থাকে (প্রথমবার লগইন করছে)
      if (user) {
        token.id = user.id ?? "";              // টোকেনে আইডি সেট করো
        token.role = (user.role as "admin" | "user") ?? "user";  // টোকেনে রোল সেট করো
      }
      return token;  // আপডেট করা টোকেন রিটার্ন করো
    },
    
    // সেশন কলব্যাক: ক্লায়েন্টে সেশন পাঠানোর সময়
    async session({ session, token }) {
      // টোকেন থেকে ডাটা নিয়ে সেশনে সেট করো
      session.user.id = (token.id as string) ?? "";
      session.user.role = (token.role as "admin" | "user") ?? "user";
      return session;  // আপডেট করা সেশন রিটার্ন করো
    },
    
    // authorized কলব্যাক (auth.config থেকে ইতিমধ্যে নিয়েছে)
  },
  
  // ==========================================
  // 8. পেজ কনফিগারেশন (auth.config থেকে নিয়েছে)
  // ==========================================
  pages: {
    signIn: "/login",   // লগইন পেজের রাউট
    error: "/login",    // এরর পেজের রাউট
  },
  
  // ==========================================
  // 9. সিক্রেট কী (এনভায়রনমেন্ট থেকে)
  // ==========================================
  secret: process.env.AUTH_SECRET,  // JWT সাইন করার জন্য সিক্রেট
};

// ==========================================
// 10. এক্সপোর্ট (হ্যান্ডলার, অথ, সাইনইন, সাইনআউট)
// ==========================================
export const { handlers, auth, signIn, signOut } = NextAuth(authConfigExtended);

// ==========================================
// COMPLETE SUMMARY (বাংলায়):
// ==========================================
/*
🔹 **এই দুটি ফাইল কেন আলাদা?**

**auth.config.ts:**
- শুধু কনফিগারেশন (প্রোভাইডার ছাড়া)
- middleware এবং routing কনফিগারেশন
- authorized কলব্যাক (route protection)
- পেজ রাউটিং

**auth.ts:**
- পুরো অথেন্টিকেশন সিস্টেম
- প্রোভাইডার (Credentials)
- ডাটাবেস লজিক
- JWT এবং সেশন হ্যান্ডলিং
- টাইপ এক্সটেনশন

🔹 **কেন আলাদা করা ভালো?**
1. **Middleware ফাইল** auth.config ব্যবহার করতে পারে প্রোভাইডার ছাড়া
2. **ক্লিনার কোড** - সেপারেশন অফ কনসার্নস
3. **রিইউজেবল** - config টা অন্য জায়গায় ব্যবহার করা যায়

🔹 **অথেন্টিকেশন ফ্লো:**


ইউজার লগইন ফর্ম জমা দেয়
↓
২. Credentials প্রোভাইডারের authorize() কল হয়
↓
৩. Zod দিয়ে ইনপুট ভ্যালিডেশন (loginSchema)
↓
৪. ডাটাবেস কানেক্ট হয়
↓
৫. ইউজার খোঁজে (email দিয়ে)
↓
৬. পাসওয়ার্ড compare করে (bcrypt)
↓
৭. সফল হলে ইউজার অবজেক্ট রিটার্ন করে
↓
৮. NextAuth JWT টোকেন তৈরি করে
↓
৯. jwt() callback টোকেন কাস্টমাইজ করে (id, role যোগ করে)
↓
১০. session() callback সেশন কাস্টমাইজ করে
↓
১১. ক্লায়েন্ট সেশন পায় (লগইন কমপ্লিট)

text

🔹 **প্রত্যেক কলব্যাকের কাজ:**

**jwt({ token, user })**
- প্রথমবার: user থাকে → টোকেনে id, role সেট করে
- পরবর্তী বার: user undefined → টোকেন unchanged থাকে

**session({ session, token })**
- প্রতি request এ চলে
- টোকেন থেকে ডাটা নিয়ে session এ সেট করে
- ক্লায়েন্ট session.user.id এবং role পায়

**authorized({ auth, request })**
- Middleware লেভেলে কাজ করে
- ড্যাশবোর্ড রুট প্রটেক্ট করে
- লগইন না থাকলে /login এ রিডাইরেক্ট করে

🔹 **টাইপ এক্সটেনশন কেন দরকার?**

ডিফল্ট NextAuth এ এই প্রপার্টি গুলো নেই:
```typescript
// ডিফল্ট Session টাইপ:
{
  user: {
    name, email, image  // id নেই, role নেই
  }
}

// এক্সটেন্ড করার পর:
{
  user: {
    id, name, email, role, image  // সব আছে
  }
}
🔹 Credentials প্রোভাইডার ডিটেইল:

typescript
Credentials({
  name: "credentials",
  credentials: {  // UI তৈরি করার জন্য optional
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    // আপনার কাস্টম লজিক
    // ডাটাবেসে চেক করো
    // সঠিক হলে ইউজার রিটার্ন করো
    // ভুল হলে null রিটার্ন করো
  }
})
🔹 জেএনটি বনাম ডাটাবেস স্ট্র্যাটেজি:

typescript
// JWT Strategy (আমরা এটা ব্যবহার করছি)
session: { strategy: "jwt" }
// ✅ দ্রুত, ✅ স্কেলেবল, ✅ ডাটাবেস কল কম
// ❌ বেশি ডাটা রাখা যায় না

// Database Strategy (যদি লাগে)
session: { strategy: "database" }
// ✅ বেশি ডাটা রাখা যায়
// ❌ ধীর, ❌ ডাটাবেস কল বেশি
🔹 ব্যবহারিক উদাহরণ:

১. লগইন ইমপ্লিমেন্টেশন:

typescript
// app/login/page.tsx
import { signIn } from "@/auth";

async function handleLogin(formData: FormData) {
  "use server";
  await signIn("credentials", {
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: "/dashboard"
  });
}
২. সেশন ইউজ করা:

typescript
// app/dashboard/page.tsx
import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();
  
  if (session?.user.role === "admin") {
    return <AdminPanel />;
  }
  return <UserDashboard />;
}
৩. লগআউট:

typescript
import { signOut } from "@/auth";

async function handleLogout() {
  "use server";
  await signOut({ redirectTo: "/" });
}
৪. ক্লায়েন্ট সাইড সেশন ইউজ:

typescript
"use client";
import { useSession } from "next-auth/react";

function Profile() {
  const { data: session } = useSession();
  return <div>Welcome {session?.user.name}</div>;
}
🔹 এডমিন রোল চেকিং (সার্ভার সাইড):

typescript
// app/api/admin/route.ts
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  
  if (session?.user.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // এডমিন লজিক
}
🔹 Middleware দিয়ে রুট প্রটেক্ট করা:

typescript
// middleware.ts
import { authConfig } from "@/lib/auth/auth.config";
import NextAuth from "next-auth";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"]
};
🔹 সিকিউরিটি বেস্ট প্র্যাকটিস:

✅ AUTH_SECRET এনভায়রনমেন্ট ভেরিয়েবলে রাখো (কখনো commit করো না)

✅ পাসওয়ার্ড সবসময় হ্যাশ করে রেখো

✅ JWT টোকেনে সংবেদনশীল তথ্য রাখো না

✅ authorize এ সবসময় await connectDB() করো

✅ session maxAge ৩০ দিনের বেশি করো না

🔹 কমন এরর এবং সলিউশন:

এরর	কারণ	সলিউশন
"No secret provided"	AUTH_SECRET নেই	.env.local এ সেট করো
User null রিটার্ন করে	ভুল ইমেইল/পাসওয়ার্ড	loginSchema এবং comparePassword চেক করো
session.user.id undefined	টাইপ এক্সটেন্ড করোনি	declare module করে দাও
redirect loop	authorized কলব্যাক ভুল	middleware ম্যাচার চেক করো
*/		
text
