import { motion } from 'framer-motion';
import { Radio, ShieldCheck, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative z-50 py-6 sm:py-8"
    >
      <div className="glass-card px-5 py-5 sm:px-6 sm:py-5 border-t border-t-white/10 dark:border-t-white/5 shadow-sm dark:shadow-2xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Logo Section */}
          <div className="flex min-w-0 items-center gap-4">
            <div className="relative group flex shrink-0 items-center justify-center">
              {/* Glowing background in dark mode */}
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/0 dark:bg-indigo-500/25 blur-xl transition-all duration-500 group-hover:bg-indigo-500/10 dark:group-hover:bg-indigo-500/40" />
              
              <div className="relative flex h-[52px] w-[52px] items-center justify-center rounded-[18px] bg-gradient-to-br from-teal-50 to-teal-100 border border-teal-200/60 text-teal-600 shadow-inner dark:from-white/[0.08] dark:to-white/[0.02] dark:border-white/[0.1] dark:text-indigo-400 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:scale-[1.03]">
                <Zap className="h-6 w-6 dark:drop-shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
              </div>
            </div>

            <div className="min-w-0 flex flex-col justify-center">
              <h1 className="truncate text-[22px] font-extrabold tracking-tight text-slate-900 dark:text-white leading-none sm:text-[26px]">
                Packet<span className="text-teal-600 dark:bg-gradient-to-br dark:from-indigo-400 dark:via-cyan-400 dark:to-cyan-300 dark:bg-clip-text dark:text-transparent">Drop</span>
              </h1>
              <p className="mt-1 text-[13px] font-medium text-slate-500 dark:text-slate-400">
                Local network file transfer
              </p>
            </div>
          </div>

          {/* Badges Section */}
          <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
            <span className="inline-flex h-[34px] items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 text-[12px] font-semibold tracking-wide text-emerald-700 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-emerald-400 dark:shadow-sm">
              <Radio className="h-3.5 w-3.5" />
              LAN ready
            </span>
            <span className="inline-flex h-[34px] items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3.5 text-[12px] font-semibold tracking-wide text-amber-800 dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-amber-400 dark:shadow-sm">
              <ShieldCheck className="h-3.5 w-3.5" />
              SHA-256
            </span>
            <ThemeToggle />
          </div>
          
        </div>
      </div>
    </motion.header>
  );
}
