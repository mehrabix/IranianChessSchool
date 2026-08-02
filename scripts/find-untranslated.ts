import * as fs from 'node:fs';
import * as path from 'node:path';

const messagesDir = path.resolve('messages');
const enPath = path.join(messagesDir, 'en.json');
const locales = ['fa', 'ru', 'it', 'de', 'fr', 'no', 'es'];

function readJson(filePath: string): Record<string, unknown> {
  let raw = fs.readFileSync(filePath, 'utf-8');
  raw = raw.replace(/^\uFEFF/, '').replace(/\}\s*\\n\s*$/g, '}').trimEnd();
  return JSON.parse(raw);
}

function findEnglishStrings(obj: unknown, path = ''): string[] {
  if (typeof obj === 'string') {
    if (obj.length > 3 && /^[A-Za-z]/.test(obj) && obj.match(/[A-Za-z]/g) && (obj.match(/[A-Za-z]/g)?.length ?? 0) > 3) {
      if (!obj.startsWith('https://') && !obj.startsWith('http://') && !obj.includes('@') && path !== 'footer.email') {
        const engWords = obj.match(/\b[A-Z][a-z]{2,}\b/g);
        if (engWords && engWords.length >= 2) return [path + ': ' + obj.substring(0, 80)];
      }
    }
    return [];
  }
  if (Array.isArray(obj)) return [];
  if (obj && typeof obj === 'object') {
    const results: string[] = [];
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      results.push(...findEnglishStrings(v, path ? `${path}.${k}` : k));
    }
    return results;
  }
  return [];
}

const en = readJson(enPath);

for (const locale of locales) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  const results = findEnglishStrings(loc);
  if (results.length > 0) {
    console.log(`\n${locale}: ${results.length} untranslated sections`);
    results.forEach(r => console.log(`  ${r}`));
  } else {
    console.log(`${locale}: no English found`);
  }
}
