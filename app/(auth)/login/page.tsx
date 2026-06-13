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
  const [serverError, setServerError] = useState("");
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
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Invalid email or password");
      setServerError("Invalid email or password");
      return;
    }

    toast.success("Login successful!");
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <>
      <p
        style={{
          fontFamily: "monospace",
          fontSize: "10px",
          color: "var(--accent-gold)",
          fontWeight: 700,
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        PORTAL ACCESS
      </p>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 900,
          letterSpacing: "-1px",
          marginBottom: "32px",
          color: "var(--text-main)",
        }}
      >
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
        <div>
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
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

        <div>
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

        {serverError && (
          <div
            style={{
              padding: "12px 16px",
              background: "rgba(248, 113, 113, 0.1)",
              border: "1px solid rgba(248, 113, 113, 0.2)",
              borderRadius: "2px",
              fontSize: "0.85rem",
              color: "#f87171",
            }}
          >
            {serverError}
          </div>
        )}

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

      <p
        style={{
          textAlign: "center",
          marginTop: "28px",
          fontSize: "0.85rem",
          color: "var(--text-dim)",
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          style={{
            color: "var(--accent-indigo)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Register
        </Link>
      </p>
      <p style={{ textAlign: "center", marginTop: "12px" }}>
        <Link
          href="/"
          style={{
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            textDecoration: "none",
          }}
          className="contact-link"
        >
          ← Back to Portfolio
        </Link>
      </p>
    </>
  );
}
