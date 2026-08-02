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
const enDashboard = en.dashboard as Record<string, unknown>;

for (const locale of locales) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  const locDashboard = loc.dashboard as Record<string, unknown>;

  if (!locDashboard) {
    console.log(`${locale}: missing dashboard entirely, skipping`);
    continue;
  }

  let added = 0;
  for (const [key, value] of Object.entries(enDashboard)) {
    if (!(key in locDashboard)) {
      locDashboard[key] = typeof value === 'string' && value.includes('{')
        ? value // Keep interpolation patterns
        : value;
      added++;
    }
  }

  if (added > 0) {
    fs.writeFileSync(localePath, JSON.stringify(loc, null, 2) + '\n');
    console.log(`${locale}: added ${added} missing keys`);
  } else {
    console.log(`${locale}: no missing keys`);
  }
}

// Also sync footer.social
for (const locale of locales) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  const locFooter = loc.footer as Record<string, unknown>;
  const enFooter = en.footer as Record<string, unknown>;

  if (locFooter && typeof locFooter.social !== 'object') {
    locFooter.social = enFooter.social;
    fs.writeFileSync(localePath, JSON.stringify(loc, null, 2) + '\n');
    console.log(`${locale}: fixed footer.social`);
  }
}
