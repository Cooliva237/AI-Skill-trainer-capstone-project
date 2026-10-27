"use client";

import { supabase } from "@/lib/supabase";
import { updatePassword } from "@/lib/auth";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


useEffect(() => {
  let active = true;

  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (active && event === "PASSWORD_RECOVERY") {
      setReady(true);
      setError("");
    }
  });

  async function checkRecoverySession() {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!active) return;

    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.substring(1));

    const recoveryLink =
      hash.get("type") === "recovery" ||
      url.searchParams.get("type") === "recovery";

    if (recoveryLink && sessionData.session) {
      setReady(true);
      setError("");
    }
  }

  void checkRecoverySession();

  return () => {
    active = false;
    data.subscription.unsubscribe();
  };
}, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!ready) {
      setError("Open a valid password-reset link from your email.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await updatePassword(password);

      if (result.ok) {
        setMessage(result.message);
        setPassword("");
        setConfirmPassword("");
        setReady(false);
        await supabase.auth.signOut();
      } else {
        setError(result.message);
      }
    } catch {
      setError("Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <h1 className="font-display text-4xl text-ink">
        Reset Password
      </h1>

      <p className="mt-3 text-sm text-muted">
        Enter your new password below after opening
        the reset link from your email.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded-3xl border border-line bg-raised p-5"
      >
        <label className="block text-sm font-semibold text-ink">
          New Password
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-ink"
            required
            minLength={6}
          />
        </label>

        <label className="block text-sm font-semibold text-ink">
          Confirm New Password
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 text-ink"
            required
            minLength={6}
          />
        </label>

        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="text-sm text-green-600" role="status">
            {message}{" "}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </p>
        )}

        <button
          type="submit"
          disabled={loading || !ready}
          className="w-full rounded-2xl bg-navy px-5 py-3 font-semibold text-white disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

        {!ready && !message && (
          <p className="text-sm text-muted">
            Waiting for a valid password-reset link...
          </p>
        )}
      </form>
    </div>
  );
}