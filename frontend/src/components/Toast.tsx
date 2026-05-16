import { useState, useCallback, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastContext, type ToastType } from './toast-context';

interface Toast { id: string; message: string; type: ToastType; }

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const icon = (type: Toast['type']) => {
    if (type === 'success') return <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 dark:text-emerald-400" />;
    if (type === 'error') return <AlertCircle className="h-4 w-4 shrink-0 text-red-700 dark:text-red-400" />;
    return <Info className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400" />;
  };

  const border = (type: Toast['type']) => {
    if (type === 'success') return 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/20 dark:bg-emerald-500/10';
    if (type === 'error') return 'border-red-200 bg-red-50 dark:border-red-500/20 dark:bg-red-500/10';
    return 'border-blue-200 bg-blue-50 dark:border-blue-500/20 dark:bg-blue-500/10';
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="pointer-events-none fixed left-4 right-4 top-4 z-50 flex flex-col gap-2.5 sm:left-auto sm:w-80">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className={`pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-3 text-[13px] font-semibold text-slate-800 shadow-lg shadow-slate-900/10 dark:text-slate-200 dark:shadow-2xl dark:backdrop-blur-md ${border(t.type)}`}
            >
              {icon(t.type)}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
