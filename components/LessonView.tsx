
"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { CompletionPlates } from "@/components/CompletionPlates";
import { primaryButton, secondaryButton } from "@/components/styles";
import { gymLessons } from "@/data/gymLessons";
import { getLessonById, getLessonByOrder } from "@/lib/lessons";
import { getLessonStatus } from "@/lib/progress";
import { lessonQuizzes, passedQuiz } from "@/data/lessonQuizzes";

export function LessonView({ lessonId }: { lessonId: string }) {
  return (
    <RequireAuth>
      <LessonContent key={lessonId} lessonId={lessonId} />
    </RequireAuth>
  );
}

function LessonContent({ lessonId }: { lessonId: string }) {
  const router = useRouter();

  const {
    progress,
    completeLesson,
    saving,
    progressReady,
  } = useApp();

  const [continuing, setContinuing] = useState(false);
  const [choices, setChoices] = useState<(number | undefined)[]>([]);
  const [graded, setGraded] = useState<Record<number, boolean>>({});
  const popup = useRef<HTMLDialogElement>(null);
  const celebration = useRef<HTMLDialogElement>(null);
  const [retryIndex, setRetryIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [saveError, setSaveError] = useState("");

  const lesson = getLessonById(lessonId);
  const quiz = lesson && lessonQuizzes[lesson.id];
  const passed = !!lesson && !!quiz && quiz.questions.every((_,i)=>graded[i]) && passedQuiz(lesson.id, choices);

  async function handleCompleteAndContinue() {
    if (!lesson || !passed || continuing || saving || !progressReady || getLessonStatus(lesson, progress, gymLessons) !== "available") {
      return;
    }

    setContinuing(true);
    setSaveError("");

    try {
      await completeLesson(lesson.id);

      const nextLesson = getLessonByOrder(lesson.order + 1);

      if (nextLesson) {
        router.push(`/lesson/${nextLesson.id}`);
      } else {
        router.push("/practice/bench-press");
      }
    } catch {
      setSaveError("Your answers are still here. Progress wasn’t saved. Check your connection and try Continue again.");
    } finally {
      setContinuing(false);
    }
  }

  if (!lesson) {
    return (
      <p className="px-5 py-16 text-sm text-muted">
        That lesson is not on this path.
      </p>
    );
  }

  if (!progressReady) {
    return (
      <p
        className="px-5 py-16 text-muted"
        role="status"
      >
        Loading your lesson progress…
      </p>
    );
  }

  const status = getLessonStatus(
    lesson,
    progress,
    gymLessons
  );

  const previous = getLessonByOrder(lesson.order - 1);
  const next = getLessonByOrder(lesson.order + 1);

  const nextStatus = next
    ? getLessonStatus(next, progress, gymLessons)
    : "locked";

  const nextDestination = next
    ? `/lesson/${next.id}`
    : "/practice/bench-press";

  const isLastLesson = !next;

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
            Complete the earlier lessons to unlock this one.
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
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-raised">
              What you&apos;ll learn
            </h2>

            <p className="mt-2 text-lg leading-7">
              {lesson.objective}
            </p>
          </section>

          <section className="space-y-3">
            {lesson.content.map((paragraph) => (
              <p
                key={paragraph}
                className="text-base leading-7 text-ink"
              >
                {paragraph}
              </p>
            ))}
          </section>

          {lesson.tips.length > 0 && (
            <section className="rounded-3xl border border-line bg-raised p-5">
              <h2 className="font-display text-xl">
                Tips
              </h2>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                {lesson.tips.map((tip) => (
                  <li
                    key={tip}
                    className="flex gap-2"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lesson.commonMistakes.length > 0 && (
            <section className="rounded-3xl border border-line bg-raised p-5">
              <h2 className="font-display text-xl">
                Common mistakes
              </h2>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-ink">
                {lesson.commonMistakes.map((mistake) => (
                  <li
                    key={mistake}
                    className="flex gap-2"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {quiz && <section className="rounded-3xl border border-line bg-raised p-5">
            <p className="text-xs font-semibold uppercase tracking-wide" aria-live="polite">{lesson.title} · Question {step+1} of {quiz.questions.length}</p>
            <h2 className="mt-2 font-display text-2xl">Your turn</h2>
            {status === "completed" && <p className="mt-2 text-sm">Just reviewing? Your lesson credit is already saved.</p>}
            <p className="mt-4 border-l-4 border-gold pl-3">{quiz.note}</p>
            {quiz.questions.map((q,i)=>i !== step ? null : <fieldset key={q.prompt} className="mt-5" disabled={saving || continuing}>
              <legend className="font-semibold">{q.prompt}</legend>
              {q.options.map((option,j)=><label key={option} className="mt-2 flex items-center gap-3 rounded-xl border border-line p-3">
                <input type="radio" disabled={graded[i]} name={lesson.id+"-q"+i} checked={choices[i]===j} onChange={()=>{setChoices(old=>{const updated=old.slice();updated[i]=j;return updated;});setGraded(old=>({...old,[i]:false}));}}/>{option}
              </label>)}
              {!graded[i] && <button type="button" className={primaryButton+" mt-3"} disabled={choices[i]===undefined} onClick={()=>{
                if(choices[i]===q.answer){setGraded(old=>({...old,[i]:true}));celebration.current?.showModal();}
                else {setRetryIndex(i);popup.current?.showModal();}
              }}>Check answer</button>}
              {graded[i] && <p role="status" className="mt-2 text-sm">That’s right. {q.why}</p>}
              {graded[i] && i+1<quiz.questions.length && <button type="button" className={primaryButton+" mt-3"} onClick={()=>setStep(i+1)}>Next question →</button>}
            </fieldset>)}
            <p role="status" className="mt-2 text-sm">{passed ? "Both correct." : ""}</p>
            <dialog ref={celebration} aria-labelledby="success-title" aria-describedby="success-note" className="fixed inset-0 m-auto max-h-[90dvh] w-[min(90vw,24rem)] overflow-auto rounded-3xl border-2 border-line bg-paper p-5 text-center text-ink backdrop:bg-black/60">
              <Image src="/quiz-good-job.png" alt="Great job! You rock!" unoptimized width={720} height={404} className="h-auto w-full rounded-xl" />
              <h3 id="success-title" className="mt-3 font-display text-2xl">Good job!</h3>
              <p id="success-note" className="my-3 text-sm">{quiz.questions[step].why}</p>
              <button type="button" className={primaryButton} onClick={()=>{
                celebration.current?.close();
                if(step+1<quiz.questions.length) setStep(step+1);
              }}>{step+1<quiz.questions.length ? "Next question →" : "Back to lesson"}</button>
            </dialog>
            <dialog ref={popup} aria-labelledby="retry-title" aria-describedby="retry-hint" className="fixed inset-0 m-auto max-h-[90dvh] w-[min(90vw,22rem)] overflow-auto rounded-3xl border-2 border-line bg-paper p-5 text-center text-ink backdrop:bg-black/60">
              <Image src="/quiz-reaction.png" alt="" unoptimized width={335} height={597} className="mx-auto h-48 w-auto rounded-xl" />
              <h3 id="retry-title" className="mt-3 font-display text-2xl">Try again</h3>
              <p id="retry-hint" className="my-3 text-sm">Question {retryIndex+1}: {quiz.questions[retryIndex].why}</p>
              <button type="button" className={primaryButton} onClick={()=>popup.current?.close()}>Back to the question</button>
            </dialog>
          </section>}
          {saveError && <p role="alert">{saveError}</p>}
          <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            {previous ? (
              <Link
                href={`/lesson/${previous.id}`}
                className={secondaryButton}
              >
                ← Previous
              </Link>
            ) : (
              <span />
            )}

            {status === "available" ? (
              <button
                type="button"
                disabled={
                  saving ||
                  continuing ||
                  !progressReady || !passed
                }
                onClick={handleCompleteAndContinue}
                className={primaryButton}
              >
                {saving || continuing
                  ? "Saving…"
                  : isLastLesson
                    ? "Complete & Start Practice →"
                    : "Complete & Continue →"}
              </button>
            ) : next && nextStatus !== "locked" ? (
              <Link
                href={nextDestination}
                className={primaryButton}
              >
                Continue →
              </Link>
            ) : isLastLesson ? (
              <Link
                href="/practice/bench-press"
                className={primaryButton}
              >
                Start Practice →
              </Link>
            ) : (
              <Link
                href="/skills/gym"
                className={primaryButton}
              >
                Back to Skill Tree
              </Link>
            )}
          </div>

          {status === "completed" && (
            <div
              className="completion-banner"
              role="status"
            >
              <h2>Lesson complete!</h2>

              <CompletionPlates />

              <p className="mt-2 text-sm text-muted">
                {next
                  ? `Next up: ${next.title}.`
                  : "All lessons complete! You're ready for bench press practice."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
