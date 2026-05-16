import { motion } from 'framer-motion';
import { Clock3, ShieldCheck, History, Trash2 } from 'lucide-react';
import type { TransferHistory } from '../types';
import { getFileIcon, formatBytes } from '../utils/format';

interface Props {
  history: TransferHistory[];
  onClear: () => void;
}

export default function HistoryTable({ history, onClear }: Props) {
  return (
    <section>
      <div className="section-header">
        <div>
          <h2 className="section-heading">Transfer History</h2>
          <p className="section-sub">Log of network activity and checksum verification</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 items-center whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-300">
            {history.length} transfer{history.length !== 1 ? 's' : ''}
          </span>
          {history.length > 0 && (
            <button
              onClick={onClear}
              className="btn-secondary h-8 px-3 text-red-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10"
              title="Clear History"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden"
      >
        {history.length === 0 ? (
          <div className="flex min-h-[176px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="icon-tile mb-3 h-11 w-11 text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-slate-400">
              <History className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No transfers yet</p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Activity appears here after the first upload.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 dark:border-white/[0.06] dark:bg-black/20">
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">File</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Size</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">From</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Time</th>
                  <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Checksum</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h, i) => (
                  <tr key={i} className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50 dark:border-white/[0.04] dark:hover:bg-white/[0.02]">
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{getFileIcon(h.filename)}</span>
                        <span className="max-w-[260px] truncate text-[13px] font-semibold text-slate-800 dark:text-slate-200" title={h.filename}>{h.filename}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] tabular-nums text-slate-600 dark:text-slate-400">{formatBytes(h.size)}</td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <code className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-[11px] text-slate-600 dark:border-white/[0.06] dark:bg-black/20 dark:text-slate-300">{h.senderIp}</code>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-[13px] text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock3 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        {new Date(h.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <code className="max-w-[100px] truncate font-mono text-[11px]" title={h.checksum}>{h.checksum.slice(0, 12)}...</code>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </section>
  );
}
