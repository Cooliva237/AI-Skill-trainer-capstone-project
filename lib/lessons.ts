import { gymLessons } from "@/data/gymLessons";
import type { Lesson } from "@/types/lesson";
import { canonicalBenchId } from "@/data/benchCurriculum";

export function getLessonById(id: string): Lesson | undefined {
  return gymLessons.find((lesson) => lesson.id === canonicalBenchId(id));
}

export function getLessonByOrder(order: number): Lesson | undefined {
  return gymLessons.find((lesson) => lesson.order === order);
}
