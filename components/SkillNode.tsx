import { CheckIcon, LockIcon } from "@/components/icons";
import type { Lesson } from "@/types/lesson";
import type { LessonStatus } from "@/types/progress";
import Link from "next/link";

type SkillNodeProps = {
  lesson: Lesson;
  status: LessonStatus;
  shift?: boolean;
};

const statusLabel: Record<LessonStatus, string> = {
  locked: "Locked",
  available: "Up next",
  completed: "Completed",
};

export function SkillNode({ lesson, status, shift = false }: SkillNodeProps) {
  const circleClass =
    status === "completed"
      ? "bg-sage text-white"
      : status === "available"
        ? "bg-coral text-white"
        : "border border-line bg-raised text-locked";

  const cardClass =
    status === "completed"
      ? "border-sage/30 bg-raised"
      : status === "available"
        ? "border-coral bg-raised shadow-[0_10px_24px_rgba(226,91,58,0.12)]"
        : "border-line bg-raised/80";

  const body = (
    <div className="flex items-start gap-4">
      <span
        className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${circleClass}`}
      >
        {status === "completed" ? <CheckIcon /> : status === "locked" ? <LockIcon /> : lesson.order}
      </span>
      <span className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 ${cardClass} ${shift ? "md:ml-10" : "md:mr-10"}`}>
        <span className="flex items-start justify-between gap-3">
          <span className="font-semibold text-ink">{lesson.title}</span>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${
              status === "completed"
                ? "bg-sage-soft text-sage"
                : status === "available"
                  ? "bg-coral text-white"
                  : "bg-sand text-locked"
            }`}
          >
            {statusLabel[status]}
          </span>
        </span>
      </span>
    </div>
  );

  if (status === "locked") {
    return (
      <div aria-disabled="true" className="cursor-not-allowed">
        {body}
      </div>
    );
  }

  return (
    <Link href={`/lesson/${lesson.id}`} className="block rounded-2xl transition hover:-translate-y-0.5">
      {body}
    </Link>
  );
}
