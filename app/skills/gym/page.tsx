"use client";

import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillTree } from "@/components/SkillTree";
import { gymLessons } from "@/data/gymLessons";

export default function GymSkillPage() {
  return (
    <RequireAuth>
      <GymSkillContent />
    </RequireAuth>
  );
}

function GymSkillContent() {
  const { progress } = useApp();

  return (
    <div className="mx-auto max-w-3xl px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coral">Gym & Fitness</p>
      <h1 className="mt-2 font-display text-4xl">Bench Press</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        Lessons open in order. A locked step stays closed until the one before it is complete.
      </p>

      <div className="mt-6 rounded-3xl border border-line bg-raised p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">
            {progress.completedLessonIds.length} of {gymLessons.length} lessons
          </span>
          <span className="text-muted">{progress.skillProgressPercentage}%</span>
        </div>
        <ProgressBar value={progress.skillProgressPercentage} label="Bench press progress" />
      </div>

      <div className="mt-8">
        <SkillTree />
      </div>
    </div>
  );
}
