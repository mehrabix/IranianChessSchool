import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../../drizzle/schema';

const tursoUrl = process.env.TURSO_DATABASE_URL;
const isValidUrl = tursoUrl && tursoUrl.startsWith('libsql://');

const client = createClient(
  isValidUrl
    ? { url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN }
    : { url: 'file:local.db' }
);

export const db = drizzle(client, { schema });

export {
  eq,
  and,
  or,
  desc,
  asc,
  sql,
  like,
  inArray,
  between,
  not,
  isNull,
  isNotNull,
} from 'drizzle-orm';

export const { users, accounts, sessions, verificationTokens, courses, modules, lessons, puzzles, progress, subscriptions, posts, achievements, bookings, quizzes, quizQuestions, quizAttempts, quizAnswers, comments, likes, follows, groups, groupMembers, tournaments, tournamentPlayers, notifications, pendingPayments, homeworks, challenges, challengeProgress } = schema;
