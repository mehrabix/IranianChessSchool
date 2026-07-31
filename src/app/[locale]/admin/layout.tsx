import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/sonner";
import { Link } from "@/i18n/routing";
import { LayoutDashboard, BookOpen, FileText } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  const t = await getTranslations('admin.nav');

  const adminLinks = [
    { href: '/admin', label: t('dashboard'), icon: LayoutDashboard },
    { href: '/admin/courses', label: t('courses'), icon: BookOpen },
    { href: '/admin/posts', label: t('posts'), icon: FileText },
  ];

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div className="flex min-h-screen">
          <aside className="w-56 shrink-0 border-r bg-muted/30 p-4 hidden md:flex flex-col gap-1">
            <Link href="/admin" className="flex items-center gap-2 font-bold text-lg mb-6 px-2">
              {t('brand')}
            </Link>
            {adminLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </aside>
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </Providers>
    </NextIntlClientProvider>
  );
}
