
"use client";

import { forgotPassword } from "@/lib/auth";
import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const result = await forgotPassword(email);

      if (result.ok) {
        setMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <h1 className="font-display text-4xl text-ink">
        Forgot Password?
      </h1>

      <p className="mt-3 text-sm text-muted">
        Enter your email address and we'll send you a link
        to reset your password.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-line bg-raised p-5"
      >
        <label className="block text-sm font-semibold text-ink">
          Email Address
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-ink outline-none focus:border-coral"
            required
          />
        </label>

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-green-600" role="status">
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-navy px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-muted">
        Remember your password?{" "}
        <Link href="/login" className="font-semibold text-coral">
          Back to Login
        </Link>
      </p>
    </div>
  );
}
