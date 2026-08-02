// @vitest-environment node
import { describe, it, expect, vi } from 'vitest';

const mockDbValue = vi.hoisted(() => ({
  select: vi.fn(() => ({
    from: vi.fn(() => ({
      where: vi.fn(() => ({
        where: vi.fn(() => []),
        then: (fn: any) => Promise.resolve(fn([])),
      })),
    })),
  })),
}));

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => {
    const map: Record<string, string> = {
      myProgress: 'My Progress',
      subtitle: 'Track your learning progress',
      'stats.completed': 'Completed',
      totalLessons: 'Total Lessons',
      timeSpent: 'Time Spent',
      avgScore: 'Avg Score',
      courseProgress: 'Course Progress',
      noActivity: 'No activity yet.',
      xp: 'XP',
      thisWeekSummary: 'This Week: {lessons} lessons, {xp} XP earned',
      completionRate: 'Completion Rate',
      completedWithCount: 'Completed',
      remainingWithCount: 'Remaining',
      weeklyActivity: 'Weekly Activity',
      lessonsCount: 'lessons',
    };
    return map[key] || key;
  },
  getLocale: async () => 'en',
}));

vi.mock('@/lib/db', () => ({
  db: mockDbValue,
  eq: vi.fn(),
  and: vi.fn(),
  progress: { userId: 'userId', id: 'id', completed: 'completed', score: 'score', timeSpent: 'timeSpent', completedAt: 'completedAt', lessonId: 'lessonId' },
  lessons: { id: 'id' },
  courses: { id: 'id', published: 'published' },
}));

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve({ user: { id: 'u1', name: 'Test User' } })),
}));

vi.mock('@/i18n/routing', () => ({
  redirect: vi.fn(),
  Link: ({ children }: any) => children,
}));

vi.mock('lucide-react', () => ({
  CheckCircle2: () => null,
  Clock: () => null,
  BookOpen: () => null,
  TrendingUp: () => null,
  Target: () => null,
  Zap: () => null,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => children,
  CardContent: ({ children }: any) => children,
  CardHeader: ({ children }: any) => children,
  CardTitle: ({ children }: any) => children,
}));

vi.mock('@/components/ui/container', () => ({
  Container: ({ children }: any) => children,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => children,
}));

vi.mock('@/components/ui/progress', () => ({
  Progress: () => null,
}));

import ProgressPage from './page';

describe('ProgressPage', () => {
  it('renders the progress page heading', async () => {
    const jsx = await ProgressPage();
    // Render to string by converting to HTML-like inspection
    const str = JSON.stringify(jsx);
    expect(str).toContain('My Progress');
  });

  it('renders completion pie chart element', async () => {
    const jsx = await ProgressPage();
    expect(jsx).toBeDefined();
    // Check that the JSX structure contains the testid
    const str = JSON.stringify(jsx);
    expect(str).toContain('completion-pie');
  });

  it('renders weekly activity heatmap element', async () => {
    const jsx = await ProgressPage();
    const str = JSON.stringify(jsx);
    expect(str).toContain('activity-heatmap');
  });

  it('includes XP in the weekly stats', async () => {
    const jsx = await ProgressPage();
    const str = JSON.stringify(jsx);
    expect(str).toContain('XP');
  });

  it('includes course progress section', async () => {
    const jsx = await ProgressPage();
    const str = JSON.stringify(jsx);
    expect(str).toContain('Course Progress');
  });
});
