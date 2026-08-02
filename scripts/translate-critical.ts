import * as fs from 'node:fs';
import * as path from 'node:path';

const messagesDir = path.resolve('messages');

const translations: Record<string, Record<string, string>> = {
  fa: {},
  ru: {},
  it: {
    'nav.brand': 'ICS',
    'footer.brand': 'Iranian Chess School',
    'footer.brand_short': 'ICS',
    'pricing.faq.heading': 'Domande Frequenti',
    'pricing.faq.pricingA1': 'Tutti i piani includono una prova gratuita di 7 giorni. Nessuna carta di credito richiesta. Annulla in qualsiasi momento durante il periodo di prova.',
    'pricing.faq.pricingA2': 'Sì! Puoi passare a un piano superiore o inferiore in qualsiasi momento. Per gli upgrade viene addebitata la differenza proporzionale. I downgrade hanno effetto alla fine del periodo di fatturazione.',
    'pricing.faq.pricingA3': 'Accettiamo tutte le principali carte di credito tramite Stripe e gateway di pagamento iraniani (Zarinpal, Zibal, NextPay, IDPay, PayPing).',
    'dashboard.puzzleRush': 'Sfida Lampo',
    'dashboard.submitHomework': 'Consegna Compito',
    'dashboard.challenges': 'Sfide Settimanali',
    'admin.makeAdmin': 'Rendi Admin',
    'puzzles.puzzleRush': 'Sfida Lampo',
    'coursesContent.chessFundamentals.title': 'Fondamenti di Scacchi',
    'coursesContent.chessFundamentals.description': 'Impara le regole di base, il movimento dei pezzi e i concetti fondamentali. Perfetto per principianti assoluti.',
    'coursesContent.chessFundamentals.modules.board': 'La Scacchiera e i Pezzi',
    'coursesContent.chessFundamentals.modules.tactics': 'Tattiche di Base',
    'coursesContent.chessFundamentals.lessons.intro': 'Introduzione alla Scacchiera',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'Come si Muovono i Pezzi',
    'coursesContent.chessFundamentals.lessons.checkmates': 'Scacchi Matti Fondamentali',
    'coursesContent.intermediateStrategy.title': 'Strategia Intermedia',
    'coursesContent.intermediateStrategy.modules.positional': 'Fondamenti Posizionali',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'Controllo del Centro',
    'coursesContent.intermediateStrategy.lessons.development': 'Sviluppo dei Pezzi',
  },
  de: {
    'nav.brand': 'ICS',
    'footer.brand': 'Iranian Chess School',
    'footer.brand_short': 'ICS',
    'pricing.faq.heading': 'Häufig gestellte Fragen',
    'pricing.faq.pricingA1': 'Alle Pläne beinhalten eine 7-tägige kostenlose Testversion. Keine Kreditkarte erforderlich. Jederzeit während der Testphase kündbar.',
    'pricing.faq.pricingA2': 'Ja! Du kannst jederzeit upgraden oder downgraden. Bei Upgrades wird die anteilige Differenz berechnet. Downgrades werden am Ende der Abrechnungsperiode wirksam.',
    'pricing.faq.pricingA3': 'Wir akzeptieren alle gängigen Kreditkarten über Stripe und iranische Zahlungsgateways (Zarinpal, Zibal, NextPay, IDPay, PayPing).',
    'dashboard.importExport': 'Import / Export',
    'dashboard.feedAndCommunity': 'Feed & Community',
    'dashboard.submitHomework': 'Aufgabe abgeben',
    'dashboard.challenges': 'Wöchentliche Herausforderungen',
    'admin.makeAdmin': 'Zum Admin machen',
    'coursesContent.chessFundamentals.title': 'Schach-Grundlagen',
    'coursesContent.chessFundamentals.description': 'Lerne die Grundregeln, Figurenbewegungen und grundlegende Konzepte. Perfekt für absolute Anfänger.',
    'coursesContent.chessFundamentals.modules.board': 'Das Brett und die Figuren',
    'coursesContent.chessFundamentals.modules.tactics': 'Grundlegende Taktiken',
    'coursesContent.chessFundamentals.lessons.intro': 'Einführung in das Schachbrett',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'Wie sich die Figuren bewegen',
    'coursesContent.chessFundamentals.lessons.checkmates': 'Grundlegende Schachmatts',
    'coursesContent.intermediateStrategy.title': 'Mittelstufen-Strategie',
    'coursesContent.intermediateStrategy.modules.positional': 'Positionsgrundlagen',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'Zentrumskontrolle',
    'coursesContent.intermediateStrategy.lessons.development': 'Figurenentwicklung',
  },
  fr: {
    'nav.brand': 'ICS',
    'footer.brand': 'Iranian Chess School',
    'footer.brand_short': 'ICS',
    'pricing.faq.heading': 'Questions Fréquentes',
    'pricing.faq.pricingA1': 'Tous les forfaits incluent un essai gratuit de 7 jours. Aucune carte de crédit requise. Annulez à tout moment pendant la période d\'essai.',
    'pricing.faq.pricingA2': 'Oui ! Vous pouvez passer à un forfait supérieur ou inférieur à tout moment. Pour les mises à niveau, la différence au prorata est facturée. Les rétrogradations prennent effet à la fin de la période de facturation.',
    'pricing.faq.pricingA3': 'Nous acceptons toutes les principales cartes de crédit via Stripe et les passerelles de paiement iraniennes (Zarinpal, Zibal, NextPay, IDPay, PayPing).',
    'dashboard.puzzleRush': 'Défi Éclair',
    'dashboard.submitHomework': 'Rendre le Devoir',
    'dashboard.challenges': 'Défis Hebdomadaires',
    'admin.makeAdmin': 'Nommer Admin',
    'puzzles.puzzleRush': 'Défi Éclair',
    'coursesContent.chessFundamentals.title': 'Fondamentaux des Échecs',
    'coursesContent.chessFundamentals.description': 'Apprenez les règles de base, le mouvement des pièces et les concepts fondamentaux. Parfait pour les débutants.',
    'coursesContent.chessFundamentals.modules.board': 'L\'Échiquier et les Pièces',
    'coursesContent.chessFundamentals.modules.tactics': 'Tactiques de Base',
    'coursesContent.chessFundamentals.lessons.intro': 'Introduction à l\'Échiquier',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'Comment se Déplacent les Pièces',
    'coursesContent.chessFundamentals.lessons.checkmates': 'Les Mats Fondamentaux',
    'coursesContent.intermediateStrategy.title': 'Stratégie Intermédiaire',
    'coursesContent.intermediateStrategy.modules.positional': 'Fondamentaux Positionnels',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'Contrôle du Centre',
    'coursesContent.intermediateStrategy.lessons.development': 'Développement des Pièces',
  },
  no: {
    'nav.brand': 'ICS',
    'footer.brand': 'Iranian Chess School',
    'footer.brand_short': 'ICS',
    'pricing.faq.heading': 'Ofte Stilte Spørsmål',
    'pricing.faq.pricingA1': 'Alle planer inkluderer en 7-dagers gratis prøveperiode. Ingen kredittkort kreves. Avbryt når som helst i prøveperioden.',
    'pricing.faq.pricingA2': 'Ja! Du kan oppgradere eller nedgradere når som helst. Ved oppgradering belastes prorata differanse. Nedgradering trer i kraft ved slutten av faktureringsperioden.',
    'pricing.faq.pricingA3': 'Vi aksepterer alle større kredittkort via Stripe og iranske betalingsgatewayer (Zarinpal, Zibal, NextPay, IDPay, PayPing).',
    'dashboard.puzzleRush': 'Puslespillrush',
    'dashboard.submitHomework': 'Lever Oppgave',
    'dashboard.challenges': 'Ukentlige Utfordringer',
    'admin.makeAdmin': 'Gjør til Admin',
    'puzzles.puzzleRush': 'Puslespillrush',
    'puzzles.startRush': 'Start Rush',
    'coursesContent.chessFundamentals.title': 'Sjakkfundamenter',
    'coursesContent.chessFundamentals.description': 'Lær de grunnleggende reglene, brikkebevegelser og fundamentale konsepter. Perfekt for nybegynnere.',
    'coursesContent.chessFundamentals.modules.board': 'Brettet og Brikkene',
    'coursesContent.chessFundamentals.modules.tactics': 'Grunnleggende Taktikk',
    'coursesContent.chessFundamentals.lessons.intro': 'Introduksjon til Sjakkbrettet',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'Hvordan Brikkene Beveger Seg',
    'coursesContent.chessFundamentals.lessons.checkmates': 'Grunnleggende Sjakkmatter',
    'coursesContent.intermediateStrategy.title': 'Middels Strategi',
    'coursesContent.intermediateStrategy.modules.positional': 'Posisjonelle Fundamenter',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'Sentrumskontroll',
    'coursesContent.intermediateStrategy.lessons.development': 'Brikkeutvikling',
  },
  es: {
    'nav.brand': 'ICS',
    'footer.brand': 'Iranian Chess School',
    'footer.brand_short': 'ICS',
    'pricing.faq.heading': 'Preguntas Frecuentes',
    'pricing.faq.pricingA1': 'Todos los planes incluyen una prueba gratuita de 7 días. No se requiere tarjeta de crédito. Cancela en cualquier momento durante el período de prueba.',
    'pricing.faq.pricingA2': '¡Sí! Puedes cambiar de plan en cualquier momento. Para las mejoras, se cobra la diferencia proporcional. Las rebajas surten efecto al final del período de facturación.',
    'pricing.faq.pricingA3': 'Aceptamos todas las tarjetas de crédito principales a través de Stripe y pasarelas de pago iraníes (Zarinpal, Zibal, NextPay, IDPay, PayPing).',
    'dashboard.puzzleRush': 'Desafío Relámpago',
    'dashboard.submitHomework': 'Entregar Tarea',
    'dashboard.challenges': 'Desafíos Semanales',
    'admin.makeAdmin': 'Hacer Admin',
    'puzzles.puzzleRush': 'Desafío Relámpago',
    'coursesContent.chessFundamentals.title': 'Fundamentos del Ajedrez',
    'coursesContent.chessFundamentals.description': 'Aprende las reglas básicas, el movimiento de las piezas y los conceptos fundamentales. Perfecto para principiantes absolutos.',
    'coursesContent.chessFundamentals.modules.board': 'El Tablero y las Piezas',
    'coursesContent.chessFundamentals.modules.tactics': 'Tácticas Básicas',
    'coursesContent.chessFundamentals.lessons.intro': 'Introducción al Tablero',
    'coursesContent.chessFundamentals.lessons.pieceMoves': 'Cómo se Mueven las Piezas',
    'coursesContent.chessFundamentals.lessons.checkmates': 'Jaque Mates Básicos',
    'coursesContent.intermediateStrategy.title': 'Estrategia Intermedia',
    'coursesContent.intermediateStrategy.modules.positional': 'Fundamentos Posicionales',
    'coursesContent.intermediateStrategy.lessons.centerControl': 'Control del Centro',
    'coursesContent.intermediateStrategy.lessons.development': 'Desarrollo de Piezas',
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
  if (Object.keys(trans).length === 0) { console.log(`${locale}: already done`); continue; }
  const localePath = path.join(messagesDir, `${locale}.json`);
  const loc = readJson(localePath);
  for (const [key, value] of Object.entries(trans)) {
    setDeep(loc as Record<string, unknown>, key, value);
  }
  fs.writeFileSync(localePath, JSON.stringify(loc, null, 2) + '\n');
  console.log(`${locale}: ${Object.keys(trans).length} keys translated`);
}
console.log('\nDone!');
