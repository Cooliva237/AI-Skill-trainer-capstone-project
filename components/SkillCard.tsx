import { primaryButton } from "@/components/styles";
import type { Skill } from "@/types/skill";
import Link from "next/link";

type SkillCardProps = {
  skill: Skill;
  progressPercent?: number;
};

export function SkillCard({ skill, progressPercent }: SkillCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl border border-line bg-raised p-5 shadow-[0_12px_30px_rgba(28,36,48,0.05)]">
      <h2 className="font-display text-2xl text-ink">{skill.title}</h2>
      <p className="mt-3 flex-1 text-sm leading-6 text-muted">{skill.summary}</p>
      {typeof progressPercent === "number" && (
        <p className="mt-3 text-sm font-semibold text-ink">{progressPercent}% complete</p>
      )}
      <Link href={`/skills/${skill.id}`} className={`${primaryButton} mt-5`}>
        Open path
      </Link>
    </article>
  );
}
