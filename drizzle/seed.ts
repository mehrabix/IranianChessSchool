import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { courses, modules, lessons } from './schema';
import { randomUUID } from 'crypto';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const isValidUrl = tursoUrl && tursoUrl.startsWith('libsql://');
const client = createClient(isValidUrl ? { url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN } : { url: 'file:local.db' });

const db = drizzle(client);

async function seed() {
  const beginnerCourse = await db.insert(courses).values({
    id: randomUUID(),
    title: '_courses.chessFundamentals.title',
    description: '_courses.chessFundamentals.description',
    level: 'BEGINNER',
    image: '/images/chess-fundamentals.jpg',
    published: true,
  }).returning({ id: courses.id }).then(r => r[0]);

  const m1 = await db.insert(modules).values({
    id: randomUUID(),
    title: '_courses.chessFundamentals.modules.board',
    order: 1,
    courseId: beginnerCourse.id,
  }).returning({ id: modules.id }).then(r => r[0]);

  await db.insert(lessons).values([
    { id: randomUUID(), title: '_courses.chessFundamentals.lessons.intro', order: 1, moduleId: m1.id, courseId: beginnerCourse.id, duration: 10 },
    { id: randomUUID(), title: '_courses.chessFundamentals.lessons.pieceMoves', order: 2, moduleId: m1.id, courseId: beginnerCourse.id, duration: 15 },
    { id: randomUUID(), title: '_courses.chessFundamentals.lessons.checkmates', type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/example1', order: 3, moduleId: m1.id, courseId: beginnerCourse.id, duration: 20 },
  ]);

  const m2 = await db.insert(modules).values({
    id: randomUUID(),
    title: '_courses.chessFundamentals.modules.tactics',
    order: 2,
    courseId: beginnerCourse.id,
  }).returning({ id: modules.id }).then(r => r[0]);

  await db.insert(lessons).values([
    { id: randomUUID(), title: '_courses.chessFundamentals.lessons.forks', order: 1, moduleId: m2.id, courseId: beginnerCourse.id, duration: 12 },
    { id: randomUUID(), title: '_courses.chessFundamentals.lessons.pins', order: 2, moduleId: m2.id, courseId: beginnerCourse.id, duration: 12 },
    { id: randomUUID(), title: '_courses.chessFundamentals.lessons.skewers', order: 3, moduleId: m2.id, courseId: beginnerCourse.id, duration: 10 },
  ]);

  const intermediateCourse = await db.insert(courses).values({
    id: randomUUID(),
    title: '_courses.intermediateStrategy.title',
    description: '_courses.intermediateStrategy.description',
    level: 'INTERMEDIATE',
    image: '/images/intermediate-strategy.jpg',
    published: true,
  }).returning({ id: courses.id }).then(r => r[0]);

  const m3 = await db.insert(modules).values({
    id: randomUUID(),
    title: '_courses.intermediateStrategy.modules.positional',
    order: 1,
    courseId: intermediateCourse.id,
  }).returning({ id: modules.id }).then(r => r[0]);

  await db.insert(lessons).values([
    { id: randomUUID(), title: '_courses.intermediateStrategy.lessons.centerControl', order: 1, moduleId: m3.id, courseId: intermediateCourse.id, duration: 15 },
    { id: randomUUID(), title: '_courses.intermediateStrategy.lessons.development', order: 2, moduleId: m3.id, courseId: intermediateCourse.id, duration: 15 },
  ]);

  console.log('Seed data created successfully!');
  console.log(`Course: Chess Fundamentals (${beginnerCourse.id})`);
  console.log(`Course: Intermediate Strategy (${intermediateCourse.id})`);
}

seed().catch(console.error);
