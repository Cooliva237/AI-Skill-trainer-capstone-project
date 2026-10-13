"use client";

import { useApp } from "@/components/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { ready, session } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && !session) {
      router.replace("/login");
    }
  }, [ready, session, router]);

  if (!ready || !session) {
    return <p className="px-5 py-16 text-sm text-muted">Loading your session...</p>;
  }

  return children;
}

export function RedirectIfSignedIn({ children }: { children: ReactNode }) {
  const { ready, session } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (ready && session) {
      router.replace("/dashboard");
    }
  }, [ready, session, router]);

  if (!ready || session) {
    return <p className="px-5 py-16 text-sm text-muted">Loading...</p>;
  }

  return children;
}
