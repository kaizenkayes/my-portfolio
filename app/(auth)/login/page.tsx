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
  const [serverError, setServerError] = useState("");
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

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        noValidate
      >
        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="kayesmia674@gmail.com"
            className="form-input"
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "#f87171",
                marginTop: "6px",
              }}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="form-input"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "#f87171",
                marginTop: "6px",
              }}
            >
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
          className="btn-grad-border"
          disabled={loading}
          style={{ width: "100%", textAlign: "center", marginTop: "8px" }}
        >
          {loading ? "Authenticating..." : "Sign In"}
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
