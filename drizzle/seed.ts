import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { courses, modules, lessons } from './schema';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const isValidUrl = tursoUrl && tursoUrl.startsWith('libsql://');
const client = createClient(isValidUrl ? { url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN } : { url: 'file:local.db' });

const db = drizzle(client);

const BEGINNER_ID = 'course-beginner-001';
const MOD_BOARD_ID = 'mod-board-001';
const MOD_TACTICS_ID = 'mod-tactics-001';
const INTERMEDIATE_ID = 'course-intermediate-001';
const MOD_POSITIONAL_ID = 'mod-positional-001';

async function seed() {
  await client.execute('DELETE FROM lessons');
  await client.execute('DELETE FROM modules');
  await client.execute('DELETE FROM courses');

  await db.insert(courses).values({
    id: BEGINNER_ID,
    title: 'coursesContent::chessFundamentals::title',
    description: 'coursesContent::chessFundamentals::description',
    level: 'BEGINNER', image: '/images/chess-fundamentals.jpg', published: true,
  });

  await db.insert(modules).values([
    { id: MOD_BOARD_ID, title: 'coursesContent::chessFundamentals::modules::board', order: 1, courseId: BEGINNER_ID },
    { id: MOD_TACTICS_ID, title: 'coursesContent::chessFundamentals::modules::tactics', order: 2, courseId: BEGINNER_ID },
  ]);

  await db.insert(lessons).values([
    { id: 'lesson-intro-001', title: 'coursesContent::chessFundamentals::lessons::intro', type: 'TEXT', order: 1, moduleId: MOD_BOARD_ID, courseId: BEGINNER_ID, duration: 10 },
    { id: 'lesson-moves-001', title: 'coursesContent::chessFundamentals::lessons::pieceMoves', type: 'TEXT', order: 2, moduleId: MOD_BOARD_ID, courseId: BEGINNER_ID, duration: 15 },
    { id: 'lesson-checkmate-001', title: 'coursesContent::chessFundamentals::lessons::checkmates', type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/example1', order: 3, moduleId: MOD_BOARD_ID, courseId: BEGINNER_ID, duration: 20 },
    { id: 'lesson-forks-001', title: 'coursesContent::chessFundamentals::lessons::forks', type: 'TEXT', order: 1, moduleId: MOD_TACTICS_ID, courseId: BEGINNER_ID, duration: 12 },
    { id: 'lesson-pins-001', title: 'coursesContent::chessFundamentals::lessons::pins', type: 'TEXT', order: 2, moduleId: MOD_TACTICS_ID, courseId: BEGINNER_ID, duration: 12 },
    { id: 'lesson-skewers-001', title: 'coursesContent::chessFundamentals::lessons::skewers', type: 'TEXT', order: 3, moduleId: MOD_TACTICS_ID, courseId: BEGINNER_ID, duration: 10 },
  ]);

  await db.insert(courses).values({
    id: INTERMEDIATE_ID,
    title: 'coursesContent::intermediateStrategy::title',
    description: 'coursesContent::intermediateStrategy::description',
    level: 'INTERMEDIATE', image: '/images/intermediate-strategy.jpg', published: true,
  });

  await db.insert(modules).values([
    { id: MOD_POSITIONAL_ID, title: 'coursesContent::intermediateStrategy::modules::positional', order: 1, courseId: INTERMEDIATE_ID },
  ]);

  await db.insert(lessons).values([
    { id: 'lesson-center-001', title: 'coursesContent::intermediateStrategy::lessons::centerControl', type: 'TEXT', order: 1, moduleId: MOD_POSITIONAL_ID, courseId: INTERMEDIATE_ID, duration: 15 },
    { id: 'lesson-dev-001', title: 'coursesContent::intermediateStrategy::lessons::development', type: 'TEXT', order: 2, moduleId: MOD_POSITIONAL_ID, courseId: INTERMEDIATE_ID, duration: 15 },
  ]);

  console.log('Seed completed — all English data cleared, courses inserted with i18n keys');
}
seed().catch(console.error);
