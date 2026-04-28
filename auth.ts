import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import User from "@/lib/db/models/User";
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./lib/validations/schemas";
import { connectDB } from "./lib/db/connect";

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

// NextAuth v5 uses @auth/core internally — augment JWT there
declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "user";
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();

        const user = await User.findOne({ email: parsed.data.email }).select(
          "+password",
        );
        if (!user) return null;

        const isValid = await user.comparePassword(parsed.data.password);
        if (!isValid) return null;

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
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = (user.role as "admin" | "user") ?? "user";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = (token.id as string) ?? "";
      session.user.role = (token.role as "admin" | "user") ?? "user";
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
