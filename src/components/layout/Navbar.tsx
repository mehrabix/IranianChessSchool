'use client';

import { useSession, signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
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
  Home,
  Info,
  Users,
  HelpCircle,
  FileText,
  Mail,
  CreditCard,
  LayoutDashboard,
  ChevronRight,
  LogOut,
  Menu,
  ChessKnight,
  Shield,
  BookOpen,
  MessageCircle,
  Trophy,
} from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/', labelKey: 'home', icon: Home },
  { href: '/about', labelKey: 'about', icon: Info },
  { href: '/kids', labelKey: 'kids', icon: Users },
  { href: '/faq', labelKey: 'faq', icon: HelpCircle },
  { href: '/blog', labelKey: 'blog', icon: FileText },
  { href: '/contact', labelKey: 'contact', icon: Mail },
  { href: '/pricing', labelKey: 'pricing', icon: CreditCard },
  { href: '/courses', labelKey: 'courses', icon: BookOpen },
];

export function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations('nav');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <ChessKnight className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline">{t('brand')}</span>
          <span className="sm:hidden">{t('brandShort')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent">
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="relative h-8 w-8 rounded-full p-0" />}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user?.image || ''} />
                  <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ''} />
                    <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{session.user?.email}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/dashboard" />}>
                  <LayoutDashboard className="h-4 w-4" />
                  {t('dashboard')}
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/social" />}>
                  <MessageCircle className="h-4 w-4" />
                  {t('social')}
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/leaderboard" />}>
                  <Trophy className="h-4 w-4" />
                  {t('leaderboard')}
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard/progress" />}>
                  <ChevronRight className="h-4 w-4" />
                  {t('myProgress')}
                </DropdownMenuItem>
                {session.user?.role === 'ADMIN' && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/admin" />}>
                      <Shield className="h-4 w-4" />
                      {t('admin')}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('signOut')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" nativeButton={false} render={<Link href="/auth/signin" />}>
                {t('signIn')}
              </Button>
              <Button nativeButton={false} render={<Link href="/pricing" />}>
                {t('tryFree')}
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px] sm:w-[320px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="flex items-center gap-2">
                  <ChessKnight className="h-5 w-5 text-primary" />
                  Iranian Chess School
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}
                    className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    {t(link.labelKey)}
                  </Link>
                ))}
              </nav>
              {session && (
                <>
                  <div className="my-4 mx-3 h-px bg-border" />
                  <div className="px-3 py-2 text-sm text-muted-foreground">{t('loggedInAs', { name: String(session.user?.name ?? '') })}</div>
                  {session.user?.role === 'ADMIN' && (
                    <Link href="/admin"
                      className="flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                    >
                      <Shield className="h-5 w-5 shrink-0" />
                      Admin
                    </Link>
                  )}
                </>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
