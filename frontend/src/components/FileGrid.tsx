import { Download, Trash2, File, Image, Film, Music, FileText, Archive, Code, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FileMetadata } from '../types';
import { getFileIconName, type FileIconName } from '../utils/format';

interface Props {
  files: FileMetadata[];
  onDelete: (filename: string) => void;
}

const ICON_MAP: Record<FileIconName, React.ElementType> = {
  file: File,
  image: Image,
  film: Film,
  music: Music,
  'file-text': FileText,
  archive: Archive,
  code: Code,
};

export default function FileGrid({ files, onDelete }: Props) {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text-3)]">
          Files
        </h2>
        <span className="text-[12px] tabular-nums text-[var(--text-3)]">
          {files.length}
        </span>
      </div>

      {files.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card flex flex-col items-center justify-center px-6 py-12 text-center"
        >
          <Inbox className="mb-2 h-5 w-5 text-[var(--text-3)]" />
          <p className="text-[13px] text-[var(--text-2)]">No files shared yet</p>
        </motion.div>
      ) : (
        <div className="card divide-y divide-[var(--border)] overflow-hidden">
          <AnimatePresence initial={false}>
            {files.map((f) => {
              const IconComp = ICON_MAP[getFileIconName(f.filename)];
              return (
                <motion.div
                  key={f.filename}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  layout
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--surface-raised)] overflow-hidden"
                >
                  <IconComp className="h-4 w-4 shrink-0 text-[var(--text-3)]" />

                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[var(--text)]" title={f.filename}>
                    {f.filename}
                  </span>

                  <span className="hidden shrink-0 text-[12px] tabular-nums text-[var(--text-3)] sm:block">
                    {f.sizeFormatted}
                  </span>

                  <span className="hidden shrink-0 text-[12px] text-[var(--text-3)] md:block">
                    {new Date(f.modified).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>

                  <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <motion.a
                      href={`/api/files/${encodeURIComponent(f.filename)}/download`}
                      download
                      whileTap={{ scale: 0.85 }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-2)] transition-colors hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
                      title="Download"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </motion.a>
                    <motion.button
                      onClick={() => onDelete(f.filename)}
                      whileTap={{ scale: 0.85 }}
                      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--text-2)] transition-colors hover:bg-[var(--danger-soft)] hover:text-[var(--danger)] cursor-pointer"
                      aria-label={`Delete ${f.filename}`}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
