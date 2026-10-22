import type { Audience, Submission } from "./types";

export const DAY = 864e5;

export const ago = (iso: string, now = Date.now()) => {
  const m = (now - new Date(iso).getTime()) / 6e4;
  if (m < 60) return `${Math.max(1, Math.round(m))}m ago`;
  if (m < 1440) return `${Math.round(m / 60)}h ago`;
  const d = Math.round(m / 1440);
  return d === 1 ? "Yesterday" : `${d}d ago`;
};

export const shortDate = (d: Date | string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const inRange = (s: Submission, rangeDays: number, now = Date.now()) =>
  !rangeDays || now - new Date(s.createdAt).getTime() <= rangeDays * DAY;

export const detailLine = (s: Submission) => {
  if (s.audience === "organization") return [s.org, s.answers.org_type].filter(Boolean).join(" · ");
  if (s.audience === "insurer") return [s.org, s.answers.ins_book && `${s.answers.ins_book} accounts`].filter(Boolean).join(" · ");
  return s.answers.describes ?? "";
};

export const AVATAR_COLORS: Record<Audience, [string, string]> = {
  organization: ["#E7EFFC", "#2459B8"],
  individual: ["#EFEAFB", "#6B4BC2"],
  insurer: ["#FFEDE5", "#C43D0A"],
};

export function toCsv(items: Submission[]) {
  const keys = [...new Set(items.flatMap((s) => Object.keys(s.answers)))];
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const header = ["received", "audience", "status", "name", "email", "organization", ...keys];
  const lines = items.map((s) => [s.createdAt, s.audience, s.status, s.name, s.email, s.org ?? "", ...keys.map((k) => s.answers[k] ?? "")].map(cell).join(","));
  return [header.join(","), ...lines].join("\n");
}

/** Counts answer values for one question within an audience. */
export function tally(items: Submission[], audience: Audience, key: string) {
  const m = new Map<string, number>();
  items.filter((s) => s.audience === audience && s.answers[key]).forEach((s) => m.set(s.answers[key], (m.get(s.answers[key]) ?? 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}
