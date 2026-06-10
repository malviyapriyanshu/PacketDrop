import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import ConnectStrip from '../components/Sidebar/ConnectStrip';
import DropZone from '../components/DropZone';
import ProgressList from '../components/ProgressList';
import FileGrid from '../components/FileGrid';
import HistoryTable from '../components/HistoryTable';
import { useToast } from '../components/toast-context';
import { getFiles, getHistory, clearHistory, deleteFile, uploadFile, getServerInfo } from '../services/api';
import { connectWebSocket, onProgress, onComplete } from '../services/websocket';
import { formatBytes } from '../utils/format';
import type { FileMetadata, TransferHistory, UploadState, ServerInfo } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 280, damping: 24 } },
};

export default function Dashboard() {
  const [info, setInfo] = useState<ServerInfo | null>(null);
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [history, setHistory] = useState<TransferHistory[]>([]);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const { addToast } = useToast();

  const refreshFiles = useCallback(() => { getFiles().then((d) => setFiles(d.files)).catch(() => {}); }, []);
  const refreshHistory = useCallback(() => { getHistory().then((d) => setHistory(d.history)).catch(() => {}); }, []);

  useEffect(() => {
    getServerInfo().then(setInfo).catch(() => setInfo(null));
    refreshFiles();
    refreshHistory();
    connectWebSocket();

    const unsub1 = onProgress((data) => {
      setUploads((prev) => prev.map((u) =>
        u.file.name === data.filename
          ? { ...u, speed: data.speed, eta: data.eta }
          : u
      ));
    });

    const unsub2 = onComplete(() => {
      refreshFiles();
      refreshHistory();
    });

    return () => { unsub1(); unsub2(); };
  }, [refreshFiles, refreshHistory]);

  const handleFiles = useCallback((fileList: File[]) => {
    for (const file of fileList) {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const state: UploadState = {
        id, file, progress: 0, speed: '—', eta: '—', status: 'uploading',
        bytesFormatted: '0 B', totalFormatted: formatBytes(file.size),
      };
      setUploads((prev) => [state, ...prev]);

      uploadFile(file, (percent, loaded, total) => {
        setUploads((prev) => prev.map((u) =>
          u.id === id ? { ...u, progress: percent, bytesFormatted: formatBytes(loaded), totalFormatted: formatBytes(total) } : u
        ));
      })
        .then(() => {
          setUploads((prev) => prev.map((u) => u.id === id ? { ...u, status: 'complete', progress: 100 } : u));
          addToast(`Uploaded ${file.name}`, 'success');
          refreshFiles();
          refreshHistory();
        })
        .catch(() => {
          setUploads((prev) => prev.map((u) => u.id === id ? { ...u, status: 'error' } : u));
          addToast(`Failed to upload ${file.name}`, 'error');
        });
    }
  }, [addToast, refreshFiles, refreshHistory]);

  const handleDelete = useCallback(async (filename: string) => {
    try {
      await deleteFile(filename);
      addToast(`Deleted ${filename}`, 'info');
      refreshFiles();
    } catch {
      addToast(`Failed to delete ${filename}`, 'error');
    }
  }, [addToast, refreshFiles]);

  const handleClearHistory = useCallback(async () => {
    try {
      await clearHistory();
      addToast('History cleared', 'info');
      refreshHistory();
    } catch {
      addToast('Failed to clear history', 'error');
    }
  }, [addToast, refreshHistory]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto w-full max-w-[800px] px-4 pb-12 sm:px-6">
        <Header />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-6"
        >
          <motion.div variants={itemVariants}>
            <ConnectStrip info={info} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <DropZone onFiles={handleFiles} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ProgressList uploads={uploads} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FileGrid files={files} onDelete={handleDelete} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <HistoryTable history={history} onClear={handleClearHistory} />
          </motion.div>
        </motion.div>

        <footer className="mt-10 pt-6 text-center">
          <p className="text-[11px] tracking-wide text-[var(--text-3)]" style={{ fontFamily: 'var(--font-mono)' }}>
            PacketDrop
          </p>
        </footer>
      </div>
    </div>
  );
}
