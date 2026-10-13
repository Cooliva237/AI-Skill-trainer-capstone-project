import type { Lesson } from "@/types/lesson";
import type { LessonStatus, UserProgress } from "@/types/progress";

type ProgressFile = {
  bySkill: Record<string, UserProgress>;
};

function progressKey(email: string): string {
  return `ast-progress:${email}`;
}

export function createEmptyProgress(lessons: Lesson[]): UserProgress {
  return {
    completedLessonIds: [],
    currentLessonId: lessons[0]?.id ?? null,
    skillProgressPercentage: 0,
  };
}

function isUserProgress(value: unknown): value is UserProgress {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  const ids = record.completedLessonIds;
  return (
    Array.isArray(ids) &&
    ids.every((id) => typeof id === "string") &&
    (record.currentLessonId === null || typeof record.currentLessonId === "string") &&
    typeof record.skillProgressPercentage === "number"
  );
}

function readProgressFile(email: string): ProgressFile {
  if (typeof window === "undefined") return { bySkill: {} };

  try {
    const raw = window.localStorage.getItem(progressKey(email));
    if (!raw) return { bySkill: {} };
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return { bySkill: {} };

    const record = parsed as Record<string, unknown>;
    if (typeof record.bySkill !== "object" || record.bySkill === null) {
      return { bySkill: {} };
    }

    const bySkill: Record<string, UserProgress> = {};
    for (const [skillId, value] of Object.entries(record.bySkill)) {
      if (isUserProgress(value)) bySkill[skillId] = value;
    }
    return { bySkill };
  } catch {
    return { bySkill: {} };
  }
}

function writeProgressFile(email: string, file: ProgressFile): void {
  window.localStorage.setItem(progressKey(email), JSON.stringify(file));
}

// Rebuild percentage and the current lesson from completed ids.
// Stored percentage can go stale if we add lessons later, so we do not trust it.
export function normalizeProgress(progress: UserProgress, lessons: Lesson[]): UserProgress {
  const known = new Set(lessons.map((lesson) => lesson.id));
  const completedLessonIds = progress.completedLessonIds.filter((id) => known.has(id));
  const completed = new Set(completedLessonIds);
  const current = lessons.find((lesson) => !completed.has(lesson.id));

  return {
    completedLessonIds,
    currentLessonId: current?.id ?? null,
    skillProgressPercentage: percentage(completedLessonIds.length, lessons.length),
  };
}

function percentage(completedCount: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completedCount / total) * 100);
}

export function loadSkillProgress(
  email: string,
  skillId: string,
  lessons: Lesson[],
): UserProgress {
  const stored = readProgressFile(email).bySkill[skillId];
  if (!stored) return createEmptyProgress(lessons);
  return normalizeProgress(stored, lessons);
}

export function saveSkillProgress(
  email: string,
  skillId: string,
  progress: UserProgress,
): void {
  const file = readProgressFile(email);
  file.bySkill[skillId] = progress;
  writeProgressFile(email, file);
}

// Follow prerequisiteId back to the start.
// A later lesson stays locked until every earlier lesson is complete.
function prerequisitesMet(lesson: Lesson, completed: Set<string>, lessons: Lesson[]): boolean {
  const byId = new Map(lessons.map((item) => [item.id, item]));
  let prerequisiteId = lesson.prerequisiteId;

  while (prerequisiteId) {
    if (!completed.has(prerequisiteId)) return false;
    prerequisiteId = byId.get(prerequisiteId)?.prerequisiteId ?? null;
  }

  return true;
}

export function getLessonStatus(
  lesson: Lesson,
  progress: UserProgress,
  lessons: Lesson[],
): LessonStatus {
  if (progress.completedLessonIds.includes(lesson.id)) return "completed";

  const completed = new Set(progress.completedLessonIds);
  return prerequisitesMet(lesson, completed, lessons) ? "available" : "locked";
}

export function markLessonComplete(
  progress: UserProgress,
  lessonId: string,
  lessons: Lesson[],
): UserProgress {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return progress;
  if (getLessonStatus(lesson, progress, lessons) === "locked") return progress;
  if (progress.completedLessonIds.includes(lessonId)) return progress;

  return normalizeProgress(
    {
      ...progress,
      completedLessonIds: [...progress.completedLessonIds, lessonId],
    },
    lessons,
  );
}
