'use client';

import { useUIStore } from '@/store/uiStore';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarLinks = [
  { href: '/dashboard', label: 'backToDashboard', icon: LayoutDashboard },
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
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-[calc(100vh-var(--navbar-height))]">
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
        <nav className="flex flex-col gap-1 p-2 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  active
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {sidebarOpen && <span className="truncate">{t(link.label as never)}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
