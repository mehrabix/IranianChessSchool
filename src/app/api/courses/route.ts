import { NextResponse } from 'next/server';
import { db, courses, modules, lessons, eq, asc } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const level = searchParams.get('level');

  if (id) {
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.id, id))
      .then(r => r[0]);

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const mods = await db
      .select()
      .from(modules)
      .where(eq(modules.courseId, id))
      .orderBy(asc(modules.order));

    const modsWithLessons = await Promise.all(
      mods.map(async (m) => {
        const ls = await db
          .select()
          .from(lessons)
          .where(eq(lessons.moduleId, m.id))
          .orderBy(asc(lessons.order));
        return { ...m, lessons: ls };
      })
    );

    return NextResponse.json({ course: { ...course, modules: modsWithLessons } });
  }

  const all = await db
    .select()
    .from(courses)
    .where(eq(courses.published, true))
    .orderBy(asc(courses.createdAt));

  return NextResponse.json({ courses: all });
}
