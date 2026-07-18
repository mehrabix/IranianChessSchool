import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { courses, modules, lessons } from './schema';
import { randomUUID } from 'crypto';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

async function seed() {
  const beginnerCourse = await db.insert(courses).values({
    id: randomUUID(),
    title: 'Chess Fundamentals',
    description: 'Learn the basic rules, piece movement, and fundamental concepts of chess. Perfect for absolute beginners.',
    level: 'BEGINNER',
    image: '/images/chess-fundamentals.jpg',
    published: true,
  }).returning({ id: courses.id }).then(r => r[0]);

  const m1 = await db.insert(modules).values({
    id: randomUUID(),
    title: 'The Board & Pieces',
    order: 1,
    courseId: beginnerCourse.id,
  }).returning({ id: modules.id }).then(r => r[0]);

  await db.insert(lessons).values([
    { id: randomUUID(), title: 'Introduction to the Chessboard', content: '<p>The chessboard consists of 64 squares arranged in an 8x8 grid. Each square is identified by a coordinate system: files (a-h) for columns and ranks (1-8) for rows.</p><p>White pieces start on ranks 1-2, black pieces on ranks 7-8.</p>', type: 'TEXT', order: 1, moduleId: m1.id, courseId: beginnerCourse.id, duration: 10 },
    { id: randomUUID(), title: 'How Pieces Move', content: '<p><strong>Pawn:</strong> Moves forward one square, captures diagonally. On its first move, it can move two squares.</p><p><strong>Knight:</strong> Moves in an L-shape: two squares in one direction, then one perpendicular.</p><p><strong>Bishop:</strong> Moves diagonally any number of squares.</p><p><strong>Rook:</strong> Moves horizontally or vertically any number of squares.</p><p><strong>Queen:</strong> Combines bishop and rook movement.</p><p><strong>King:</strong> Moves one square in any direction.</p>', type: 'TEXT', order: 2, moduleId: m1.id, courseId: beginnerCourse.id, duration: 15 },
    { id: randomUUID(), title: 'Basic Checkmates', content: '<p>Checkmate occurs when the king is in check and has no legal moves to escape.</p><p><strong>King and Queen vs King:</strong> The easiest checkmate. Use your queen with the king\'s help.</p><p><strong>King and Rook vs King:</strong> Force the king to the edge of the board.</p>', type: 'VIDEO', videoUrl: 'https://www.youtube.com/embed/example1', order: 3, moduleId: m1.id, courseId: beginnerCourse.id, duration: 20 },
  ]);

  const m2 = await db.insert(modules).values({
    id: randomUUID(),
    title: 'Basic Tactics',
    order: 2,
    courseId: beginnerCourse.id,
  }).returning({ id: modules.id }).then(r => r[0]);

  await db.insert(lessons).values([
    { id: randomUUID(), title: 'Forks', content: '<p>A fork is a tactic where one piece attacks two or more enemy pieces simultaneously. Knights are particularly good at forking because of their unique movement.</p>', type: 'TEXT', order: 1, moduleId: m2.id, courseId: beginnerCourse.id, duration: 12 },
    { id: randomUUID(), title: 'Pins', content: '<p>A pin occurs when a piece cannot move without exposing a more valuable piece behind it. Pins along files, ranks, and diagonals are common.</p>', type: 'TEXT', order: 2, moduleId: m2.id, courseId: beginnerCourse.id, duration: 12 },
    { id: randomUUID(), title: 'Skewers', content: '<p>A skewer is like a pin in reverse: the more valuable piece is in front, and when it moves, the piece behind is captured.</p>', type: 'TEXT', order: 3, moduleId: m2.id, courseId: beginnerCourse.id, duration: 10 },
  ]);

  const intermediateCourse = await db.insert(courses).values({
    id: randomUUID(),
    title: 'Intermediate Strategy',
    description: 'Deepen your understanding of positional chess, pawn structures, and strategic concepts.',
    level: 'INTERMEDIATE',
    image: '/images/intermediate-strategy.jpg',
    published: true,
  }).returning({ id: courses.id }).then(r => r[0]);

  const m3 = await db.insert(modules).values({
    id: randomUUID(),
    title: 'Positional Fundamentals',
    order: 1,
    courseId: intermediateCourse.id,
  }).returning({ id: modules.id }).then(r => r[0]);

  await db.insert(lessons).values([
    { id: randomUUID(), title: 'Center Control', content: '<p>Controlling the center of the board is one of the most important strategic concepts. From the center, your pieces have maximum mobility.</p>', type: 'TEXT', order: 1, moduleId: m3.id, courseId: intermediateCourse.id, duration: 15 },
    { id: randomUUID(), title: 'Piece Development', content: '<p>In the opening, develop your pieces to active squares. Knights before bishops, and avoid moving the same piece twice.</p>', type: 'TEXT', order: 2, moduleId: m3.id, courseId: intermediateCourse.id, duration: 15 },
  ]);

  console.log('Seed data created successfully!');
  console.log(`Course: Chess Fundamentals (${beginnerCourse.id})`);
  console.log(`Course: Intermediate Strategy (${intermediateCourse.id})`);
}

seed().catch(console.error);
