/**
 * NextAuth কনফিগারেশন — সার্ভার-সাইড authentication
 * ────────────────────────────────────────────────────
 * login পেজ থেকে signIn("credentials") কল হলে এই ফাইলের authorize() চলে।
 * JWT strategy ব্যবহার — session cookie-তে encrypted token থাকে, DB session table নয়।
 */
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/lib/db/models/User";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/validations/schemas";
import { connectDB } from "./lib/db/connect";

// TypeScript: Session ও JWT-তে custom field (id, role) যোগ
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: "admin" | "user";
      image?: string;
    };
  }

  interface User {
    role: "admin" | "user";
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    // Email + Password দিয়ে লগইন — OAuth (Google/GitHub) নয়
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      /**
       * authorize — লগইনের মূল যাচাই
       * null return = লগইন ব্যর্থ (login পেজে "Invalid email or password")
       * object return = সফল, NextAuth JWT তৈরি করে
       */
      async authorize(credentials) {
        // সার্ভার-সাইডে আবার Zod validation (client bypass হলেও safe)
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();

        // password field schema-তে select: false — তাই "+password" দিয়ে explicitly নিতে হয়
        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password",
        );
        if (!user) return null;

        // bcrypt compare — User model-এ comparePassword method
        const isValid = await user.comparePassword(parsed.data.password);
        if (!isValid) return null;

        // NextAuth session-এ যাবে এমন user object (password কখনো return হয় না)
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
  session: {
    strategy: "jwt", // JWT-based session (database session store নয়)
    maxAge: 30 * 24 * 60 * 60, // ৩০ দিন — তারপর আবার login লাগবে
  },
  callbacks: {
    // প্রথম login-এ user object JWT token-এ id ও role save
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = (user.role as "admin" | "user") ?? "user";
      }
      return token;
    },
    // client-side useSession() যা পায় — token থেকে session.user-এ map
    async session({ session, token }) {
      session.user.id = (token.id as string) ?? "";
      session.user.role = (token.role as "admin" | "user") ?? "user";
      return session;
    },
  },
  pages: {
    signIn: "/login", // default signIn page override
    error: "/login", // auth error হলে login-এ redirect
  },
  secret: process.env.AUTH_SECRET, // JWT encrypt/sign করার secret
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
