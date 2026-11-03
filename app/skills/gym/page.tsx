"use client";
import Link from "next/link";
import { secondaryButton } from "@/components/styles";
import { RequireAuth } from "@/components/AuthGate";
import { useApp } from "@/components/AppProvider";
import { ProgressBar } from "@/components/ProgressBar";
import { SkillTree } from "@/components/SkillTree";
import { TrainingBuddy } from "@/components/TrainingBuddy";
import { PathMilestones } from "@/components/PathMilestones";
import { gymLessons } from "@/data/gymLessons";

export default function GymSkillPage() { return <RequireAuth><GymSkillContent /></RequireAuth>; }
function GymSkillContent() {
  const { progress, progressReady } = useApp();
  return <div className="path-layout"><div>
    <div className="mb-5 flex justify-between gap-3 text-sm font-semibold text-muted"><Link href="/skills">← All skills</Link><span>Strength foundations</span></div>
    <section className="unit-banner"><div><p className="text-xs font-bold uppercase tracking-widest text-sage">Learn it. Try it. Come back to it.</p><h1>Bench press<br />path</h1><p className="mt-3 text-sm text-muted">{gymLessons.length} lessons · Your pace</p></div><TrainingBuddy /></section>
    <p className="mt-5 text-center text-sm text-muted">Tap a step to see what&apos;s inside.</p><SkillTree />
    <div className="mt-8 text-center text-sm text-muted">Learning is progress. Lifting heavier isn&apos;t a requirement.</div>
  </div><aside className="path-side">
    <section className="side-box"><h2>Your progress</h2>{progressReady ? <><div className="mb-3 flex justify-between text-sm"><span>{progress.completedLessonIds.length} / {gymLessons.length} lessons</span><strong>{progress.skillProgressPercentage}%</strong></div><ProgressBar value={progress.skillProgressPercentage} label="Lessons completed" /></> : <p role="status">Loading progress…</p>}</section>
    <section className="side-box"><h2>Your milestones</h2>{progressReady && <PathMilestones completedIds={progress.completedLessonIds} />}<p className="mt-3 text-xs text-muted">For lessons completed—not a score for your technique.</p></section>
    <section className="side-box"><h2>Ready to try it?</h2><p className="mb-5 text-sm leading-6 text-muted">Use the live camera or choose a video from your device. Both options are in the practice lab.</p><Link href="/practice/bench-press" className={secondaryButton}>Camera & video practice</Link><p className="mt-4 text-xs text-muted">Video stays on your device. Saved summaries stay with your account.</p></section>
  </aside></div>;
}
