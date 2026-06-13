/**
 * লগইন পেজ (Login Page)
 * ─────────────────────
 * এই পেজে অ্যাডমিন/ইউজার তাদের ইমেইল ও পাসওয়ার্ড দিয়ে সাইন ইন করে।
 * সফল লগইনের পর `/dashboard`-এ রিডাইরেক্ট হয়।
 *
 * পুরো ফ্লো:
 * ১. ইউজার ফর্ম পূরণ করে → ২. Zod দিয়ে ভ্যালিডেশন →
 * ৩. NextAuth credentials signIn → ৪. auth.ts-এ authorize() DB চেক করে →
 * ৫. JWT সেশন তৈরি → ৬. dashboard-এ যাওয়া
 */
"use client"; // ব্রাউজারে চলবে — useState, useRouter, form ইভেন্টের জন্য প্রয়োজন

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validations/schemas";
import toast from "react-hot-toast";

export default function LoginPage() {
  // Next.js রাউটার — লগইন সফল হলে dashboard-এ পাঠানোর জন্য
  const router = useRouter();

  // URL-এর query string পড়া (যেমন: /login?registered=1)
  const searchParams = useSearchParams();

  // ফর্ম সাবমিট চলাকালীন বাটন disable ও loading spinner দেখানোর state
  const [loading, setLoading] = useState(false);

  /**
   * রেজিস্ট্রেশন সফল হলে register পেজ `/login?registered=1`-এ পাঠায়।
   * এই effect সেই query param দেখে success toast দেখায়,
   * তারপর URL থেকে `?registered=1` সরিয়ে শুধু `/login` রাখে (history পরিষ্কার)।
   */
  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      toast.success("Registration successful! Please sign in.");
      router.replace("/login");
    }
  }, [searchParams, router]);

  /**
   * react-hook-form সেটআপ
   * - register: ইনপুট ফিল্ডগুলো form state-এ বাঁধার জন্য
   * - handleSubmit: submit এ ভ্যালিডেশন চালিয়ে onSubmit কল করে
   * - errors: Zod schema অনুযায়ী ভুল থাকলে এখানে message আসে
   * - zodResolver: loginSchema দিয়ে client-side validation
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  /**
   * ফর্ম সাবমিট হলে চলে — মূল লগইন লজিক এখানে
   */
  const onSubmit = async (data: LoginInput) => {
    setLoading(true);

    try {
      /**
       * NextAuth-এর credentials provider দিয়ে লগইন
       * - redirect: false → পেজ reload/redirect NextAuth করবে না, আমরা নিজে handle করব
       * - email trim → অপ্রয়োজনীয় space সরানো
       *
       * পেছনে auth.ts-এর authorize() চলে:
       *   DB থেকে user খোঁজে → bcrypt দিয়ে password match → JWT session তৈরি
       */
      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password,
        redirect: false,
      });

      // authorize() null return করলে বা credentials ভুল হলে error আসে
      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      // সফল — toast দেখিয়ে dashboard-এ যাওয়া
      toast.success("Login successful!");
      router.push("/dashboard");
      // server component-গুলো নতুন session দিয়ে refresh হয় (middleware/auth state আপডেট)
      router.refresh();
    } catch (error) {
      // নেটওয়ার্ক বা অপ্রত্যাশিত error
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      // success/error যাই হোক loading state বন্ধ
      setLoading(false);
    }
  };

  return (
    <>
      {/* ছোট uppercase লেবেল — পেজের উদ্দেশ্য (ADMIN ACCESS) */}
      <p className="font-mono text-[10px] text-[var(--accent-gold)] font-bold tracking-[0.4em] uppercase mb-3">
        ADMIN ACCESS
      </p>

      {/* মূল হেডিং */}
      <h1 className="text-[2rem] font-black tracking-[-1px] mb-8 text-[var(--text-main)]">
        Welcome <span className="indigo">Back.</span>
      </h1>

      {/*
        লগইন ফর্ম
        - noValidate: ব্রাউজারের default HTML validation বন্ধ — Zod/react-hook-form handle করবে
        - handleSubmit(onSubmit): submit এ প্রথমে validation, তারপর onSubmit
      */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        {/* ─── ইমেইল ফিল্ড ─── */}
        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            {...register("email")} // react-hook-form-এ "email" ফিল্ড bind
            id="email"
            type="email"
            placeholder="example@domain.com"
            className={`form-input ${errors.email ? "border-red-400" : ""}`}
            autoComplete="email"
            aria-label="Enter your email address"
            aria-invalid={errors.email ? "true" : "false"}
          />
          {/* Zod validation error message */}
          {errors.email && (
            <p className="text-[0.78rem] text-red-400 font-medium" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* ─── পাসওয়ার্ড ফিল্ড ─── */}
        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            placeholder="••••••••"
            className={`form-input ${errors.password ? "border-red-400" : ""}`}
            autoComplete="current-password"
            aria-label="Enter your password"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="text-[0.78rem] text-red-400 font-medium" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* সাবমিট বাটন — loading অবস্থায় disabled + spinner */}
        <button
          type="submit"
          className="btn-grad-border w-full mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={loading}
          aria-live="polite"
        >
          {loading ? (
            <>
              <span
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                aria-hidden="true"
              />
              Authenticating...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* নিচের লিংক — register পেজ ও portfolio home */}
      <div className="text-center mt-7 space-y-3">
        <p className="text-[0.85rem] text-[var(--text-dim)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[var(--accent-indigo)] no-underline font-bold hover:underline"
          >
            Register
          </Link>
        </p>
        <p>
          <Link
            href="/"
            className="text-[0.8rem] text-[var(--text-dim)] no-underline contact-link inline-flex items-center gap-1"
          >
            ← Back to Portfolio
          </Link>
        </p>
      </div>
    </>
  );
}
