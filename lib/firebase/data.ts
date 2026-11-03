import { collection, doc, getDocs, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
import { firebaseClient } from './client';
import { gymLessons } from '@/data/gymLessons';
import { createEmptyProgress, markLessonComplete, normalizeProgress } from '@/lib/progress';
import type { UserProgress } from '@/types/progress';
import type { BenchSession } from '@/lib/pose/sessions';

function progressRef(uid: string) { return doc(firebaseClient().db, 'users', uid, 'progress', 'gym'); }
export function decodeProgress(data: unknown): UserProgress {
  const value = data as Partial<UserProgress> | undefined;
  if (!value || !Array.isArray(value.completedLessonIds)) return createEmptyProgress(gymLessons);
  const ids = [...new Set(value.completedLessonIds.filter((id): id is string => typeof id === 'string'))];
  return normalizeProgress({ completedLessonIds: ids, currentLessonId: null, skillProgressPercentage: 0 }, gymLessons);
}
export function watchProgress(uid: string, next: (p: UserProgress) => void, error: (e: unknown) => void) {
  return onSnapshot(progressRef(uid), { includeMetadataChanges: true }, snapshot => {
    // Do not display a pending local write as a confirmed cloud save.
    if (snapshot.metadata.hasPendingWrites || snapshot.metadata.fromCache) return;
    next(decodeProgress(snapshot.data()));
  }, error);
}
export async function updateCloudProgress(uid: string, lessonId: string | null): Promise<void> {
  const { db } = firebaseClient();
  const ref = progressRef(uid);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(ref);
    const previous = decodeProgress(snapshot.data());
    const next = lessonId === null ? createEmptyProgress(gymLessons) : markLessonComplete(previous, lessonId, gymLessons);
    transaction.set(ref, { ...next, updatedAt: serverTimestamp() });
  });
}
export async function loadCloudSessions(uid: string): Promise<BenchSession[]> {
  const result = await getDocs(query(collection(firebaseClient().db, 'users', uid, 'benchSessions'), orderBy('date', 'desc'), limit(20)));
  return result.docs.map(item => item.data() as BenchSession);
}
export async function saveCloudSession(uid: string, session: BenchSession): Promise<void> {
  await setDoc(doc(firebaseClient().db, 'users', uid, 'benchSessions', session.id), { ...session, updatedAt: serverTimestamp() });
}
