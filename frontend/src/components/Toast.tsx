import { useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastContext, type ToastType } from './toast-context';

interface Toast { id: string; message: string; type: ToastType; }

const ACCENT: Record<ToastType, string> = {
  success: 'border-l-[var(--success)]',
  error: 'border-l-[var(--danger)]',
  info: 'border-l-[var(--accent)]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col-reverse gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              className={`pointer-events-auto rounded-lg border border-[var(--border)] border-l-[3px] bg-[var(--surface)] px-4 py-2.5 text-[13px] font-medium text-[var(--text)] shadow-lg ${ACCENT[t.type]}`}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
