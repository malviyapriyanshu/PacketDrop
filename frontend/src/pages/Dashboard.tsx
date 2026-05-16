import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import QRCodeCard from '../components/Sidebar/QRCodeCard';
import ConnectionInfoCard from '../components/Sidebar/ConnectionInfoCard';
import QuickStatsCard from '../components/Sidebar/QuickStatsCard';
import DropZone from '../components/DropZone';
import ProgressList from '../components/ProgressList';
import FileGrid from '../components/FileGrid';
import HistoryTable from '../components/HistoryTable';
import { useToast } from '../components/toast-context';
import { getFiles, getHistory, clearHistory, deleteFile, uploadFile, getServerInfo } from '../services/api';
import { connectWebSocket, onProgress, onComplete } from '../services/websocket';
import { formatBytes } from '../utils/format';
import type { FileMetadata, TransferHistory, UploadState, ServerInfo } from '../types';

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
      addToast('Transfer history cleared', 'info');
      refreshHistory();
    } catch {
      addToast('Failed to clear history', 'error');
    }
  }, [addToast, refreshHistory]);

  return (
    <div className="min-h-screen">
      <div className="relative z-10 mx-auto w-full max-w-[1360px] px-4 pb-10 sm:px-6 lg:px-8">
        <Header />

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <main className="flex min-w-0 flex-col gap-6">
            <DropZone onFiles={handleFiles} />
            <ProgressList uploads={uploads} />
            <FileGrid files={files} onDelete={handleDelete} />
            <HistoryTable history={history} onClear={handleClearHistory} />
          </main>

          <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
            <QRCodeCard info={info} />
            <ConnectionInfoCard info={info} />
            <QuickStatsCard files={files} history={history} />
          </aside>
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-5 text-center">
          <p className="text-xs font-medium tracking-wide text-slate-500">
            PacketDrop v1.0 - Local Network File Transfer
          </p>
        </footer>
      </div>
    </div>
  );
}
