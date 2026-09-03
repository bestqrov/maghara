'use client';

import { useSyncExternalStore } from 'react';
import { MoonIcon, SunIcon } from '@/components/icons';

const STORAGE_KEY = 'zawaj-theme';
type Theme = 'light' | 'dark';

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function readTheme(): Theme {
  const attr = document.documentElement.dataset.theme;
  if (attr === 'dark' || attr === 'light') return attr;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getServerTheme(): Theme {
  return 'light';
}

function setTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Best-effort: theme just won't persist across visits (e.g. private browsing).
  }
  listeners.forEach((callback) => callback());
}

export function ThemeToggle({ ariaLabel }: { ariaLabel: string }) {
  const theme = useSyncExternalStore(subscribe, readTheme, getServerTheme);

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={ariaLabel}
      className="flex shrink-0 items-center justify-center rounded-xl px-3 py-2 text-blue-700 transition hover:bg-rose-50"
    >
      {theme === 'dark' ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
