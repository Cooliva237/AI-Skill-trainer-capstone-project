export type LessonStatus = "locked" | "available" | "completed";

export type UserProgress = {
  completedLessonIds: string[];
  currentLessonId: string | null;
  skillProgressPercentage: number;
};
