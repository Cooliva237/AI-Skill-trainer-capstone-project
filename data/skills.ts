import type { Skill } from "@/types/skill";

export const GYM_SKILL_ID = "gym";

export const skills: Skill[] = [
  {
    id: GYM_SKILL_ID,
    title: "Gym & Fitness",
    summary: "A beginner bench press path: safety, setup, and the basic lift.",
  },
];

export function getSkill(skillId: string): Skill | undefined {
  return skills.find((skill) => skill.id === skillId);
}
