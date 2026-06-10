import { useEffect, useState } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

type Theme = 'light' | 'dark' | 'system';
const CYCLE: Theme[] = ['light', 'dark', 'system'];

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem('theme') as Theme) || 'system'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const sys = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(sys);
      localStorage.removeItem('theme');
    } else {
      root.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const next = () => {
    const i = CYCLE.indexOf(theme);
    setTheme(CYCLE[(i + 1) % CYCLE.length]);
  };

  const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;

  return (
    <motion.button
      onClick={next}
      whileTap={{ scale: 0.9 }}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-2)] transition-colors hover:bg-[var(--surface-raised)] hover:text-[var(--text)] cursor-pointer"
      title={`Theme: ${theme}`}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        className="flex items-center justify-center"
      >
        <Icon className="h-4 w-4" />
      </motion.div>
    </motion.button>
  );
}
