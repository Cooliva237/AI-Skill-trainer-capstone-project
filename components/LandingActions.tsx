"use client";

import { useApp } from "@/components/AppProvider";
import { primaryButton, secondaryButton } from "@/components/styles";
import Link from "next/link";

export function LandingActions() {
  const { ready, session } = useApp();

  if (!ready) {
    return <div className="mt-8 h-12" />;
  }

  if (session) {
    return (
      <div className="mt-8">
        <Link href="/dashboard" className={primaryButton}>
          Continue learning
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      <Link href="/signup" className={primaryButton}>
        Get started
      </Link>
      <Link
        href="/login"
        className={secondaryButton}
      >
        Log in
      </Link>
    </div>
  );
}
