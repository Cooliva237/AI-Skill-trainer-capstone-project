"use client";

import { RedirectIfSignedIn } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { primaryButton } from "@/components/styles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type AuthFormProps = {
  mode: "login" | "signup";
};

export function AuthForm({ mode }: AuthFormProps) {
  return (
    <RedirectIfSignedIn>
      <AuthFormFields mode={mode} />
    </RedirectIfSignedIn>
  );
}

function AuthFormFields({ mode }: AuthFormProps) {
  const { login, signup } = useApp();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true); setError(null);
    const result = await (isSignup ? signup({ name, email, password }) : login({ email, password }));
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-5 py-12">
      <h1 className="font-display text-4xl text-ink">{isSignup ? "Create account" : "Log in"}</h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        {isSignup
          ? "Create an account to save your lessons and pick up where you left off."
          : "Log in to continue your training."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-raised p-5">
        {isSignup && (
          <label className="block text-sm font-semibold text-ink">
            Name
            <input
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 font-normal text-ink outline-none focus:border-coral"
              required
            />
          </label>
        )}

        <label className="block text-sm font-semibold text-ink">
          Email
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 font-normal text-ink outline-none focus:border-coral"
            required
          />
        </label>

        <label className="block text-sm font-semibold text-ink">
          Password
          <input
            type="password"
            name="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-line bg-paper px-3 py-2.5 font-normal text-ink outline-none focus:border-coral"
            required
            minLength={isSignup ? 6 : undefined}
          />
        </label>

        {error && (
          <p className="text-sm text-coral" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className={`${primaryButton} w-full`}>
          {submitting ? "Please wait…" : isSignup ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink hover:text-coral">
              Log in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/signup" className="font-semibold text-ink hover:text-coral">
              Create account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
