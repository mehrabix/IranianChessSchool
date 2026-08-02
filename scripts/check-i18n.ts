// Line-by-line check for untranslated English strings in all locale files
import * as fs from 'node:fs';
import * as path from 'node:path';

const messagesDir = path.resolve('messages');
const locales = ['fa', 'ru', 'it', 'de', 'fr', 'no', 'es'];

function readJson(filePath: string): Record<string, unknown> {
  let raw = fs.readFileSync(filePath, 'utf-8');
  raw = raw.replace(/^\uFEFF/, '').replace(/\}\s*\\n\s*$/g, '}').trimEnd();
  return JSON.parse(raw);
}

// Read en.json for reference
const en = readJson(path.join(messagesDir, 'en.json'));

function getValue(obj: Record<string, unknown>, keyPath: string): string {
  const parts = keyPath.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== 'object') return '';
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : '';
}

function isEnglishLike(val: string): boolean {
  if (val.length < 4) return false;
  if (val.match(/^[A-Za-z]/) && val.match(/\b[A-Z][a-z]{2,}\b/g) && (val.match(/\b[A-Z][a-z]{2,}\b/g)?.length ?? 0) >= 2) {
    if (val.includes('http') || val.includes('@') || val.includes('Chess.com') || val.includes('Lichess') || val.startsWith('libsql:')) return false;
    return true;
  }
  return false;
}

function collectStrings(obj: unknown, prefix = ''): [string, string][] {
  if (typeof obj === 'string') {
    return [[prefix, obj]];
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [];
  const results: [string, string][] = [];
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    results.push(...collectStrings(v, prefix ? `${prefix}.${k}` : k));
  }
  return results;
}

const enStrings = collectStrings(en);
const enMap = new Map(enStrings);

for (const locale of locales) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  const locStrings = collectStrings(loc);
  const locMap = new Map(locStrings);

  console.log(`\n=== ${locale} ===`);
  let count = 0;
  for (const [key, locVal] of locStrings) {
    const enVal = enMap.get(key);
    if (enVal && locVal === enVal && isEnglishLike(locVal)) {
      const enPart = locVal.substring(0, 60).replace(/\n/g, ' ');
      console.log(`  ${key}: "${enPart}"`);
      count++;
    }
  }
  if (count === 0) console.log('  ✅ No untranslated strings');
  else console.log(`  Total: ${count} untranslated`);
}
