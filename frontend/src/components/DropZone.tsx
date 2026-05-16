import { useCallback, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCloud } from 'lucide-react';
import { cn } from '../utils/cn';

interface Props {
  onFiles: (files: File[]) => void;
}

export default function DropZone({ onFiles }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent, over: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(over);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  }, [onFiles]);

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) onFiles(files);
    e.target.value = '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      className={cn(
        "glass-card group cursor-pointer border border-dashed p-5 transition-all duration-200 sm:p-6",
        dragging
          ? "border-teal-500 bg-teal-50 dark:border-indigo-500/60 dark:bg-indigo-500/[0.08]"
          : "border-slate-300 hover:border-teal-400 hover:bg-slate-50 dark:border-white/[0.06] dark:hover:border-indigo-500/30 dark:hover:bg-white/[0.02]"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:text-left">
        <div className={cn(
          "flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border transition-colors duration-200",
          dragging
            ? "border-teal-200 bg-white text-teal-700 dark:border-white/10 dark:bg-indigo-500/15 dark:text-indigo-400"
            : "border-slate-200 bg-slate-50 text-slate-500 group-hover:border-teal-200 group-hover:bg-teal-50 group-hover:text-teal-700 dark:border-white/5 dark:bg-white/[0.04] dark:text-slate-400 dark:group-hover:bg-indigo-500/10 dark:group-hover:text-indigo-400"
        )}>
          <UploadCloud className="h-7 w-7" />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold text-slate-950 dark:text-white">
            {dragging ? 'Release to upload' : 'Drop files here'}
          </h3>
          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Drag any file into this panel, or browse from your device.
          </p>
        </div>

        <span className="btn-gradient pointer-events-none w-full shrink-0 sm:w-auto">Select Files</span>
      </div>

      <input ref={inputRef} type="file" multiple hidden onChange={handleChange} />
    </motion.div>
  );
}
