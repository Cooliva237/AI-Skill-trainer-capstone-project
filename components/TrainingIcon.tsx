export type TrainingIconName = "path" | "home" | "practice" | "award" | "star" | "book";
export function TrainingIcon({ name }: { name: TrainingIconName }) {
  const paths: Record<TrainingIconName, string> = {
    home: "M3 11 12 3l9 8M5 10v11h5v-7h4v7h5V10",
    path: "M6 4h10a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h10M6 2v4m12 12v4",
    practice: "M6 5v14M3 8v8m3-4h12m0-7v14m3-11v8",
    award: "m8 14-2 8 6-3 6 3-2-8M18 8a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
    star: "m12 3 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z",
    book: "M12 5v16M3 3l9 2 9-2v16l-9 2-9-2Z",
  };
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
