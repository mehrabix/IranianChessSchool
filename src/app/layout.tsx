import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const vazirmatn = Vazirmatn({
  variable: "--font-fa",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Iranian Chess School — Master the Game, Think Deeper",
  description: "Structured chess training for all levels. Courses, puzzles, analysis, and community.",
  openGraph: {
    title: "Iranian Chess School",
    description: "Structured chess training for all levels. Courses, puzzles, analysis, and community.",
    siteName: "Iranian Chess School",
    type: "website",
    locale: "en_US",
    images: [{ url: "https://iranian-chess-school.vercel.app/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iranian Chess School",
    description: "Structured chess training for all levels. Courses, puzzles, analysis, and community.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${vazirmatn.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
        <script dangerouslySetInnerHTML={{ __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
        <script
          dangerouslySetInnerHTML={{
            __html: [
              "(function(){",
              "var p=window.location.pathname;",
              "var l=p.split('/')[1]||'en';",
              "document.documentElement.dir=l==='fa'?'rtl':'ltr';",
              "document.documentElement.lang=l;",
              "document.documentElement.classList.toggle('font-fa',l==='fa');",
              "var _popstate=function(){",
              "var p2=window.location.pathname;",
              "var l2=p2.split('/')[1]||'en';",
              "document.documentElement.dir=l2==='fa'?'rtl':'ltr';",
              "document.documentElement.lang=l2;",
              "document.documentElement.classList.toggle('font-fa',l2==='fa');",
              "};",
              "window.addEventListener('popstate',_popstate);",
              "var _pushState=history.pushState;",
              "history.pushState=function(){_pushState.apply(this,arguments);setTimeout(_popstate,0);};",
              "var _replaceState=history.replaceState;",
              "history.replaceState=function(){_replaceState.apply(this,arguments);setTimeout(_popstate,0);};",
              "})();",
            ].join(''),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
