const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '0 B';
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), UNITS.length - 1);
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${UNITS[i]}`;
}

export function formatSpeed(bps: number): string {
  if (!bps || bps <= 0) return '0 B/s';
  return `${formatBytes(bps)}/s`;
}

export function formatETA(seconds: number): string {
  if (!seconds || seconds <= 0 || !isFinite(seconds)) return '—';
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins < 60) return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ${mins % 60}m`;
}

export type FileIconName = 'image' | 'film' | 'music' | 'file-text' | 'archive' | 'code' | 'file';

const EXT_TO_ICON: Record<string, FileIconName> = {
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  mp4: 'film', mov: 'film', avi: 'film', mkv: 'film', webm: 'film',
  mp3: 'music', wav: 'music', flac: 'music', aac: 'music',
  pdf: 'file-text', doc: 'file-text', docx: 'file-text',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
  js: 'code', ts: 'code', py: 'code', html: 'code', css: 'code', json: 'code', java: 'code',
  txt: 'file-text', md: 'file-text', csv: 'file-text', log: 'file-text',
};

export function getFileIconName(filename: string): FileIconName {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return EXT_TO_ICON[ext] || 'file';
}

// Keep backward compat — used nowhere now but safe to leave
export function getFileIcon(filename: string): string {
  const map: Record<FileIconName, string> = {
    image: '🖼️', film: '🎬', music: '🎵', 'file-text': '📄',
    archive: '📦', code: '💻', file: '📎',
  };
  return map[getFileIconName(filename)];
}

