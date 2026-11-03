"use client";

import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillCard } from "@/components/SkillCard";
import { primaryButton } from "@/components/styles";
import { gymLessons } from "@/data/gymLessons";
import { skills } from "@/data/skills";
import { getLessonById } from "@/lib/lessons";
import Link from "next/link";
import { TrainingBuddy } from "@/components/TrainingBuddy";
import { PathMilestones } from "@/components/PathMilestones";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { session, progress, progressReady } = useApp();
  const current = progress.currentLessonId ? getLessonById(progress.currentLessonId) : undefined;
  const finished = progress.completedLessonIds.length === gymLessons.length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coral">Your training corner</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Hey, {session?.name?.split(" ")[0]}.</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        A little practice goes a long way. Ready for your next step?
      </p>

      {!progressReady ? <p className="py-10" role="status">Loading your progress…</p> : <section className="welcome-panel mt-8">
        <TrainingBuddy />
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-sage">Keep your momentum</p>
            <h2 className="mt-1 font-display text-3xl">Your bench press journey</h2>
            <p className="mt-3 text-sm text-ink">
              {progress.completedLessonIds.length} of {gymLessons.length} lessons · {progress.skillProgressPercentage}%
            </p>
            <div className="mt-3">
              <ProgressBar value={progress.skillProgressPercentage} label="Gym skill progress" />
            </div>
            <p className="mt-3 text-sm text-muted">
              {finished
                ? "You finished the bench press path. You can revisit any lesson."
                : `Up next: ${current?.title ?? "Bench press"}`}
            </p>
          </div>
          <Link href={finished || !current ? "/skills/gym" : `/lesson/${current.id}`} className={primaryButton}>
            {finished ? "Review path" : "Continue learning"}
          </Link>
        </div>
      </section>}

      <section className="mt-10 grid gap-8 sm:grid-cols-2">
        <div className="side-box"><h2>Your milestones</h2>{progressReady && <PathMilestones completedIds={progress.completedLessonIds} />}</div>
        <div className="py-5"><p className="text-xs font-bold uppercase tracking-widest text-sage">A note from your training buddy</p><h2 className="mt-3 text-2xl">You can always take a step back.</h2><p className="mt-3 text-sm leading-7 text-muted">Forgot something? Every completed lesson stays open. Revisiting the basics is part of learning, not starting over.</p><Link className="mt-4 inline-block font-semibold text-sage underline underline-offset-4" href="/skills/gym">Explore your learning path →</Link></div>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Available skills</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              progressPercent={skill.id === "gym" ? progress.skillProgressPercentage : undefined}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
