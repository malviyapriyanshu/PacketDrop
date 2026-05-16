import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      localStorage.removeItem('theme');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  return (
    <div className="group relative inline-block">
      <button
        className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all group-hover:bg-slate-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-slate-400 dark:group-hover:bg-white/[0.08] dark:group-hover:text-white"
        title="Theme Settings"
        aria-haspopup="true"
      >
        {theme === 'system' ? (
          <Monitor className="h-4 w-4" />
        ) : theme === 'dark' ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
      </button>

      {/* Dropdown Menu Wrapper (with padding to prevent hover loss) */}
      <div className="absolute right-0 top-full z-[100] hidden w-36 pt-2 origin-top-right flex-col opacity-0 transition-all duration-200 group-hover:flex group-hover:opacity-100">
        <div className="flex w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-white/[0.08] dark:bg-slate-900 dark:shadow-2xl">
          <button
            onClick={() => setTheme('light')}
            className={`flex w-full items-center gap-2 px-3 py-2 text-[13px] font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
              theme === 'light' ? 'text-teal-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Sun className="h-3.5 w-3.5" /> Light
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex w-full items-center gap-2 px-3 py-2 text-[13px] font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
              theme === 'dark' ? 'text-teal-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Moon className="h-3.5 w-3.5" /> Dark
          </button>
          <div className="h-px w-full bg-slate-100 dark:bg-white/[0.04]" />
          <button
            onClick={() => setTheme('system')}
            className={`flex w-full items-center gap-2 px-3 py-2 text-[13px] font-medium transition-colors hover:bg-slate-50 dark:hover:bg-white/[0.04] ${
              theme === 'system' ? 'text-teal-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            <Monitor className="h-3.5 w-3.5" /> System
          </button>
        </div>
      </div>
    </div>
  );
}
