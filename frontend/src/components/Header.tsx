import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 16 4 4 4-4" />
            <path d="M7 20V4" />
            <path d="m21 8-4-4-4 4" />
            <path d="M17 4v16" />
          </svg>
        </div>
        <span className="font-[var(--font-display)] text-xl font-extrabold tracking-tight text-[var(--text)]" style={{ fontFamily: 'var(--font-display)' }}>
          PacketDrop
        </span>
      </div>
      <ThemeToggle />
    </header>
  );
}
