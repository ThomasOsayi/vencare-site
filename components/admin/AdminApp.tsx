"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getSubmissionsRepository, type SubmissionsRepository } from "@/lib/submissions/repository";
import type { Status, Submission } from "@/lib/submissions/types";
import { inRange, toCsv } from "@/lib/submissions/utils";
import Drawer from "./Drawer";
import Insights from "./Insights";
import Overview from "./Overview";
import SubmissionsView, { type Tab } from "./SubmissionsView";

type View = "overview" | "submissions" | "insights";
const VIEWS: { id: View; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><rect x="2" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill="none" /><rect x="10" y="2" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill="none" /><rect x="2" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill="none" /><rect x="10" y="10" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>,
  },
  {
    id: "submissions",
    label: "Submissions",
    icon: <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 4.5h12M3 9h12M3 13.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>,
  },
  {
    id: "insights",
    label: "Insights",
    icon: <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M3 15V9M9 15V3M15 15v-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>,
  },
];
const RANGES = [7, 30, 90, 0];
type Props = { userName: string; email?: string; onSignOut?: () => void };

export default function AdminApp({ userName, email, onSignOut }: Props) {
  const [repo, setRepo] = useState<SubmissionsRepository | null>(null);
  const [items, setItems] = useState<Submission[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>("overview");
  const [range, setRange] = useState(30);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [status, setStatus] = useState<Status | "">("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    getSubmissionsRepository().then((r) => alive && setRepo(r));
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => (repo ? repo.subscribe(setItems, (e) => setError(e.message)) : undefined), [repo]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const toast = useCallback((t: string) => {
    setToastMsg(t);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 1800);
  }, []);

  const save = (p: Promise<void> | undefined, ok: string) =>
    p?.then(() => toast(ok)).catch((e: Error) => toast(`Couldn't save: ${e.message}`));

  const base = useMemo(() => (items ?? []).filter((s) => inRange(s, range, now)), [items, range, now]);
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return base
      .filter((s) => (tab === "all" || s.audience === tab) && (!status || s.status === status) && (!q || `${s.name} ${s.email} ${s.org ?? ""}`.toLowerCase().includes(q)))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [base, tab, status, query]);
  const newCount = (items ?? []).filter((s) => s.status === "new").length;
  const openItem = (items ?? []).find((s) => s.id === openId) ?? null;
  const closeDrawer = useCallback(() => setOpenId(null), []);

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `vencare-submissions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`Exported ${rows.length} rows`);
  };

  const title = VIEWS.find((v) => v.id === view)!.label;

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <svg width="26" height="30" viewBox="0 0 30 34" aria-hidden="true"><path d="M15 1.5L28 6v10.5c0 7.6-5.4 13.6-13 16-7.6-2.4-13-8.4-13-16V6z" fill="#fff" /><path d="M8.5 11l6.5 13 6.5-13" stroke="#FF5A1F" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <b>VenCare</b><span>Admin</span>
        </div>
        <nav className="nav" aria-label="Admin">
          {VIEWS.map((v) => (
            <button key={v.id} type="button" aria-current={view === v.id ? "page" : undefined} onClick={() => setView(v.id)}>
              {v.icon}
              <span className="lbl-full">{v.label}</span>
              {v.id === "submissions" && newCount > 0 && <span className="count" aria-label={`${newCount} new`}>{newCount}</span>}
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <div className="av">{userName.slice(0, 2).toUpperCase()}</div>
          <div className="who">{userName}<small>{repo?.isSample ? "Sample mode" : email ?? "Signed in"}</small></div>
          {onSignOut && (
            <button type="button" className="signout" onClick={onSignOut} aria-label="Sign out" title="Sign out">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 2.5H3.5a1 1 0 00-1 1v9a1 1 0 001 1H6M10.5 11l3-3-3-3M13.5 8H6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
        </div>
      </aside>

      <div className="main">
        <div className="top">
          <h1>{title}</h1>
          <div className="range" role="group" aria-label="Date range">
            {RANGES.map((r) => (
              <button key={r} type="button" aria-pressed={range === r} onClick={() => setRange(r)}>{r ? `${r}d` : "All"}</button>
            ))}
          </div>
          <div className="search">
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6" fill="none" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            <input
              type="search"
              placeholder="Search name, email, organization"
              aria-label="Search submissions"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) setView("submissions");
              }}
            />
          </div>
          <button className="btn" type="button" onClick={exportCsv} disabled={!items}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8M4.5 6.5L8 10l3.5-3.5M3 13.5h10" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Export CSV
          </button>
        </div>

        <div className="content">
          {repo?.isSample && (
            <div className="banner" role="note">
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M9 5.5v4M9 12.2v.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>
              Showing sample data. Live submissions will appear here once the form is connected to Firebase.
            </div>
          )}
          {error ? (
            <div className="card loading" role="alert">Couldn&apos;t load submissions: {error}</div>
          ) : !items ? (
            <div className="card loading">Loading submissions...</div>
          ) : view === "overview" ? (
            <Overview items={items} range={range} now={now} onOpen={setOpenId} />
          ) : view === "submissions" ? (
            <SubmissionsView base={base} rows={rows} tab={tab} setTab={setTab} status={status} setStatus={setStatus} selectedId={openId} onOpen={setOpenId} now={now} />
          ) : (
            <Insights key={range} items={base} />
          )}
        </div>
      </div>

      <Drawer
        item={openItem}
        onClose={closeDrawer}
        onStatus={(id, from, to) => save(repo?.updateStatus(id, from, to, userName), "Status updated")}
        onNote={(id, t) => save(repo?.addNote(id, t, userName), "Note saved")}
        toast={toast}
      />
      <div className={`toast${toastMsg ? " on" : ""}`} role="status">{toastMsg}</div>
    </div>
  );
}
