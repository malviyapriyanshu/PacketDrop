import axios from 'axios';
import type { ServerInfo, FileMetadata, TransferHistory, UploadResponse } from '../types';

const api = axios.create({ baseURL: '/api' });

export async function getServerInfo(): Promise<ServerInfo> {
  const { data } = await api.get('/server-info');
  return data;
}

export async function getFiles(): Promise<{ files: FileMetadata[]; count: number }> {
  const { data } = await api.get('/files');
  return data;
}

export async function deleteFile(filename: string): Promise<void> {
  await api.delete(`/files/${encodeURIComponent(filename)}`);
}

export async function getHistory(): Promise<{ history: TransferHistory[]; count: number }> {
  const { data } = await api.get('/history');
  return data;
}

export async function clearHistory(): Promise<void> {
  await api.delete('/history');
}

export function uploadFile(
  file: File,
  onProgress: (percent: number, loaded: number, total: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100), e.loaded, e.total);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) resolve(JSON.parse(xhr.responseText) as UploadResponse);
      else reject(new Error(`Upload failed: ${xhr.status}`));
    };

    xhr.onerror = () => reject(new Error('Network error'));
    xhr.send(formData);
  });
}
