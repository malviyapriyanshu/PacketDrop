import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Copy, Check } from 'lucide-react';
import type { ServerInfo } from '../../types';

interface Props {
  info: ServerInfo | null;
}

export default function ConnectionInfoCard({ info }: Props) {
  const [copied, setCopied] = useState(false);
  const online = Boolean(info);

  const copyUrl = async () => {
    if (!info) return;
    await navigator.clipboard.writeText(info.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 }}
      className="glass-card p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="icon-tile h-8 w-8 text-blue-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
            <Wifi className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Connection</h3>
        </div>
        <span className={`inline-flex h-7 items-center gap-1.5 rounded-lg border px-2.5 text-[10px] font-bold uppercase tracking-wide ${
          online
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/15 dark:bg-emerald-500/10 dark:text-emerald-400'
            : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/15 dark:bg-amber-500/10 dark:text-amber-400'
        }`}>
          <span className="relative flex h-1.5 w-1.5">
            {online && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60 dark:bg-emerald-400" />}
            <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-amber-500 dark:bg-amber-400'}`} />
          </span>
          {online ? 'Online' : 'Waiting'}
        </span>
      </div>

      <div className="mb-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-white/[0.04] dark:bg-black/20">
        <code className="flex-1 truncate font-mono text-[13px] text-slate-700 dark:text-indigo-300">
          {info?.url || 'Loading…'}
        </code>
        <button
          onClick={copyUrl}
          disabled={!info}
          className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-40 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label="Copy URL"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.06]">
        <InfoCell label="Local IP" value={info?.localIP} />
        <InfoCell label="Port" value={info?.port} />
        <InfoCell label="Limit" value={info?.maxFileSizeFormatted} />
      </div>
    </motion.div>
  );
}

function InfoCell({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-2.5 last:border-b-0 dark:border-white/[0.04]">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="truncate text-right text-sm font-semibold text-slate-800 dark:text-slate-200">{value ?? '—'}</div>
    </div>
  );
}
