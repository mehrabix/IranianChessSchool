import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Providers } from "@/components/layout/Providers";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

export async function generateMetadata() {
  const t = await getTranslations('nav');
  return {
    title: `${t('brand')} — Master the Game, Think Deeper`,
    description: 'Structured chess training for all levels. Courses, puzzles, game analysis, live coaching, and a supportive community.',
    keywords: 'chess, learn chess, chess school, chess training, chess puzzles, chess analysis, stockfish',
    openGraph: {
      title: `${t('brand')} — Master the Game, Think Deeper`,
      description: 'Structured chess training for all levels.',
      type: 'website',
      locale: 'en_US',
      siteName: t('brand'),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('brand')} — Master the Game, Think Deeper`,
      description: 'Structured chess training for all levels.',
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </Providers>
    </NextIntlClientProvider>
  );
}
