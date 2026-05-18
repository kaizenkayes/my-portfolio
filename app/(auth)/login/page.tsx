"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { loginSchema, type LoginInput } from "@/lib/validations/schemas";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "1") {
      toast.success("Registration successful! Please sign in.");
      router.replace("/login");
    }
  }, [searchParams, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email.trim(),
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
        return;
      }

      toast.success("Login successful!");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="font-mono text-[10px] text-[var(--accent-gold)] font-bold tracking-[0.4em] uppercase mb-3">
        ADMIN ACCESS
      </p>

      <h1 className="text-[2rem] font-black tracking-[-1px] mb-8 text-[var(--text-main)]">
        Welcome <span className="indigo">Back.</span>
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <div className="flex flex-col gap-1.5">
          <label className="form-label" htmlFor="email">
            Email Address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            placeholder="example@domain.com"
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
