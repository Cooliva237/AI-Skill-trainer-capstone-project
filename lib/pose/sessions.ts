export type BenchSession = { id: string; exercise: 'bench-press'; date: string; reps: number; seconds: number; side: 'left' | 'right'; source: 'camera' | 'video' };
const key = (email: string) => `ast-bench-sessions:${email}`;
export function loadBenchSessions(email: string): BenchSession[] {
  const raw = localStorage.getItem(key(email));
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error('Saved session history is unreadable.');
  return data.filter((s): s is BenchSession => s && typeof s.id === 'string' && s.exercise === 'bench-press' && typeof s.date === 'string' && Number.isFinite(s.reps) && s.reps >= 0 && Number.isFinite(s.seconds) && s.seconds >= 0 && ['left','right'].includes(s.side) && ['camera','video'].includes(s.source)).slice(0, 20);
}
export function saveBenchSession(email: string, session: BenchSession): BenchSession[] {
  const sessions = [session, ...loadBenchSessions(email).filter(s => s.id !== session.id)].slice(0, 20);
  localStorage.setItem(key(email), JSON.stringify(sessions));
  return sessions;
}
