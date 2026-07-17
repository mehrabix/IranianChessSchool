import { auth } from '@/lib/auth';
import { db, lessons, eq } from '@/lib/db';
import { notFound } from 'next/navigation';
import { LessonEditForm } from './lesson-edit-form';

export default async function AdminLessonEditPage(props: { params: Promise<{ id: string; lessonId: string }> }) {
  const { id: courseId, lessonId } = await props.params;
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-muted-foreground">Access denied.</p></div>;
  }

  const lesson = await db.select().from(lessons).where(eq(lessons.id, lessonId)).then(r => r[0]);
  if (!lesson) notFound();

  return <LessonEditForm lesson={lesson} courseId={courseId} />;
}
