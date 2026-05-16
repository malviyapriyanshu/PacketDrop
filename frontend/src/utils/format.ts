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

const FILE_ICONS: Record<string, string> = {
  image: '🖼️', video: '🎬', audio: '🎵', pdf: '📄',
  zip: '📦', code: '💻', text: '📝', default: '📎',
};

const EXT_MAP: Record<string, string> = {
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  mp4: 'video', mov: 'video', avi: 'video', mkv: 'video', webm: 'video',
  mp3: 'audio', wav: 'audio', flac: 'audio', aac: 'audio',
  pdf: 'pdf', zip: 'zip', rar: 'zip', '7z': 'zip', tar: 'zip', gz: 'zip',
  js: 'code', ts: 'code', py: 'code', html: 'code', css: 'code', json: 'code',
  txt: 'text', md: 'text', csv: 'text', log: 'text',
};

export function getFileIcon(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[EXT_MAP[ext] || 'default'];
}
