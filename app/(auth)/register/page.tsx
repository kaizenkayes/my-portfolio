"use client";

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
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);

    try {
      const result = await registerUser(data);

      if (!result.success) {
        toast.error(result.error ?? "Registration failed");
        return;
      }

      toast.success("Account created successfully!");

      router.push("/login?registered=1");
      router.refresh();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.log(error);
    } finally {
      setLoading(false);
    }
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
        {/* NAME FIELD */}
        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
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

        <div className="flex flex-col gap-1.5">
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

      <p className="text-center mt-7 text-[0.85rem] text-[var(--text-dim)]">
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
