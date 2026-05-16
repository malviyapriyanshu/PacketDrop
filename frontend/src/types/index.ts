export interface ServerInfo {
  appName: string;
  localIP: string;
  port: number;
  url: string;
  qrDataUrl: string;
  maxFileSize: number;
  maxFileSizeFormatted: string;
}

export interface FileMetadata {
  filename: string;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  modified: string;
}

export interface TransferHistory {
  filename: string;
  size: number;
  timestamp: string;
  senderIp: string;
  checksum: string;
}

export interface UploadProgress {
  filename: string;
  bytesReceived: number;
  totalBytes: number;
  percent: number;
  speed: string;
  eta: string;
  bytesFormatted: string;
  totalFormatted: string;
}

export interface UploadResult {
  filename: string;
  size: number;
  sizeFormatted: string;
  mimeType: string;
  checksum: string;
  timestamp: string;
}

export interface UploadResponse {
  success: boolean;
  files: UploadResult[];
  count: number;
  message?: string;
}

export interface UploadState {
  id: string;
  file: File;
  progress: number;
  speed: string;
  eta: string;
  status: 'uploading' | 'complete' | 'error';
  bytesFormatted: string;
  totalFormatted: string;
}
