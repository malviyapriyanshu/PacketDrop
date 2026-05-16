import { motion } from 'framer-motion';
import { BarChart3, HardDrive, FileStack, ArrowUpRight } from 'lucide-react';
import type { FileMetadata, TransferHistory } from '../../types';
import { formatBytes } from '../../utils/format';

interface Props {
  files: FileMetadata[];
  history: TransferHistory[];
}

export default function QuickStatsCard({ files, history }: Props) {
  const totalStorage = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.12 }}
      className="glass-card p-5"
    >
      <div className="mb-4 flex items-center gap-2.5">
        <div className="icon-tile h-8 w-8 text-teal-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-indigo-400">
          <BarChart3 className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-bold text-slate-950 dark:text-white">Quick Stats</h3>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/[0.06]">
        <StatRow icon={<FileStack className="h-4 w-4" />} label="Files" value={String(files.length)} />
        <StatRow icon={<HardDrive className="h-4 w-4" />} label="Storage" value={formatBytes(totalStorage)} />
        <StatRow icon={<ArrowUpRight className="h-4 w-4" />} label="Transfers" value={String(history.length)} />
      </div>
    </motion.div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-3 py-3 last:border-b-0 dark:border-white/[0.04]">
      <div className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500">
        <div className="icon-tile h-7 w-7 text-slate-500 dark:border-white/[0.04] dark:bg-white/[0.02] dark:text-indigo-400">{icon}</div>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
      </div>
      <span className="text-base font-bold tabular-nums text-slate-950 dark:text-white">{value}</span>
    </div>
  );
}
