import type { CSSProperties } from "react";

/** Inline style helper for staggered reveal delays: <div style={delay(0.1)}> */
export const delay = (s: number): CSSProperties => ({ ["--d" as string]: `${s}s` });
export const barWidth = (pct: number): CSSProperties => ({ ["--w" as string]: `${pct}%` });

export function LogoMark({ dark = false }: { dark?: boolean }) {
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
      <path d="M15 1.5L28 6v10.5c0 7.6-5.4 13.6-13 16-7.6-2.4-13-8.4-13-16V6z" fill={dark ? "#FFFFFF" : "#0B2345"} />
      <path d="M8.5 11l6.5 13 6.5-13" stroke={dark ? "#FF5A1F" : "#FFC928"} strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 11l6-6M6 5h5v5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SmallCheck() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="#E3F5EC" />
      <path d="M4.8 8.2l2.1 2.1 4.3-4.6" stroke="#178A5B" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function NavyCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
      <circle cx="11" cy="11" r="10" fill="#0B2345" />
      <path d="M6.5 11.5l3 3 6-6.5" stroke="#FFC928" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
