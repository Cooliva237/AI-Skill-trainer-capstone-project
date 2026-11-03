import test from 'node:test';
import assert from 'node:assert/strict';
import { gymLessons } from '../data/gymLessons';
import { createEmptyProgress, getLessonStatus, markLessonComplete } from '../lib/progress';

test('a fresh learning path exposes only the first lesson', () => {
  const progress = createEmptyProgress(gymLessons);
  assert.equal(getLessonStatus(gymLessons[0], progress, gymLessons), 'available');
  for (const lesson of gymLessons.slice(1)) assert.equal(getLessonStatus(lesson, progress, gymLessons), 'locked');
});
test('completion unlocks the next node and keeps the previous node reviewable', () => {
  const progress = markLessonComplete(createEmptyProgress(gymLessons), gymLessons[0].id, gymLessons);
  assert.equal(getLessonStatus(gymLessons[0], progress, gymLessons), 'completed');
  assert.equal(getLessonStatus(gymLessons[1], progress, gymLessons), 'available');
  assert.equal(getLessonStatus(gymLessons[2], progress, gymLessons), 'locked');
});
test('repeating a completed lesson does not create duplicate rewards', () => {
  let progress = createEmptyProgress(gymLessons);
  progress = markLessonComplete(progress, gymLessons[0].id, gymLessons);
  progress = markLessonComplete(progress, gymLessons[0].id, gymLessons);
  assert.equal(progress.completedLessonIds.length, 1);
});
