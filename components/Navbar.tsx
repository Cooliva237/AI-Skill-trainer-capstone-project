"use client";

import { useApp } from "@/components/AppProvider";
import { quietButton } from "@/components/styles";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/skills", label: "Skills" },
  { href: "/skills/gym", label: "Skill Tree" },
  { href: "/progress", label: "Progress" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/skills/gym") {
    return pathname.startsWith("/skills/gym") || pathname.startsWith("/lesson");
  }
  return pathname === href;
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {links.map((link) => {
        const active = isActive(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
              active ? "bg-navy text-raised" : "text-muted hover:text-ink"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {link.label}
          </Link>
        );
      })}
    </>
  );
}

function ActiveNavLinks() {
  const pathname = usePathname();
  return <NavLinks pathname={pathname} />;
}

function GuestLinks() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/signup") return null;

  return (
    <div className="flex items-center gap-2">
      <Link href="/login" className={quietButton}>
        Log in
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center justify-center rounded-full bg-coral px-4 py-2 text-sm font-semibold text-white hover:bg-coral-deep"
      >
        Get started
      </Link>
    </div>
  );
}

export function Navbar() {
  const router = useRouter();
  const { ready, session, logout } = useApp();

  async function handleLogout() {
    if (await logout()) router.push("/");
  }

  return (
    <header className="sticky top-0 z-20 border-b border-line/80 bg-raised/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href={ready && session ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-raised">
            AI
          </span>
          <span className="font-display text-lg text-ink">AI Skill Trainer</span>
        </Link>

        {!ready ? (
          <div className="h-9" />
        ) : session ? (
          <nav className="flex flex-wrap items-center gap-1" aria-label="Main">
            <Suspense fallback={<NavLinks pathname="" />}>
              <ActiveNavLinks />
            </Suspense>
            <span className="ml-1 hidden max-w-36 truncate text-sm text-muted md:inline">{session.name}</span>
            <button type="button" onClick={handleLogout} className={quietButton}>
              Log out
            </button>
          </nav>
        ) : (
          <Suspense fallback={null}>
            <GuestLinks />
          </Suspense>
        )}
      </div>
    </header>
  );
}
