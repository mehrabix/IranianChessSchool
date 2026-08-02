
// Script to translate critical English strings still present in non-EN locales
// after sync-i18n.ts copied them from en.json without translation

import * as fs from 'node:fs';
import * as path from 'node:path';

const messagesDir = path.resolve('messages');
const locales = ['fa', 'ru', 'it', 'de', 'fr', 'no', 'es'];

// Critical translations that must exist in every locale
const translations: Record<string, Record<string, string>> = {
  fa: {
    'footer.brand': 'مدرسه شطرنج ایران',
    'dashboard.submitHomework': 'ارسال تکلیف',
    'dashboard.challenges': 'چالش‌های هفتگی',
    'admin.makeAdmin': 'مدیر کردن',
    'pricing.faq.heading': 'سوالات متداول',
    'pricing.faq.pricingA1': 'همه طرح‌ها شامل ۷ روز آزمایشی رایگان هستند. بدون نیاز به کارت اعتباری. هر زمان در طول دوره آزمایشی لغو کنید.',
    'pricing.faq.pricingA2': 'بله! می‌توانید هر زمان ارتقا یا تنزل دهید. در ارتقا مابه‌التفاوت محاسبه می‌شود. تنزل در پایان دوره اعمال می‌شود.',
    'pricing.faq.pricingA3': 'تمام کارت‌های اعتباری اصلی از طریق Stripe و درگاه‌های ایرانی (زرین‌پال، زیبال، نکست‌پی، آیدی‌پی، پی‌پینگ).',
    'coursesContent.chessFundamentals.title': 'مبانی شطرنج',
    'coursesContent.chessFundamentals.description': 'یادگیری قوانین پایه، حرکات مهره‌ها و مفاهیم اساسی شطرنج. مناسب برای مبتدیان کامل.',
    'coursesContent.chessFundamentals.modules.board': 'صفحه و مهره‌ها',
    'coursesContent.chessFundamentals.modules.tactics': 'تاکتیک‌های پایه',
    'coursesContent.chessFundamentals.lessons.intro': 'معرفی صفحه شطرنج',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'حرکات مهره‌ها',
    'coursesContent.chessFundamentals.lessons.checkmates': 'کیش و مات‌های پایه',
    'coursesContent.chessFundamentals.lessons.forks': 'چنگال',
    'coursesContent.chessFundamentals.lessons.pins': 'آچمز',
    'coursesContent.chessFundamentals.lessons.skewers': 'سیخ',
    'coursesContent.intermediateStrategy.title': 'استراتژی متوسط',
    'coursesContent.intermediateStrategy.description': 'درک خود را از شطرنج موقعیتی، ساختارهای پیاده و مفاهیم استراتژیک عمیق‌تر کنید.',
    'coursesContent.intermediateStrategy.modules.positional': 'اصول موقعیتی',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'کنترل مرکز',
    'coursesContent.intermediateStrategy.lessons.development': 'گسترش مهره‌ها',
  },
  ru: {
    'footer.brand': 'Шахматная школа Ирана',
    'dashboard.submitHomework': 'Отправить задание',
    'dashboard.challenges': 'Еженедельные задания',
    'admin.makeAdmin': 'Сделать админом',
    'pricing.faq.heading': 'Часто задаваемые вопросы',
    'pricing.faq.pricingA1': 'Все планы включают 7-дневную бесплатную пробную версию. Кредитная карта не требуется. Отмените в любое время в течение пробного периода.',
    'pricing.faq.pricingA2': 'Да! Вы можете обновить или понизить тариф в любое время. При обновлении взимается пропорциональная разница. Понижение вступает в силу в конце расчетного периода.',
    'pricing.faq.pricingA3': 'Мы принимаем все основные кредитные карты через Stripe и иранские платежные шлюзы (Zarinpal, Zibal, NextPay, IDPay, PayPing).',
    'coursesContent.chessFundamentals.title': 'Основы шахмат',
    'coursesContent.chessFundamentals.description': 'Изучите основные правила, движения фигур и фундаментальные концепции шахмат. Идеально для начинающих.',
    'coursesContent.chessFundamentals.modules.board': 'Доска и фигуры',
    'coursesContent.chessFundamentals.modules.tactics': 'Основы тактики',
    'coursesContent.chessFundamentals.lessons.intro': 'Знакомство с шахматной доской',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'Как ходят фигуры',
    'coursesContent.chessFundamentals.lessons.checkmates': 'Основные маты',
    'coursesContent.chessFundamentals.lessons.forks': 'Вилки',
    'coursesContent.chessFundamentals.lessons.pins': 'Связки',
    'coursesContent.chessFundamentals.lessons.skewers': 'Сквозные удары',
    'coursesContent.intermediateStrategy.title': 'Средняя стратегия',
    'coursesContent.intermediateStrategy.description': 'Углубите понимание позиционной игры, пешечных структур и стратегических концепций.',
    'coursesContent.intermediateStrategy.modules.positional': 'Основы позиционной игры',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'Контроль центра',
    'coursesContent.intermediateStrategy.lessons.development': 'Развитие фигур',
  },
};

function readJson(filePath: string): Record<string, unknown> {
  let raw = fs.readFileSync(filePath, 'utf-8');
  raw = raw.replace(/^\uFEFF/, '').replace(/\}\s*\\n\s*$/g, '}').trimEnd();
  return JSON.parse(raw);
}

function setDeep(obj: Record<string, unknown>, path: string, value: string) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
      current[keys[i]] = {};
    }
    current = current[keys[i]] as Record<string, unknown>;
  }
  current[keys[keys.length - 1]] = value;
}

for (const [locale, trans] of Object.entries(translations)) {
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  let changed = 0;
  for (const [key, value] of Object.entries(trans)) {
    setDeep(loc as Record<string, unknown>, key, value);
    changed++;
  }
  if (changed > 0) {
    fs.writeFileSync(localePath, JSON.stringify(loc, null, 2) + '\n');
    console.log(`${locale}: ${changed} keys translated`);
  }
}
console.log('\nDone!');
