"use client";

import { useApp } from "@/components/AppProvider";
import { quietButton, primaryButton } from "@/components/styles";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import { TrainingIcon, type TrainingIconName } from "@/components/TrainingIcon";

const links = [
  { href: "/dashboard", label: "Home" },
  { href: "/skills/gym", label: "Learn" },
  { href: "/practice/bench-press", label: "Practice" },
  { href: "/progress", label: "Progress" },
];
const navIcons: TrainingIconName[] = ["home", "path", "practice", "award"];

function isActive(href: string, pathname: string): boolean {
  if (href === "/skills/gym") {
    return pathname.startsWith("/skills/gym") || pathname.startsWith("/lesson");
  }
  return pathname === href;
}

function NavLinks({ pathname }: { pathname: string }) {
  return (
    <>
      {links.map((link, index) => {
        const active = isActive(link.href, pathname);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
          >
            <TrainingIcon name={navIcons[index]} />{link.label}
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
        className={primaryButton}
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
    <header className="app-header">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link href={ready && session ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sage-soft text-sage">
            <TrainingIcon name="practice" />
          </span>
          <span className="font-display text-xl text-sage">skill trainer<span className="text-gold">.</span></span>
        </Link>

        {!ready ? (
          <div className="h-9" />
        ) : session ? (
          <nav className="app-nav items-center" aria-label="Main">
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
