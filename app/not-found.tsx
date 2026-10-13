import { primaryButton } from "@/components/styles";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="font-display text-4xl">Page not found</h1>
      <p className="mt-3 text-sm leading-6 text-muted">That address is not part of AI Skill Trainer.</p>
      <Link href="/" className={`${primaryButton} mt-6`}>
        Back home
      </Link>
    </div>
  );
}
