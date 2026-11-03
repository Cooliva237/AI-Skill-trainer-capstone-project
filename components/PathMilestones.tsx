import { TrainingIcon } from "@/components/TrainingIcon";
import { gymLessons } from "@/data/gymLessons";
export function PathMilestones({ completedIds }: { completedIds: string[] }) {
  const earned = new Set(completedIds);
  return <div>{["First step", "Setup student", "Path complete"].map((title, index) => {
    const required = [1, 4, gymLessons.length][index];
    const unlocked = gymLessons.slice(0, required).every(lesson => earned.has(lesson.id));
    return <div className="milestone" key={title}><span className={`milestone-symbol ${unlocked ? "earned" : ""}`}><TrainingIcon name={unlocked ? "award" : "star"} /></span><div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-muted">{unlocked ? "Earned" : `Complete lessons 1–${required}`}</p></div></div>;
  })}</div>;
}
