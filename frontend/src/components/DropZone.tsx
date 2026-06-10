import { useCallback, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { motion } from 'framer-motion';
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
      onClick={handleClick}
      onDragEnter={(e) => handleDrag(e, true)}
      onDragOver={(e) => handleDrag(e, true)}
      onDragLeave={(e) => handleDrag(e, false)}
      onDrop={handleDrop}
      whileHover={{ scale: 1.005, y: -1 }}
      whileTap={{ scale: 0.995 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={cn(
        "card flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed px-6 py-14 text-center transition-colors duration-150 select-none",
        dragging
          ? "border-[var(--accent)] bg-[var(--accent-soft)]"
          : "border-[var(--border)] hover:border-[var(--text-3)] hover:bg-[var(--surface-raised)]"
      )}
    >
      <motion.div
        animate={dragging ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={dragging ? { repeat: Infinity, duration: 1.2, ease: "easeInOut" } : {}}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
          dragging ? "bg-[var(--accent)] text-white" : "bg-[var(--accent-soft)] text-[var(--accent)]"
        )}
      >
        <Upload className="h-5 w-5" />
      </motion.div>

      <div>
        <p className="text-[15px] font-semibold text-[var(--text)]">
          {dragging ? 'Release to upload' : 'Drop files or click to browse'}
        </p>
        <p className="mt-1 text-[13px] text-[var(--text-2)]">
          Any file type up to 10 GB
        </p>
      </div>

      <input ref={inputRef} type="file" multiple hidden onChange={handleChange} />
    </motion.div>
  );
}
