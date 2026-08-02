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
