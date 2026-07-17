import { NextResponse } from 'next/server';
import { db, lessons, modules, courses, eq, asc, and } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const moduleId = searchParams.get('moduleId');
  const courseId = searchParams.get('courseId');

  if (id) {
    const lesson = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, id))
      .then(r => r[0]);

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const mod = lesson.moduleId ? await db
      .select()
      .from(modules)
      .where(eq(modules.id, lesson.moduleId))
      .then(r => r[0]) : null;

    const course = lesson.courseId ? await db
      .select()
      .from(courses)
      .where(eq(courses.id, lesson.courseId))
      .then(r => r[0]) : null;

    const allLessons = lesson.moduleId ? await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, lesson.moduleId))
      .orderBy(asc(lessons.order)) : [];

    const currentIdx = allLessons.findIndex(l => l.id === id);
    const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

    return NextResponse.json({
      lesson,
      module: mod,
      course,
      prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.title } : null,
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.title } : null,
    });
  }

  if (moduleId) {
    const all = await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(asc(lessons.order));
    return NextResponse.json({ lessons: all });
  }

  if (courseId) {
    const mods = await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, courseId))
      .orderBy(asc(modules.order));

    const result = await Promise.all(
      mods.map(async (m) => {
        const ls = await db
          .select()
          .from(lessons)
          .where(eq(lessons.moduleId, m.id))
          .orderBy(asc(lessons.order));
        return { module: m, lessons: ls };
      })
    );

    return NextResponse.json({ modules: result });
  }

  return NextResponse.json({ error: 'id, moduleId, or courseId is required' }, { status: 400 });
}
