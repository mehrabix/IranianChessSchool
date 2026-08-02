import * as fs from 'node:fs';
import * as path from 'node:path';

const messagesDir = path.resolve('messages');
const locales = ['en', 'es', 'fa', 'ru', 'it', 'de', 'fr', 'no'];

function readJson(filePath: string): Record<string, unknown> {
  let raw = fs.readFileSync(filePath, 'utf-8');
  raw = raw.replace(/^\uFEFF/, '');
  raw = raw.replace(/\}\s*\\n\s*$/g, '}');
  raw = raw.trimEnd();
  return JSON.parse(raw);
}

const en = readJson(path.join(messagesDir, 'en.json'));

// Recursively collect all leaf key paths
function collectPaths(obj: Record<string, unknown>, prefix = ''): string[] {
  const paths: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      paths.push(...collectPaths(value as Record<string, unknown>, fullPath));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

const enPaths = new Set(collectPaths(en));
let totalErrors = 0;

console.log('Validating i18n translation files against en.json...\n');

for (const locale of locales) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const localeData = readJson(localePath);
  const localePaths = new Set(collectPaths(localeData));

  const missingInLocale = [...enPaths].filter(p => !localePaths.has(p));
  const extraInLocale = [...localePaths].filter(p => !enPaths.has(p));

  if (missingInLocale.length > 0) {
    console.log(`  ❌ ${locale}: MISSING ${missingInLocale.length} keys`);
    for (const key of missingInLocale.slice(0, 10)) {
      console.log(`     - ${key}`);
    }
    if (missingInLocale.length > 10) {
      console.log(`     ... and ${missingInLocale.length - 10} more`);
    }
    totalErrors += missingInLocale.length;
  } else {
    console.log(`  ✅ ${locale}: All keys match`);
  }

  if (extraInLocale.length > 0 && locale !== 'en') {
    console.log(`  ⚠\uFE0F  ${locale}: ${extraInLocale.length} extra keys (not in en)`);
    for (const key of extraInLocale.slice(0, 5)) {
      console.log(`     + ${key}`);
    }
  }
}

console.log(`\nTotal missing keys: ${totalErrors}`);

if (totalErrors > 0) {
  console.log('\n❌ Validation FAILED');
  process.exit(1);
} else {
  console.log('\n✅ All locales validated successfully!');
}
