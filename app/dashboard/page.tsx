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

export default function DashboardPage() {
  return (
    <RequireAuth>
      <DashboardContent />
    </RequireAuth>
  );
}

function DashboardContent() {
  const { session, progress } = useApp();
  const current = progress.currentLessonId ? getLessonById(progress.currentLessonId) : undefined;
  const finished = progress.completedLessonIds.length === gymLessons.length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coral">Home</p>
      <h1 className="mt-2 font-display text-4xl text-ink">Welcome, {session?.name}</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        Your current skill is Gym & Fitness. Pick up the bench press where you left off.
      </p>

      <section className="mt-8 rounded-[2rem] border border-line bg-raised p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl flex-1">
            <p className="text-sm font-semibold text-muted">Current skill</p>
            <h2 className="mt-1 font-display text-3xl">Gym & Fitness</h2>
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
