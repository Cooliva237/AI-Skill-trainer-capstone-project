"use client";
import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/components/AppProvider";
import { gymLessons } from "@/data/gymLessons";
import { getLessonStatus } from "@/lib/progress";
import { CheckIcon, LockIcon } from "@/components/icons";
import { TrainingIcon } from "@/components/TrainingIcon";
import { primaryButton, secondaryButton } from "@/components/styles";

const units = ["Set yourself up", "Follow the movement"];
export function SkillTree() {
  const { progress, progressReady } = useApp();
  const [selected, setSelected] = useState<string | null>(null);
  if (!progressReady) return <p role="status" className="py-12 text-center text-muted">Loading your learning path…</p>;
  return <div>{units.map((title, unit) => <section className="path-unit" key={title} aria-label={title}>
    <h2 className="path-unit-title">{unit + 1} · {title}</h2>
    <ol className="lesson-path" start={unit * 4 + 1}>
      {gymLessons.slice(unit * 4, unit * 4 + 4).map(lesson => {
        const status = getLessonStatus(lesson, progress, gymLessons);
        const open = selected === lesson.id;
        const prerequisite = gymLessons.find(item => item.id === lesson.prerequisiteId);
        const stateLabel = status === "available" ? "Up next" : status === "completed" ? "Complete" : "Locked";
        return <li className="path-stop" key={lesson.id}>
          <button type="button" className={`path-node ${status}`} aria-expanded={open} aria-controls={`detail-${lesson.id}`} aria-label={`${lesson.order}. ${lesson.title}. ${stateLabel}. Show preview`} onClick={() => setSelected(open ? null : lesson.id)} onKeyDown={event => { if (event.key === "Escape") setSelected(null); }}>
            {status === "completed" ? <CheckIcon /> : status === "locked" ? <LockIcon /> : <TrainingIcon name="star" />}
          </button>
          <span className="node-caption">{lesson.title}<span className="block text-xs font-normal text-muted">{stateLabel} · Lesson {lesson.order}</span></span>
          <div id={`detail-${lesson.id}`} hidden={!open} className="node-details" onKeyDown={event => { if (event.key === "Escape") { setSelected(null); document.querySelector<HTMLButtonElement>(`[aria-controls="detail-${lesson.id}"]`)?.focus(); } }}>
            <h3>{lesson.title}</h3><p>{lesson.description}</p>
            {status === "locked" ? <><p>Finish {prerequisite ? `“${prerequisite.title}”` : "the earlier lessons"} to unlock this step.</p><Link href={`/lesson/${progress.currentLessonId ?? gymLessons[0].id}`} className={secondaryButton}>Go to your next lesson</Link></> : <Link className={primaryButton} href={`/lesson/${lesson.id}`}>{status === "completed" ? "Practice your recall" : "Start lesson"}</Link>}
          </div>
        </li>;
      })}
    </ol>
  </section>)}</div>;
}
