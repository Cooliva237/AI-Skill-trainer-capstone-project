import { LessonView } from "@/components/LessonView";
import { gymLessons } from "@/data/gymLessons";
import { getLessonById } from "@/lib/lessons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export function generateStaticParams() {
  return gymLessons.map((lesson) => ({ id: lesson.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const lesson = getLessonById(id);
  return { title: lesson?.title ?? "Lesson" };
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="px-5 py-16 text-sm text-muted">Loading lesson...</p>}>
      <LessonRoute params={params} />
    </Suspense>
  );
}

async function LessonRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();
  return <LessonView lessonId={lesson.id} />;
}
