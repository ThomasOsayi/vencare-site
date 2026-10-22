"use client";

import { useEffect, useRef, useState } from "react";
import { ANSWER_LABEL, AUDIENCE_LABEL, STATUS_LABEL, type Status, type Submission } from "@/lib/submissions/types";
import { shortDate } from "@/lib/submissions/utils";

type Props = {
  item: Submission | null;
  onClose: () => void;
  onStatus: (id: string, s: Status) => void;
  onNote: (id: string, text: string) => void;
  toast: (t: string) => void;
};

export default function Drawer({ item, onClose, onStatus, onNote, toast }: Props) {
  const [note, setNote] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = !!item;

  useEffect(() => {
    if (!open) return;
    setNote("");
    const t = setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, item?.id, onClose]);

  return (
    <>
      <div className={`scrim${open ? " on" : ""}`} onClick={onClose} />
      <aside className={`drawer${open ? " on" : ""}`} role="dialog" aria-modal="true" aria-hidden={!open} aria-labelledby="dr-name" inert={!open}>
        {item && (
          <>
            <div className="dr-h">
              <div>
                <span className={`aud ${item.audience}`}>{AUDIENCE_LABEL[item.audience]}</span>
                <h2 id="dr-name" style={{ marginTop: 8 }}>{item.name}</h2>
                <small>{[item.org, item.email].filter(Boolean).join(" · ")}</small>
              </div>
              <button ref={closeRef} className="x-btn" type="button" onClick={onClose} aria-label="Close details">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="#0B2345" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="dr-b">
              <div className="dr-sec">
                <h3>Status</h3>
                <div className="row">
                  <select className="sel" aria-label="Status" value={item.status} onChange={(e) => { onStatus(item.id, e.target.value as Status); toast("Status updated"); }}>
                    {(Object.keys(STATUS_LABEL) as Status[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                  <span className="q-n">Received {new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                </div>
              </div>
              <div className="dr-sec">
                <h3>Responses</h3>
                <dl className="kv">
                  {Object.entries(item.answers).map(([k, v]) => (
                    <div key={k}><dt>{ANSWER_LABEL[k] ?? k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="dr-sec">
                <h3>Internal note</h3>
                <textarea className="note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note for the team..." aria-label="Internal note" />
                <div className="row" style={{ marginTop: 8 }}>
                  <button className="btn" type="button" disabled={!note.trim()} onClick={() => { onNote(item.id, note); setNote(""); toast("Note saved"); }}>Save note</button>
                </div>
              </div>
              <div className="dr-sec">
                <h3>Activity</h3>
                <div className="tl">
                  {[...item.notes].reverse().map((n) => (
                    <div key={n.id}><span><b>{n.by}</b> {n.text}<br /><small className="q-n">{new Date(n.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</small></span></div>
                  ))}
                  <div><span><b>Submitted</b> via {item.source === "survey" ? "survey" : "website form"}<br /><small className="q-n">{shortDate(item.createdAt)}</small></span></div>
                </div>
              </div>
            </div>
            <div className="dr-f">
              <a className="btn primary" href={`mailto:${item.email}`}>Email</a>
              <button className="btn" type="button" onClick={() => { navigator.clipboard?.writeText(item.email); toast("Email copied"); }}>Copy email</button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
