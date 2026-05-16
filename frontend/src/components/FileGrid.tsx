import { motion } from 'framer-motion';
import { Download, Trash2, Inbox } from 'lucide-react';
import type { FileMetadata } from '../types';
import { getFileIcon } from '../utils/format';

interface Props {
  files: FileMetadata[];
  onDelete: (filename: string) => void;
}

export default function FileGrid({ files, onDelete }: Props) {
  return (
    <section>
      <div className="section-header">
        <div>
          <h2 className="section-heading">Available Files</h2>
          <p className="section-sub">Files shared on this network</p>
        </div>
        <span className="inline-flex h-8 items-center whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 dark:border-white/[0.06] dark:bg-white/[0.02] dark:text-slate-300">
          {files.length} file{files.length !== 1 ? 's' : ''}
        </span>
      </div>

      {files.length === 0 ? (
        <div className="glass-card flex min-h-[176px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="icon-tile mb-3 h-11 w-11 text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-slate-400">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No files available</p>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Uploaded files will appear here.</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
        >
          {files.map((f, i) => (
            <motion.div
              key={f.filename}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card flex min-h-[156px] flex-col p-4"
            >
              <div className="mb-5 flex items-start gap-3">
                <div className="icon-tile h-11 w-11 shrink-0 text-2xl dark:border-white/[0.04] dark:bg-white/[0.02]">
                  {getFileIcon(f.filename)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-950 dark:text-white" title={f.filename}>{f.filename}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    {f.sizeFormatted} - {new Date(f.modified).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 dark:border-white/[0.04]">
                <a
                  href={`/api/files/${encodeURIComponent(f.filename)}/download`}
                  download
                  className="btn-secondary flex-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Save
                </a>
                <button
                  onClick={() => onDelete(f.filename)}
                  className="btn-secondary px-3 text-slate-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:text-slate-400 dark:hover:border-red-500/30 dark:hover:bg-red-500/10 dark:hover:text-red-400"
                  aria-label={`Delete ${f.filename}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
