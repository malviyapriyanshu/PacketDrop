import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ServerInfo } from '../../types';

interface Props {
  info: ServerInfo | null;
}

export default function ConnectStrip({ info }: Props) {
  const [copied, setCopied] = useState(false);
  const online = Boolean(info);

  const copyUrl = async () => {
    if (!info) return;
    await navigator.clipboard.writeText(info.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
      {/* QR Code */}
      <div className="flex h-[120px] w-[120px] shrink-0 items-center justify-center self-center rounded-lg border border-[var(--border)] bg-white p-2 sm:self-auto">
        {info?.qrDataUrl ? (
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            src={info.qrDataUrl}
            alt="QR Code"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
        )}
      </div>

      {/* Connection details */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${online ? 'bg-[var(--success)]' : 'bg-[var(--text-3)] animate-pulse'}`} />
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--text-2)]">
            {online ? 'Connected' : 'Connecting…'}
          </span>
        </div>

        {/* URL row */}
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2">
          <code className="min-w-0 flex-1 truncate text-[13px] text-[var(--text)]" style={{ fontFamily: 'var(--font-mono)' }}>
            {info?.url || '…'}
          </code>
          <motion.button
            onClick={copyUrl}
            disabled={!info}
            whileTap={{ scale: 0.85 }}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-3)] hover:text-[var(--text)] disabled:opacity-30 cursor-pointer"
            title="Copy URL"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={copied ? "check" : "copy"}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-[var(--text-3)]">
          <span>IP <strong className="font-medium text-[var(--text-2)]">{info?.localIP ?? '—'}</strong></span>
          <span>Port <strong className="font-medium text-[var(--text-2)]">{info?.port ?? '—'}</strong></span>
          <span>Limit <strong className="font-medium text-[var(--text-2)]">{info?.maxFileSizeFormatted ?? '—'}</strong></span>
        </div>
      </div>
    </div>
  );
}
