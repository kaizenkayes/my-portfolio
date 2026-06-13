/**
 * রেজিস্টার পেজ (Register Page)
 * ───────────────────────────────
 * নতুন ইউজার account তৈরি করে — name, email, password দিয়ে।
 * সফল হলে `/login?registered=1`-এ পাঠায়; login পেজ success toast দেখায়।
 *
 * Login থেকে পার্থক্য:
 * - Login → NextAuth signIn() (credentials verify)
 * - Register → Server Action registerUser() (DB-তে নতুন user create)
 *
 * পুরো ফ্লো:
 * ১. ফর্ম fill → ২. Zod validation → ৩. registerUser server action →
 * ৪. email duplicate check → ৫. User.create (password auto hash) → ৬. login-এ redirect
 */
"use client"; // useState, useRouter, form events — client component প্রয়োজন

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { registerSchema, type RegisterInput } from "@/lib/validations/schemas";
import { registerUser } from "@/lib/actions/index";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * react-hook-form সেটআপ
   * mode: "onTouched" — ফিল্ড touch করার পর validation চালায় (login-এ default onSubmit)
   * registerSchema — name, email, password (password-এ uppercase/lowercase/number rule)
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  /**
   * ফর্ম submit — server action দিয়ে account create
   * signIn() ব্যবহার হয় না; register শুধু DB-তে user যোগ করে, login আলাদা step
   */
  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);
    setServerError("");
    const result = await registerUser(data);
    setLoading(false);

    if (!result.success) {
      const errorMessage = result.error ?? "Registration failed";
      toast.error(errorMessage);
      setServerError(errorMessage);
      return;
    }

    toast.success("Registration successful!");
    router.push("/login?registered=1");
    router.refresh();
  };

  return (
    <>
      <p className="font-mono text-[10px] text-[var(--accent-gold)] font-bold tracking-[0.4em] uppercase mb-3">
        CREATE ACCOUNT
      </p>

      <h1 className="text-[2rem] font-black tracking-[-1px] mb-8 text-[var(--text-main)]">
        Join the <span className="gold">KaizenHub.</span>
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <div>
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            placeholder="Kayes Mia"
            className={`form-input ${errors.name ? "border-red-400" : ""}`}
            autoComplete="name"
            aria-label="Enter your full name"
            aria-invalid={errors.name ? "true" : "false"}
          />
          {errors.name && (
            <p className="text-[0.78rem] text-red-400 font-medium" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="you@example.com"
            className={`form-input ${errors.email ? "border-red-400" : ""}`}
            autoComplete="email"
            aria-label="Enter your email address"
            aria-invalid={errors.email ? "true" : "false"}
          />
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
            placeholder="Min 8 chars, uppercase + number"
            className={`form-input ${errors.password ? "border-red-400" : ""}`}
            autoComplete="new-password"
            aria-label="Create a strong password"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="text-[0.78rem] text-red-400 font-medium" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

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
              Creating account...
            </>
          ) : (
            "Create Account"
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
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[var(--accent-indigo)] no-underline font-bold hover:underline"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}
