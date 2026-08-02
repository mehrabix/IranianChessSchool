'use client';

import { useUIStore } from '@/store/uiStore';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  BookOpen,
  Brain,
  Puzzle,
  Users,
  MessageCircle,
  Trophy,
  TrendingUp,
  Swords,
  ChevronLeft,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/dashboard', label: 'dashboard', icon: LayoutDashboard },
  { href: '/courses', label: 'myCourses', icon: BookOpen },
  { href: '/dashboard/analysis', label: 'analysis', icon: Brain },
  { href: '/dashboard/puzzles', label: 'dailyPuzzle', icon: Puzzle },
  { href: '/dashboard/groups', label: 'groups', icon: Users },
  { href: '/dashboard/social', label: 'socialFeed', icon: MessageCircle },
  { href: '/dashboard/leaderboard', label: 'leaderboard', icon: Trophy },
  { href: '/dashboard/progress', label: 'myProgress', icon: TrendingUp },
  { href: '/dashboard/tournaments', label: 'tournaments', icon: Swords },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('dashboard');
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sheetSide = typeof document !== 'undefined' && document.documentElement.dir === 'rtl' ? 'right' : 'left';

  return (
    <div className="flex h-[calc(100vh-var(--navbar-height))]">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-[var(--navbar-height)] start-0 end-0 z-40 flex h-12 items-center gap-2 border-b bg-background px-4">
        <Sheet onOpenChange={(open) => setSidebarOpen(open)} open={sidebarOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="shrink-0"><Menu className="h-5 w-5" /></Button>} />
          <SheetContent side={sheetSide as 'left' | 'right'} className="w-[260px] p-0">
            <SheetHeader className="border-b px-4 py-3">
              <SheetTitle className="text-lg font-semibold">{t('backToDashboard')}</SheetTitle>
            </SheetHeader>
            <SidebarNav t={t} isActive={isActive} collapsed={false} onNavigate={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium truncate">
          {sidebarLinks.find((l) => isActive(l.href))?.label
            ? t(sidebarLinks.find((l) => isActive(l.href))!.label as never)
            : t('backToDashboard')}
        </span>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-e bg-muted/30 transition-all duration-300 shrink-0',
          sidebarOpen ? 'w-56' : 'w-16'
        )}
      >
        <div className="flex h-12 items-center justify-end border-b px-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSidebar}>
            {sidebarOpen ? <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> : <ChevronRight className="h-4 w-4 rtl:rotate-180" />}
          </Button>
        </div>

        <SidebarNav t={t} isActive={isActive} collapsed={!sidebarOpen} />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pt-12 md:pt-0">
        {children}
      </main>
    </div>
  );
}

function SidebarNav({
  t,
  isActive,
  collapsed,
  onNavigate,
}: {
  t: ReturnType<typeof useTranslations<'dashboard'>>;
  isActive: (href: string) => boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 p-2">
      {sidebarLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && (
              <span className="truncate">{t(link.label as never)}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
