import { History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TransferHistory } from '../types';
import { formatBytes } from '../utils/format';

interface Props {
  history: TransferHistory[];
  onClear: () => void;
}

export default function HistoryTable({ history, onClear }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
          Transfer History
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-[12px] tabular-nums text-[var(--text-3)]">
            {history.length}
          </span>
          {history.length > 0 && (
            <motion.button
              onClick={onClear}
              whileTap={{ scale: 0.95 }}
              className="text-[12px] font-medium text-[var(--danger)] transition-opacity hover:opacity-70 cursor-pointer"
            >
              Clear
            </motion.button>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        {history.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <History className="mb-2 h-5 w-5 text-[var(--text-3)]" />
            <p className="text-[13px] text-[var(--text-2)]">No transfers yet</p>
          </motion.div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--surface-raised)]">
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">File</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">Size</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">From</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">Time</th>
                  <th className="px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-3)]">Checksum</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {history.map((h, i) => (
                    <motion.tr
                      key={h.checksum + i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      layout
                      className="border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--surface-raised)]"
                    >
                      <td className="max-w-[220px] truncate whitespace-nowrap px-4 py-2.5 text-[13px] font-medium text-[var(--text)]" title={h.filename}>
                        {h.filename}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] tabular-nums text-[var(--text-2)]">
                        {formatBytes(h.size)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <code className="rounded bg-[var(--surface-raised)] px-1.5 py-0.5 text-[11px] text-[var(--text-2)]" style={{ fontFamily: 'var(--font-mono)' }}>
                          {h.senderIp}
                        </code>
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-[13px] text-[var(--text-2)]">
                        {new Date(h.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <code className="text-[11px] text-[var(--success)]" style={{ fontFamily: 'var(--font-mono)' }} title={h.checksum}>
                          {h.checksum.slice(0, 16)}…
                        </code>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
