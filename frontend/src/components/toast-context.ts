import { createContext, useContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export const useToast = () => useContext(ToastContext);
