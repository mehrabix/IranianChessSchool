import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { courses, modules, lessons } from './schema';
import { eq } from 'drizzle-orm';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const isValidUrl = tursoUrl && tursoUrl.startsWith('libsql://');
const client = createClient(isValidUrl ? { url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN } : { url: 'file:local.db' });

const db = drizzle(client);

// Fixed IDs for idempotent seeding
const BEGINNER_ID = 'course-beginner-001';
const MOD_BOARD_ID = 'mod-board-001';
const MOD_TACTICS_ID = 'mod-tactics-001';
const INTERMEDIATE_ID = 'course-intermediate-001';
const MOD_POSITIONAL_ID = 'mod-positional-001';

async function seed() {
  // Clear old English content first
  await db.delete(lessons).run();
  await db.delete(modules).run();
  await db.delete(courses).run();

  const beginnerCourse = await db.insert(courses).values({
    id: BEGINNER_ID,
    title: '_courses.chessFundamentals.title',
    description: '_courses.chessFundamentals.description',
    level: 'BEGINNER',
    image: '/images/chess-fundamentals.jpg',
    published: true,
  }).returning({ id: courses.id }).then(r => r[0]);

  await db.insert(modules).values([
    { id: MOD_BOARD_ID, title: '_courses.chessFundamentals.modules.board', order: 1, courseId: beginnerCourse.id },
    { id: MOD_TACTICS_ID, title: '_courses.chessFundamentals.modules.tactics', order: 2, courseId: beginnerCourse.id },
  ]);

  await db.insert(lessons).values([
    { id: 'lesson-intro-001', title: '_courses.chessFundamentals.lessons.intro', type: 'TEXT', order: 1, moduleId: MOD_BOARD_ID, courseId: BEGINNER_ID, duration: 10 },
    { id: 'lesson-moves-001', title: '_courses.chessFundamentals.lessons.pieceMoves', type: 'TEXT', order: 2, moduleId: MOD_BOARD_ID, courseId: BEGINNER_ID, duration: 15 },
    { id: 'lesson-checkmate-001', title: '_courses.chessFundamentals.lessons.checkmates', type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/example1', order: 3, moduleId: MOD_BOARD_ID, courseId: BEGINNER_ID, duration: 20 },
    { id: 'lesson-forks-001', title: '_courses.chessFundamentals.lessons.forks', type: 'TEXT', order: 1, moduleId: MOD_TACTICS_ID, courseId: BEGINNER_ID, duration: 12 },
    { id: 'lesson-pins-001', title: '_courses.chessFundamentals.lessons.pins', type: 'TEXT', order: 2, moduleId: MOD_TACTICS_ID, courseId: BEGINNER_ID, duration: 12 },
    { id: 'lesson-skewers-001', title: '_courses.chessFundamentals.lessons.skewers', type: 'TEXT', order: 3, moduleId: MOD_TACTICS_ID, courseId: BEGINNER_ID, duration: 10 },
  ]);

  const intermediateCourse = await db.insert(courses).values({
    id: INTERMEDIATE_ID,
    title: '_courses.intermediateStrategy.title',
    description: '_courses.intermediateStrategy.description',
    level: 'INTERMEDIATE',
    image: '/images/intermediate-strategy.jpg',
    published: true,
  }).returning({ id: courses.id }).then(r => r[0]);

  await db.insert(modules).values([
    { id: MOD_POSITIONAL_ID, title: '_courses.intermediateStrategy.modules.positional', order: 1, courseId: intermediateCourse.id },
  ]);

  await db.insert(lessons).values([
    { id: 'lesson-center-001', title: '_courses.intermediateStrategy.lessons.centerControl', type: 'TEXT', order: 1, moduleId: MOD_POSITIONAL_ID, courseId: INTERMEDIATE_ID, duration: 15 },
    { id: 'lesson-dev-001', title: '_courses.intermediateStrategy.lessons.development', type: 'TEXT', order: 2, moduleId: MOD_POSITIONAL_ID, courseId: INTERMEDIATE_ID, duration: 15 },
  ]);

  console.log('Seed completed — old content cleared, i18n-keyed courses inserted');
  console.log(`  Beginner: ${beginnerCourse.id} (6 lessons)`);
  console.log(`  Intermediate: ${intermediateCourse.id} (2 lessons)`);
}

seed().catch(console.error);
