import { motion, AnimatePresence } from 'framer-motion';
import { FileIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import type { UploadState } from '../types';

interface Props {
  uploads: UploadState[];
}

export default function ProgressList({ uploads }: Props) {
  if (!uploads.length) return null;

  return (
    <section>
      <div className="section-header">
        <div>
          <h2 className="section-heading">Active Transfers</h2>
          <p className="section-sub">Current upload progress and transfer speed</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {uploads.map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              layout
              className="glass-card p-4"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="icon-tile h-10 w-10 shrink-0 dark:border-white/[0.04] dark:bg-white/[0.02]">
                  {u.status === 'complete' ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                  ) : u.status === 'error' ? (
                    <AlertCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400" />
                  ) : (
                    <FileIcon className="h-4.5 w-4.5 text-teal-700 dark:text-indigo-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white">{u.file.name}</p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {u.bytesFormatted} / {u.totalFormatted}
                    {u.status === 'uploading' && <> - {u.speed} - {u.eta}</>}
                  </p>
                </div>

                <span className={`shrink-0 text-sm font-bold ${
                  u.status === 'complete' ? 'text-emerald-700 dark:text-emerald-400'
                  : u.status === 'error' ? 'text-red-700 dark:text-red-400'
                  : 'text-teal-700 dark:text-indigo-400'
                }`}>
                  {u.status === 'complete' ? 'Done' : u.status === 'error' ? 'Error' : `${u.progress}%`}
                </span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${u.status === 'error' ? 100 : u.progress}%` }}
                  transition={{ ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    u.status === 'complete' ? 'bg-emerald-600 dark:bg-emerald-400'
                    : u.status === 'error' ? 'bg-red-600 dark:bg-red-400'
                    : 'bg-teal-600 dark:bg-indigo-500'
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
