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

const en = readJson(enPath);

// Recursively sync missing keys from en into locale
function syncKeys(enObj: Record<string, unknown>, locObj: Record<string, unknown>): number {
  let added = 0;
  for (const [key, value] of Object.entries(enObj)) {
    if (!(key in locObj)) {
      locObj[key] = value;
      added++;
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value) &&
               typeof locObj[key] === 'object' && locObj[key] !== null && !Array.isArray(locObj[key])) {
      added += syncKeys(value as Record<string, unknown>, locObj[key] as Record<string, unknown>);
    }
  }
  return added;
}

for (const locale of locales) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  const added = syncKeys(en, loc as Record<string, unknown>);
  if (added > 0) {
    fs.writeFileSync(localePath, JSON.stringify(loc, null, 2) + '\n');
    console.log(`${locale}: added ${added} missing keys`);
  } else {
    console.log(`${locale}: no missing keys`);
  }
}
