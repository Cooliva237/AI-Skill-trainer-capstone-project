"use client";

import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { ProgressBar } from "@/components/ProgressBar";
import { secondaryButton } from "@/components/styles";
import { gymLessons } from "@/data/gymLessons";
import { getLessonById } from "@/lib/lessons";
import { getLessonStatus } from "@/lib/progress";
import Link from "next/link";

export default function ProgressPage() {
  return (
    <RequireAuth>
      <ProgressContent />
    </RequireAuth>
  );
}

function ProgressContent() {
  const { session, progress, resetGymProgress } = useApp();
  const current = progress.currentLessonId ? getLessonById(progress.currentLessonId) : undefined;
  const recentIds = [...progress.completedLessonIds].reverse().slice(0, 3);

  function handleReset() {
    const confirmed = window.confirm("Reset Gym progress? Completed lessons will lock again.");
    if (confirmed) resetGymProgress();
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coral">Progress</p>
      <h1 className="mt-2 font-display text-4xl">Your bench press path</h1>
      <p className="mt-2 text-sm text-muted">
        Signed in as {session?.name} · {session?.email}
      </p>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <article className="rounded-3xl border border-line bg-raised p-4">
          <p className="text-sm text-muted">Gym progress</p>
          <p className="mt-1 font-display text-3xl">{progress.skillProgressPercentage}%</p>
        </article>
        <article className="rounded-3xl border border-line bg-raised p-4">
          <p className="text-sm text-muted">Lessons completed</p>
          <p className="mt-1 font-display text-3xl">
            {progress.completedLessonIds.length}
            <span className="text-lg text-muted"> / {gymLessons.length}</span>
          </p>
        </article>
        <article className="rounded-3xl border border-line bg-raised p-4">
          <p className="text-sm text-muted">Current lesson</p>
          <p className="mt-2 text-sm font-semibold leading-6">
            {current ? current.title : "Path complete"}
          </p>
        </article>
      </section>

      <div className="mt-4">
        <ProgressBar value={progress.skillProgressPercentage} label="Gym skill progress" />
      </div>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Bench press progression</h2>
        <ol className="mt-4 space-y-2">
          {gymLessons.map((lesson) => {
            const status = getLessonStatus(lesson, progress, gymLessons);
            const label = status === "completed" ? "Completed" : status === "available" ? "Up next" : "Locked";

            return (
              <li
                key={lesson.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-raised px-4 py-3"
              >
                <span className="text-sm">
                  <span className="mr-2 text-muted">{lesson.order}.</span>
                  {status === "locked" ? (
                    lesson.title
                  ) : (
                    <Link href={`/lesson/${lesson.id}`} className="font-medium hover:text-coral">
                      {lesson.title}
                    </Link>
                  )}
                </span>
                <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Recent completed lessons</h2>
        {recentIds.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No lessons completed yet.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {recentIds.map((id) => {
              const lesson = getLessonById(id);
              if (!lesson) return null;
              return (
                <li key={id}>
                  <Link
                    href={`/lesson/${lesson.id}`}
                    className="block rounded-2xl border border-line bg-raised px-4 py-3 text-sm font-medium hover:border-coral"
                  >
                    {lesson.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <button
        type="button"
        onClick={handleReset}
        disabled={progress.completedLessonIds.length === 0}
        className={`${secondaryButton} mt-10`}
      >
        Reset Gym progress
      </button>
    </div>
  );
}
