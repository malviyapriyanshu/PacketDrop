import { motion, AnimatePresence } from 'framer-motion';
import type { UploadState } from '../types';

interface Props {
  uploads: UploadState[];
}

export default function ProgressList({ uploads }: Props) {
  if (!uploads.length) return null;

  return (
    <section>
      <h2 className="mb-3 text-[13px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
        Active Transfers
      </h2>

      <div className="card divide-y divide-[var(--border)]">
        <AnimatePresence mode="popLayout">
          {uploads.map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              layout
              className="px-4 py-3"
            >
              <div className="mb-2 flex items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${
                    u.status === 'complete' ? 'bg-[var(--success)]'
                    : u.status === 'error' ? 'bg-[var(--danger)]'
                    : 'bg-[var(--accent)] animate-pulse'
                  }`} />
                  <span className="truncate text-[13px] font-medium text-[var(--text)]">{u.file.name}</span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-[12px] tabular-nums text-[var(--text-2)]">
                  {u.status === 'uploading' && (
                    <span>{u.speed} · {u.eta}</span>
                  )}
                  <span className={`font-semibold ${
                    u.status === 'complete' ? 'text-[var(--success)]'
                    : u.status === 'error' ? 'text-[var(--danger)]'
                    : 'text-[var(--accent)]'
                  }`}>
                    {u.status === 'complete' ? 'Done' : u.status === 'error' ? 'Failed' : `${u.progress}%`}
                  </span>
                </div>
              </div>

              <div className="h-[3px] w-full overflow-hidden rounded-full bg-[var(--border)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${u.status === 'error' ? 100 : u.progress}%` }}
                  transition={{ ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    u.status === 'complete' ? 'bg-[var(--success)]'
                    : u.status === 'error' ? 'bg-[var(--danger)]'
                    : 'bg-[var(--accent)]'
                  }`}
                />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
