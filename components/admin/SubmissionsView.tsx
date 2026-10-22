"use client";

import { AUDIENCE_LABEL, STATUS_LABEL, type Audience, type Status, type Submission } from "@/lib/submissions/types";
import { ago, detailLine, shortDate } from "@/lib/submissions/utils";

export type Tab = "all" | Audience;

type Props = {
  base: Submission[];
  rows: Submission[];
  tab: Tab;
  setTab: (t: Tab) => void;
  status: Status | "";
  setStatus: (s: Status | "") => void;
  selectedId: string | null;
  onOpen: (id: string) => void;
  now: number;
};

export default function SubmissionsView({ base, rows, tab, setTab, status, setStatus, selectedId, onOpen, now }: Props) {
  const tabs: [Tab, string, number][] = [
    ["all", "All", base.length],
    ["organization", "Venues / orgs", base.filter((s) => s.audience === "organization").length],
    ["individual", "Individuals", base.filter((s) => s.audience === "individual").length],
    ["insurer", "Insurers", base.filter((s) => s.audience === "insurer").length],
  ];
  return (
    <section className="view on">
      <div className="card">
        <div className="toolbar">
          <div className="tabs" role="group" aria-label="Audience">
            {tabs.map(([k, l, n]) => (
              <button key={k} type="button" aria-pressed={tab === k} onClick={() => setTab(k)}>
                {l}<span>{n}</span>
              </button>
            ))}
          </div>
          <select className="sel" aria-label="Status filter" value={status} onChange={(e) => setStatus(e.target.value as Status | "")}>
            <option value="">All statuses</option>
            {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
          </select>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr><th>Name</th><th>Audience</th><th className="hide-m">Organization / detail</th><th className="hide-m">Received</th><th>Status</th></tr>
            </thead>
            <tbody>
              {rows.length ? rows.map((s) => (
                <tr
                  key={s.id}
                  className={selectedId === s.id ? "sel" : undefined}
                  onClick={() => onOpen(s.id)}
                  onKeyDown={(e) => e.key === "Enter" && onOpen(s.id)}
                  tabIndex={0}
                  aria-label={`Open ${s.name}`}
                >
                  <td><span className="nm">{s.name}</span><small>{s.email}</small></td>
                  <td><span className={`aud ${s.audience}`}>{AUDIENCE_LABEL[s.audience]}</span></td>
                  <td className="hide-m">{detailLine(s)}</td>
                  <td className="hide-m">{ago(s.createdAt, now)}<small>{shortDate(s.createdAt)}</small></td>
                  <td><span className={`st ${s.status}`}>{STATUS_LABEL[s.status]}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="empty">No submissions match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="tfoot"><span>{rows.length} submission{rows.length === 1 ? "" : "s"}</span><span>Click a row for details</span></div>
      </div>
    </section>
  );
}
