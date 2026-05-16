import { motion } from 'framer-motion';
import { QrCode, Download } from 'lucide-react';
import type { ServerInfo } from '../../types';

interface Props {
  info: ServerInfo | null;
}

export default function QRCodeCard({ info }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="icon-tile h-8 w-8 text-teal-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
          <QrCode className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-950 dark:text-white">Scan to Connect</h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Open from a phone or tablet</p>
        </div>
      </div>

      <div className="mx-auto flex aspect-square w-full max-w-[210px] items-center justify-center rounded-lg border border-slate-200 bg-white p-3 dark:border-white/20 dark:bg-white dark:shadow-[0_0_30px_rgba(255,255,255,0.1)]">
        {info?.qrDataUrl ? (
          <img src={info.qrDataUrl} alt="QR Code" className="h-full w-full object-contain" />
        ) : (
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-teal-700 border-t-transparent dark:border-indigo-500 dark:border-t-transparent" />
        )}
      </div>

      {info?.qrDataUrl ? (
        <a
          href={info.qrDataUrl}
          download="packetdrop-qr.png"
          className="btn-secondary mt-4 w-full"
        >
          <Download className="h-3.5 w-3.5" />
          Download QR
        </a>
      ) : (
        <button className="btn-secondary mt-4 w-full" disabled>
          <Download className="h-3.5 w-3.5" />
          Waiting for server
        </button>
      )}
    </motion.div>
  );
}
