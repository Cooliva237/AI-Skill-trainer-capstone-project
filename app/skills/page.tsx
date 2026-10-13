"use client";

import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { SkillCard } from "@/components/SkillCard";
import { skills } from "@/data/skills";

export default function SkillsPage() {
  return (
    <RequireAuth>
      <SkillsContent />
    </RequireAuth>
  );
}

function SkillsContent() {
  const { progress } = useApp();

  return (
    <div className="mx-auto max-w-5xl px-5 py-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-coral">Skills</p>
      <h1 className="mt-2 font-display text-4xl">Choose a skill</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        Gym & Fitness starts with the bench press. Lessons unlock in order.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard
            key={skill.id}
            skill={skill}
            progressPercent={skill.id === "gym" ? progress.skillProgressPercentage : undefined}
          />
        ))}
      </div>
    </div>
  );
}
