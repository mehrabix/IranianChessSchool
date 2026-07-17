import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import { rtlLocales } from "@/i18n/routing";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Iranian Chess School — Master the Game, Think Deeper",
  description: "Structured chess training for all levels. Courses, puzzles, analysis, and community.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const dir = rtlLocales.includes(locale as any) ? 'rtl' : 'ltr';
  return (
    <html lang={locale} dir={dir} className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
