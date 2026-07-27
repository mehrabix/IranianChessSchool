import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../../drizzle/schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

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

export const { users, accounts, sessions, verificationTokens, courses, modules, lessons, puzzles, progress, subscriptions, posts, achievements, bookings, quizzes, quizQuestions, quizAttempts, quizAnswers, comments, likes, follows, groups, groupMembers, tournaments, tournamentPlayers, notifications } = schema;
