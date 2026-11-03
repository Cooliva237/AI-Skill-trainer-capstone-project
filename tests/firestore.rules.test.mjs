import { after, before, beforeEach, test } from 'node:test';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

let env;
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-ai-skill-trainer', firestore: {
    host: '127.0.0.1', port: 8080, rules: await readFile(new URL('../firestore.rules', import.meta.url), 'utf8'),
  } });
});
beforeEach(async () => { await env.clearFirestore(); });
after(async () => { await env?.cleanup(); });
const progress = () => ({ completedLessonIds: ['bench-01'], currentLessonId: 'bench-02', skillProgressPercentage: 8, updatedAt: serverTimestamp() });
const summary = () => ({ id: 's1', exercise: 'bench-press', date: '2026-10-29T12:00:00Z', reps: 5, seconds: 30, side: 'left', source: 'camera', updatedAt: serverTimestamp() });
const alice = () => env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore();
test('owner may save and read lesson progress', async () => {
  const ref = doc(alice(), 'users/alice/progress/gym');
  await assertSucceeds(setDoc(ref, progress())); await assertSucceeds(getDoc(ref));
});
test('other accounts and guests cannot read or write owner data', async () => {
  const ownerRef = doc(alice(), 'users/alice/progress/gym');
  await assertSucceeds(setDoc(ownerRef, progress()));
  for (const db of [env.authenticatedContext('bob').firestore(), env.unauthenticatedContext().firestore()]) {
    const ref = doc(db, 'users/alice/progress/gym');
    await assertFails(getDoc(ref)); await assertFails(setDoc(ref, progress()));
    await assertFails(setDoc(doc(db, 'users/alice/benchSessions/s1'), summary()));
  }
});
test('unknown lessons, duplicates, bad percentages and extra fields are rejected', async () => {
  const ref = doc(alice(), 'users/alice/progress/gym');
  for (const patch of [{ completedLessonIds: ['hacked'] }, { completedLessonIds: ['bench-01','bench-01'] }, { skillProgressPercentage: 101 }, { admin: true }]) {
    await assertFails(setDoc(ref, { ...progress(), ...patch }));
  }
});
test('session ownership and field validation', async () => {
  const ref = doc(alice(), 'users/alice/benchSessions/s1');
  await assertSucceeds(setDoc(ref, summary())); await assertSucceeds(getDoc(ref));
  for (const patch of [{ reps: -1 }, { reps: 2.5 }, { source: 'fake' }, { id: 'wrong' }, { video: 'secret' }]) {
    await assertFails(setDoc(ref, { ...summary(), ...patch }));
  }
});
test('profile uses authenticated email and does not accept passwords', async () => {
  const ref = doc(alice(), 'users/alice');
  const profile = { name: 'Alice', email: 'alice@example.com', updatedAt: serverTimestamp() };
  await assertSucceeds(setDoc(ref, profile));
  await assertFails(setDoc(ref, { ...profile, password: 'plaintext' }));
  await assertFails(setDoc(ref, { ...profile, email: 'bob@example.com' }));
});
test('unrecognized collections and skill paths are denied', async () => {
  await assertFails(setDoc(doc(alice(), 'users/alice/progress/other'), progress()));
  await assertFails(setDoc(doc(alice(), 'admin/alice'), { admin: true }));
});
