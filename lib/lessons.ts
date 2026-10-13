import { gymLessons } from "@/data/gymLessons";
import type { Lesson } from "@/types/lesson";

export function getLessonById(id: string): Lesson | undefined {
  return gymLessons.find((lesson) => lesson.id === id);
}

export function getLessonByOrder(order: number): Lesson | undefined {
  return gymLessons.find((lesson) => lesson.order === order);
}
