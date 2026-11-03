import test from 'node:test';
import assert from 'node:assert/strict';
import { gymLessons } from '../data/gymLessons';
import { benchGroups, foldBenchTopics, expandBenchLessons } from '../data/benchCurriculum';
import { decodeProgress } from '../lib/firebase/data';
import { getLessonById } from '../lib/lessons';
import { createEmptyProgress, markLessonComplete, loadSkillProgress, saveSkillProgress } from '../lib/progress';

test('eight lessons retain all twelve source topics with sequential prerequisites', () => {
  assert.equal(gymLessons.length, 8);
  assert.equal(new Set(benchGroups.flatMap(group => group.topics)).size, 12);
  gymLessons.forEach((lesson, index) => {
    assert.equal(lesson.order, index + 1);
    assert.equal(lesson.prerequisiteId, index ? gymLessons[index - 1].id : null);
    assert.equal(lesson.id, benchGroups[index].id);
  });
});
test('each possible old sequential completion state maps conservatively', () => {
  const all = benchGroups.flatMap(group => group.topics);
  for (let count = 0; count <= 12; count++) {
    const topics = all.slice(0, count);
    const expected = benchGroups.filter(group => group.topics.every(id => topics.includes(id))).map(group => group.id);
    const progress = decodeProgress({ completedLessonIds: topics });
    assert.deepEqual(progress.completedLessonIds, expected);
    assert.equal(progress.skillProgressPercentage, Math.round(expected.length / 8 * 100));
    assert.equal(progress.currentLessonId, gymLessons[expected.length]?.id ?? null);
  }
});
test('partial merged lessons do not get silently marked complete', () => {
  assert.deepEqual(foldBenchTopics(['bench-01']), []);
  assert.deepEqual(foldBenchTopics(['bench-02']), []);
  assert.deepEqual(foldBenchTopics(['bench-03']), []);
  assert.deepEqual(foldBenchTopics(['bench-11']), []);
});
test('every new completion round-trips through legacy-compatible storage', () => {
  let progress = createEmptyProgress(gymLessons);
  for (const lesson of gymLessons) {
    progress = markLessonComplete(progress, lesson.id, gymLessons);
    const topics = expandBenchLessons(progress.completedLessonIds);
    assert.deepEqual(decodeProgress({ completedLessonIds: topics }), progress);
    assert.ok(topics.length <= 12);
    assert.equal(new Set(topics).size, topics.length);
  }
  assert.equal(progress.skillProgressPercentage, 100);
});
test('merging writes preserves partial legacy credit and filters unknown IDs', () => {
  assert.deepEqual(expandBenchLessons(['bench-02'], ['bench-03', 'unknown']), ['bench-01', 'bench-02', 'bench-03']);
});
test('old bookmarks resolve to the matching combined lesson', () => {
  assert.equal(getLessonById('bench-01')?.id, 'bench-02');
  assert.equal(getLessonById('bench-03')?.id, 'bench-04');
  assert.equal(getLessonById('bench-09')?.id, 'bench-10');
  assert.equal(getLessonById('bench-11')?.id, 'bench-12');
  assert.equal(getLessonById('missing'), undefined);
});
test('local persistence keeps partial topics, reloads and resets cleanly', () => {
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const storage = new Map<string, string>();
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
  } } });
  try {
    storage.set('ast-progress:tester@example.com', JSON.stringify({ bySkill: { gym: {completedLessonIds:['bench-01','bench-02','bench-03'], currentLessonId:'bench-04',skillProgressPercentage:25} } }));
    const loaded = loadSkillProgress('tester@example.com', 'gym', gymLessons);
    assert.deepEqual(loaded.completedLessonIds, ['bench-02']);
    saveSkillProgress('tester@example.com', 'gym', loaded);
    assert.ok(JSON.parse(storage.get('ast-progress:tester@example.com')!).bySkill.gym.completedLessonIds.includes('bench-03'));
    const next = markLessonComplete(loaded, 'bench-04', gymLessons);
    saveSkillProgress('tester@example.com', 'gym', next);
    assert.deepEqual(loadSkillProgress('tester@example.com', 'gym', gymLessons), next);
    saveSkillProgress('tester@example.com', 'gym', createEmptyProgress(gymLessons));
    assert.deepEqual(loadSkillProgress('tester@example.com', 'gym', gymLessons), createEmptyProgress(gymLessons));
    assert.deepEqual(loadSkillProgress('other@example.com', 'gym', gymLessons), createEmptyProgress(gymLessons));
  } finally {
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
    else Reflect.deleteProperty(globalThis, 'window');
  }
});
