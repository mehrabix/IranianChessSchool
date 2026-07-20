'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 dark:scale-0 transition-all" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 dark:scale-100 transition-all" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}