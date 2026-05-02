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
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

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
        CREATE ACCOUNT
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
        Join the <span className="gold">Lab.</span>
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        noValidate
      >
        <div>
          <label className="form-label" htmlFor="name">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Kayes Mia"
            className="form-input"
            autoComplete="name"
            {...register("name")}
          />
          {errors.name && (
            <p
              style={{
                fontSize: "0.78rem",
                color: "#f87171",
                marginTop: "6px",
              }}
            >
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="form-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
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
            placeholder="Min 8 chars, uppercase + number"
            className="form-input"
            autoComplete="new-password"
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
          {loading ? "Creating account..." : "Create Account"}
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
          style={{
            color: "var(--accent-indigo)",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          Sign In
        </Link>
      </p>
    </>
  );
}
