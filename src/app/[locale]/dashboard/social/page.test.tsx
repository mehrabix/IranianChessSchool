// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, waitFor, fireEvent } from '@testing-library/react';
import SocialPage from './page';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({ data: { user: { id: 'user-1', name: 'Test User' } }, status: 'authenticated' })),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      socialFeed: 'Social Feed', post: 'Post', refresh: 'Refresh',
      shareThoughts: 'Share your thoughts...', writeComment: 'Write a comment...',
      noPosts: 'No posts yet. Be the first to share!', edit: 'Edit', delete: 'Delete',
      save: 'Save', cancel: 'Cancel', photo: 'Photo', confirmDelete: 'Delete this post?',
    };
    return map[key] || key;
  },
  useLocale: () => 'en',
}));

vi.mock('@/i18n/routing', () => ({
  Link: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
  usePathname: () => '/',
  useRouter: () => ({ replace: vi.fn() }),
}));

vi.mock('framer-motion', () => ({
  motion: { div: 'div' as any, span: 'span' as any },
  AnimatePresence: ({ children }: any) => children,
}));

const mockPosts = [
  {
    id: 'post-1',
    content: 'My first post',
    image: null,
    pgn: null,
    likes: 5,
    comments: 2,
    createdAt: Math.floor(Date.now() / 1000) - 3600,
    userId: 'user-1',
    userName: 'Test User',
    userImage: null,
  },
  {
    id: 'post-2',
    content: 'Someone else\'s post',
    image: null,
    pgn: null,
    likes: 3,
    comments: 0,
    createdAt: Math.floor(Date.now() / 1000) - 7200,
    userId: 'user-2',
    userName: 'Other User',
    userImage: null,
  },
];

const createFetchMock = (data: any, ok = true) =>
  vi.fn(() => Promise.resolve({ ok, json: () => Promise.resolve(data) }));

const originalFetch = globalThis.fetch;

describe('SocialPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.fetch = createFetchMock({ posts: [] });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('renders loading spinner initially', () => {
    const { container } = render(<SocialPage />);
    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('renders posts after loading', async () => {
    globalThis.fetch = createFetchMock({ posts: mockPosts }) as any;
    const { container } = render(<SocialPage />);
    await waitFor(() => {
      expect(container.textContent).toContain('My first post');
    });
    expect(container.textContent).toContain('Someone else\'s post');
  });

  it('shows post author names', async () => {
    globalThis.fetch = createFetchMock({ posts: mockPosts }) as any;
    const { container } = render(<SocialPage />);
    await waitFor(() => {
      expect(container.textContent).toContain('Test User');
    });
    expect(container.textContent).toContain('Other User');
  });

  it('shows edit and delete buttons on user\'s own post', async () => {
    globalThis.fetch = createFetchMock({ posts: mockPosts }) as any;
    const { container } = render(<SocialPage />);
    await waitFor(() => {
      expect(container.textContent).toContain('Edit');
    });
    expect(container.textContent).toContain('Delete');
  });

  it('toggles edit mode when Edit button is clicked', async () => {
    globalThis.fetch = createFetchMock({ posts: mockPosts }) as any;
    const { container } = render(<SocialPage />);

    await waitFor(() => {
      expect(container.textContent).toContain('Edit');
    });

    const editButton = container.querySelector('[aria-label="Edit post"]');
    expect(editButton).toBeTruthy();

    if (editButton) {
      fireEvent.click(editButton);
      await waitFor(() => {
        expect(container.textContent).toContain('Save');
        expect(container.textContent).toContain('Cancel');
      });
    }
  });

  it('shows post creation form with image upload for logged-in user', async () => {
    globalThis.fetch = createFetchMock({ posts: mockPosts }) as any;
    const { container } = render(<SocialPage />);
    await waitFor(() => {
      expect(container.textContent).toContain('Photo');
    });
    expect(container.querySelector('textarea')).toBeTruthy();
  });

  it('shows post image when present', async () => {
    const postsWithImage = [
      {
        ...mockPosts[0],
        image: '/uploads/test-image.jpg',
      },
    ];
    globalThis.fetch = createFetchMock({ posts: postsWithImage }) as any;
    const { container } = render(<SocialPage />);
    await waitFor(() => {
      expect(container.textContent).toContain('My first post');
    });
    const img = container.querySelector('img[src="/uploads/test-image.jpg"]');
    expect(img).toBeTruthy();
  });
});
