
"use client";

import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { primaryButton, secondaryButton } from "@/components/styles";
import { gymLessons } from "@/data/gymLessons";
import { getLessonById, getLessonByOrder } from "@/lib/lessons";
import { getLessonStatus } from "@/lib/progress";
import Link from "next/link";

export function LessonView({ lessonId }: { lessonId: string }) {
  return (
    <RequireAuth>
      <LessonContent lessonId={lessonId} />
    </RequireAuth>
  );
}

function LessonContent({ lessonId }: { lessonId: string }) {
  const { progress, completeLesson } = useApp();
  const lesson = getLessonById(lessonId);

  if (!lesson) {
    return (
      <p className="px-5 py-16 text-sm text-muted">
        That lesson is not on this path.
      </p>
    );
  }

  const status = getLessonStatus(lesson, progress, gymLessons);
  const previous = getLessonByOrder(lesson.order - 1);
  const next = getLessonByOrder(lesson.order + 1);
  const nextStatus = next
    ? getLessonStatus(next, progress, gymLessons)
    : "locked";

  return (
    <div className="mx-auto max-w-2xl px-5 py-8">
      <Link
        href="/skills/gym"
        className="text-sm font-semibold text-muted hover:text-ink"
      >
        ← Skill tree
      </Link>

      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-coral">
        Lesson {lesson.order} of {gymLessons.length}
      </p>

      <h1 className="mt-2 font-display text-4xl text-ink">
        {lesson.title}
      </h1>

      <p className="mt-3 text-base leading-7 text-muted">
        {lesson.description}
      </p>

      {status === "locked" ? (
        <div className="mt-8 rounded-3xl border border-line bg-raised p-6">
          <h2 className="font-display text-2xl">
            This lesson is locked
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted">
            Finish the earlier lessons to open this one. The skill
            tree shows which step is next.
          </p>

          <Link
            href="/skills/gym"
            className={`${primaryButton} mt-5`}
          >
            Back to skill tree
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          <section className="rounded-3xl bg-navy px-5 py-4 text-raised">
            <h2 className="text-base font-bold uppercase tracking-[0.14em] text-coral">
              Objective
            </h2>

            <p className="mt-2 text-lg leading-7">
              {lesson.objective}
            </p>
          </section>

          <section className="space-y-3">
            {lesson.content.map((item, index) => (
              <div key={index}>
                {item.heading && (
                  <h2 className="mt-6 text-xl font-bold leading-7 text-ink">
                    {item.heading}
                  </h2>
                )}

                {item.text && (
                  <p className="mt-2 text-base leading-7 text-ink">
                    {item.text}
                  </p>
                )}
              </div>
            ))}
          </section>

          {lesson.tips.length > 0 && (
            <section className="rounded-3xl border border-line bg-raised p-5">
              <h2 className="font-display text-2xl font-bold">
                Tips
              </h2>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                {lesson.tips.map((tip) => (
                  <li key={tip} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lesson.commonMistakes.length > 0 && (
            <section className="rounded-3xl border border-line bg-raised p-5">
              <h2 className="font-display text-2xl font-bold">
                Common mistakes
              </h2>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                {lesson.commonMistakes.map((mistake) => (
                  <li key={mistake} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            {previous ? (
              <Link
                href={`/lesson/${previous.id}`}
                className={secondaryButton}
              >
                Previous
              </Link>
            ) : (
              <span />
            )}

            {status === "available" ? (
              <button
                type="button"
                onClick={() => completeLesson(lesson.id)}
                className={primaryButton}
              >
                Complete lesson
              </button>
            ) : next && nextStatus !== "locked" ? (
              <Link
                href={`/lesson/${next.id}`}
                className={primaryButton}
              >
                Next lesson
              </Link>
            ) : (
              <Link href="/skills/gym" className={primaryButton}>
                Back to skill tree
              </Link>
            )}
          </div>

          {status === "completed" && (
            <p className="text-sm text-sage">
              Lesson complete.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
