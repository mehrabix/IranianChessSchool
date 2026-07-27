import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const isValidUrl = tursoUrl && tursoUrl.startsWith('libsql://');

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'turso',
  dbCredentials: isValidUrl
    ? { url: tursoUrl, authToken: process.env.TURSO_AUTH_TOKEN }
    : { url: 'file:local.db' },
});