'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ChessKnight,
  Shield,
  BookOpen,
  TrendingUp,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { NotificationBell } from './NotificationBell';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', labelKey: 'home' },
  { href: '/about', labelKey: 'about' },
  { href: '/kids', labelKey: 'kids' },
  { href: '/faq', labelKey: 'faq' },
  { href: '/blog', labelKey: 'blog' },
  { href: '/contact', labelKey: 'contact' },
  { href: '/pricing', labelKey: 'pricing' },
  { href: '/courses', labelKey: 'courses' },
];

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl shrink-0 w-[200px]">
          <ChessKnight className="h-6 w-6 text-primary" />
          <span>Iranian Chess School</span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive(link.href)
                  ? 'text-foreground bg-accent'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 shrink-0">
          <LanguageSwitcher />
          <ThemeToggle />
          {session && <NotificationBell />}

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" />}>
                <Avatar className="h-9 w-9">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback className="text-xs">{session.user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session.user?.image || ''} />
                    <AvatarFallback>{session.user?.name?.[0]?.toUpperCase() || '?'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{session.user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{session.user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}><LayoutDashboard className="h-4 w-4" />{t('dashboard')}</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/courses" />}><BookOpen className="h-4 w-4" />{t('courses')}</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/progress" />}><TrendingUp className="h-4 w-4" />{t('myProgress')}</DropdownMenuItem>
                {session.user?.role === 'ADMIN' && (<><DropdownMenuSeparator /><DropdownMenuItem render={<Link href="/admin" />}><Shield className="h-4 w-4" />{t('admin')}</DropdownMenuItem></>)}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive"><LogOut className="h-4 w-4 mr-2" />{t('signOut')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" render={<Link href="/auth/signin" />}>{t('signIn')}</Button>
              <Button size="sm" render={<Link href="/pricing" />}>{t('tryFree')}</Button>
            </div>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>} />
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2"><ChessKnight className="h-5 w-5 text-primary" />Iranian Chess School</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className={cn('flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md transition-colors',
                      isActive(link.href) ? 'text-foreground bg-accent' : 'text-muted-foreground hover:text-foreground hover:bg-accent/50')}
                  >{t(link.labelKey)}</Link>
                ))}
              </nav>
              {session && (<>
                <div className="my-4 mx-3 h-px bg-border" />
                <div className="px-3 py-2 text-sm text-muted-foreground">{t('loggedInAs', { name: String(session.user?.name ?? '') })}</div>
                <div className="flex flex-col gap-1 mt-2">
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><LayoutDashboard className="h-5 w-5 shrink-0" />{t('dashboard')}</Link>
                  {session.user?.role === 'ADMIN' && <Link href="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"><Shield className="h-5 w-5 shrink-0" />{t('admin')}</Link>}
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md text-destructive hover:bg-destructive/10 transition-colors"><LogOut className="h-5 w-5 shrink-0" />{t('signOut')}</button>
                </div>
              </>)}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
