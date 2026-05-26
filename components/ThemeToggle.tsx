'use client';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      title={isDark ? 'Světlá téma' : 'Tmavá téma'}
      className={`w-9 h-9 flex items-center justify-center rounded-lg border transition
        border-slate-200 hover:bg-slate-100 text-slate-600
        dark:border-white/10 dark:hover:bg-slate-800 dark:text-slate-400
        ${className}`}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
