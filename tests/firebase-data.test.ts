import test from 'node:test';
import assert from 'node:assert/strict';
import { decodeProgress } from '../lib/firebase/data';
import { cloudError } from '../lib/firebase/client';
test('cloud progress derives percentage and next lesson from known unique IDs', () => {
  const result = decodeProgress({ completedLessonIds: ['bench-01','bench-01','unknown',12], skillProgressPercentage: 100 });
  assert.deepEqual(result.completedLessonIds, ['bench-01']);
  assert.equal(result.currentLessonId, 'bench-02');
  assert.equal(result.skillProgressPercentage, 8);
});
test('new cloud account has first lesson available', () => {
  const result = decodeProgress(undefined);
  assert.deepEqual(result.completedLessonIds, []);
  assert.equal(result.currentLessonId, 'bench-01');
  assert.equal(result.skillProgressPercentage, 0);
});
test('invalid cloud progress does not crash the lesson UI', () => {
  for (const input of [null, 5, 'bad', { completedLessonIds: 'bad' }]) {
    assert.deepEqual(decodeProgress(input).completedLessonIds, []);
  }
});
test('cloud failures give actionable messages', () => {
  assert.match(cloudError({code:'permission-denied'}), /firestore.rules/);
  assert.match(cloudError({code:'auth/operation-not-allowed'}), /Email\/Password/);
  assert.match(cloudError({code:'auth/invalid-credential'}), /incorrect/);
});
