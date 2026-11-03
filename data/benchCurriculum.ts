// Canonical UI lesson IDs are the final legacy topic in each group.
// Storage still uses all twelve original topic IDs, so existing Firestore rules
// and old accounts remain compatible without a destructive migration.
export const benchGroups = [
  { id: 'bench-02', topics: ['bench-01', 'bench-02'] },
  { id: 'bench-04', topics: ['bench-03', 'bench-04'] },
  { id: 'bench-05', topics: ['bench-05'] },
  { id: 'bench-06', topics: ['bench-06'] },
  { id: 'bench-07', topics: ['bench-07'] },
  { id: 'bench-08', topics: ['bench-08'] },
  { id: 'bench-10', topics: ['bench-09', 'bench-10'] },
  { id: 'bench-12', topics: ['bench-11', 'bench-12'] },
];
const knownTopics = new Set(benchGroups.flatMap(group => group.topics));

export function foldBenchTopics(ids: string[]): string[] {
  const completed = new Set(ids);
  return benchGroups.filter(group => group.topics.every(id => completed.has(id))).map(group => group.id);
}

export function expandBenchLessons(ids: string[], previousTopics: string[] = []): string[] {
  const completed = new Set(ids);
  const topics = new Set(previousTopics.filter(id => knownTopics.has(id)));
  for (const group of benchGroups) if (completed.has(group.id)) for (const id of group.topics) topics.add(id);
  return [...topics].sort();
}

export function canonicalBenchId(id: string): string {
  return benchGroups.find(group => group.topics.includes(id))?.id ?? id;
}
