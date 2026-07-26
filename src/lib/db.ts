import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '../../drizzle/schema';

type Schema = typeof schema;
type DB = LibSQLDatabase<Schema>;

let _dbInstance: DB | null = null;

function getDb(): DB {
  if (!_dbInstance) {
    _dbInstance = drizzle(createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    }), { schema });
  }
  return _dbInstance;
}

function createProxy<T extends object>(): T {
  return new Proxy({} as T, {
    get(_, prop) {
      const real = getDb() as any;
      const val = real[prop];
      if (typeof val === 'function') {
        return val.bind(real);
      }
      return val;
    },
  }) as T;
}

export const db = createProxy<DB>();

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

export const {
  users, accounts, sessions, verificationTokens, courses, modules, lessons, puzzles,
  progress, subscriptions, posts, achievements, bookings, quizzes, quizQuestions,
  quizAttempts, quizAnswers, comments, likes, follows,
} = schema;
