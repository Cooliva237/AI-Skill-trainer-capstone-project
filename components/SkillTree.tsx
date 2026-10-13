"use client";

import { SkillNode } from "@/components/SkillNode";
import { useApp } from "@/components/AppProvider";
import { gymLessons } from "@/data/gymLessons";
import { getLessonStatus } from "@/lib/progress";

export function SkillTree() {
  const { progress } = useApp();

  return (
    <ol className="relative mx-auto max-w-xl space-y-4">
      <div className="pointer-events-none absolute bottom-8 left-[1.3rem] top-6 w-px bg-line" aria-hidden="true" />
      {gymLessons.map((lesson, index) => (
        <li key={lesson.id}>
          <SkillNode
            lesson={lesson}
            status={getLessonStatus(lesson, progress, gymLessons)}
            shift={index % 2 === 1}
          />
        </li>
      ))}
    </ol>
  );
}
