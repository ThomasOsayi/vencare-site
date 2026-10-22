"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { AUDIENCE_LABEL, STATUS_LABEL, type Status, type Submission } from "@/lib/submissions/types";
import { AVATAR_COLORS, ago, initials } from "@/lib/submissions/utils";

const STAGES = Object.keys(STATUS_LABEL) as Status[];

/** Fields shown as "key detail" tiles, per audience, in order. */
const DETAILS: Record<Submission["audience"], [string, string][]> = {
  organization: [["org_name", "Organization"], ["org_type", "Type"], ["locations", "Locations"], ["role", "Role"]],
  insurer: [["ins_company", "Company"], ["ins_role", "Role"], ["ins_book", "Restaurant accounts"]],
  individual: [["describes", "Describes them"]],
};

/** Survey questions, worded as they appear on the form. */
const QUESTIONS: Record<string, string> = {
  has_approach: "Do you have a clear approach to severe allergic reactions today?",
  most_useful: "What would be most useful?",
  open_to_more: "Open to learning more?",
  concerned_access: "Ever worried about epinephrine access outside the home?",
  matters_most: "What would matter most to you?",
  ready_sign: "Would a VenCare Ready sign make you more likely to choose a venue?",
  ins_interest: "What are you interested in?",
};

/** Free-text answers, shown as quotes. */
const FREE_TEXT: Record<string, string> = {
  notes: "Anything else",
  help_most: "What they want VenCare to help with",
  ins_notes: "Anything else",
};

const tone = (v: string) => {
  const s = v.toLowerCase();
  if (/^(yes|yes, definitely)$/.test(s)) return "good";
  if (/^(no|not right now|no difference)$/.test(s)) return "warn";
  return "";
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });

type Props = {
  item: Submission | null;
  index: number;
  total: number;
  now: number;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onStatus: (id: string, from: Status, to: Status) => void;
  onNote: (id: string, text: string) => void;
  toast: (t: string) => void;
};

export default function SubmissionModal({ item, index, total, now, onPrev, onNext, onClose, onStatus, onNote, toast }: Props) {
  const [note, setNote] = useState("");
  const [shown, setShown] = useState<Submission | null>(item);
  const dialog = useRef<HTMLDivElement>(null);
  const open = !!item;

  // Keep the last item rendered while the close animation plays.
  useEffect(() => {
    if (item) setShown(item);
  }, [item]);

  useEffect(() => {
    setNote("");
  }, [item?.id]);

  // Focus, scroll lock, keyboard shortcuts.
  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => dialog.current?.focus(), 30);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("textarea, input, select");
      if (e.key === "Escape") return onClose();
      if (typing) return;
      if (e.key === "ArrowRight" || e.key === "j") onNext();
      if (e.key === "ArrowLeft" || e.key === "k") onPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKey);
      prevFocus?.focus?.();
    };
  }, [open, onClose, onNext, onPrev]);

  // Keep Tab focus inside the dialog.
  const trapTab = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !dialog.current) return;
    const f = dialog.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, select, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const s = item ?? shown;
  if (!s) return null;

  const stageIdx = STAGES.indexOf(s.status);
  const nextStage = STAGES[stageIdx + 1];
  const details = DETAILS[s.audience].filter(([k]) => s.answers[k]);
  const questions = Object.keys(QUESTIONS).filter((k) => s.answers[k]);
  const quotes = Object.keys(FREE_TEXT).filter((k) => s.answers[k]);
  const known = new Set([...details.map(([k]) => k), ...questions, ...quotes]);
  const other = Object.entries(s.answers).filter(([k]) => !known.has(k));
  const [bg, fg] = AVATAR_COLORS[s.audience];

  const saveNote = () => {
    if (!note.trim()) return;
    onNote(s.id, note);
    setNote("");
  };

  return (
    <div className={`modal-root${open ? " on" : ""}`} aria-hidden={!open}>
      <div className="modal-scrim" onClick={onClose} />
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="m-name"
        tabIndex={-1}
        ref={dialog}
        onKeyDown={trapTab}
        inert={!open}
      >
        {/* Header */}
        <header className="m-head">
          <div className="m-who">
            <span className="m-av" style={{ background: bg, color: fg }}>{initials(s.name)}</span>
            <div className="m-id">
              <div className="m-tags">
                <span className={`aud ${s.audience}`}>{AUDIENCE_LABEL[s.audience]}</span>
                <span className={`st ${s.status}`}>{STATUS_LABEL[s.status]}</span>
              </div>
              <h2 id="m-name">{s.name}</h2>
              <p className="m-sub">
                {s.org && <span>{s.org}</span>}
                <a href={`mailto:${s.email}`}>{s.email}</a>
                <span title={fmt(s.createdAt)}>Received {ago(s.createdAt, now).toLowerCase()}</span>
              </p>
            </div>
          </div>
          <div className="m-nav">
            <span className="m-count">{index + 1} of {total}</span>
            <button type="button" className="icon-btn" onClick={onPrev} disabled={index <= 0} aria-label="Previous submission" title="Previous (←)">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className="icon-btn" onClick={onNext} disabled={index >= total - 1} aria-label="Next submission" title="Next (→)">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button type="button" className="icon-btn" onClick={onClose} aria-label="Close" title="Close (Esc)">
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </button>
          </div>
        </header>

        {/* Quick actions */}
        <div className="m-actions">
          <a className="btn primary" href={`mailto:${s.email}?subject=${encodeURIComponent("VenCare")}`}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><rect x="2" y="3.5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M2.5 4.5L8 9l5.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" /></svg>
            Email {s.name.split(" ")[0]}
          </a>
          <button type="button" className="btn" onClick={() => { navigator.clipboard?.writeText(s.email); toast("Email copied"); }}>
            <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><rect x="5" y="5" width="8.5" height="8.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M10.5 5V3.5A1 1 0 009.5 2.5h-6a1 1 0 00-1 1v6a1 1 0 001 1H5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
            Copy email
          </button>
          {nextStage && (
            <button type="button" className="btn advance" onClick={() => onStatus(s.id, s.status, nextStage)}>
              Move to {STATUS_LABEL[nextStage]}
              <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          )}
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              navigator.clipboard?.writeText(`${location.origin}/admin#s=${s.id}`);
              toast("Link copied");
            }}
          >
            Copy link
          </button>
        </div>

        <div className="m-body">
          {/* Left: what they told us */}
          <section className="m-main" aria-label="Responses">
            {details.length > 0 && (
              <div className="m-tiles">
                {details.map(([k, label]) => (
                  <div className="m-tile" key={k}>
                    <small>{label}</small>
                    <b>{s.answers[k]}</b>
                  </div>
                ))}
              </div>
            )}

            {questions.length > 0 && (
              <div className="m-block">
                <h3>Survey answers</h3>
                <ol className="m-qs">
                  {questions.map((k) => (
                    <li key={k}>
                      <span className="m-q">{QUESTIONS[k]}</span>
                      <span className={`m-a ${tone(s.answers[k])}`}>{s.answers[k]}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {quotes.map((k) => (
              <div className="m-block" key={k}>
                <h3>{FREE_TEXT[k]}</h3>
                <blockquote className="m-quote">{s.answers[k]}</blockquote>
              </div>
            ))}

            {other.length > 0 && (
              <div className="m-block">
                <h3>Other fields</h3>
                <dl className="kv">
                  {other.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
            )}

            {!details.length && !questions.length && !quotes.length && !other.length && (
              <p className="q-n">Only name and email were submitted.</p>
            )}
          </section>

          {/* Right: what we're doing about it */}
          <aside className="m-side" aria-label="Follow-up">
            <div className="m-block">
              <h3>Status</h3>
              <ol className="stepper">
                {STAGES.map((st, i) => (
                  <li key={st}>
                    <button
                      type="button"
                      className={`step ${st}${i < stageIdx ? " done" : ""}${i === stageIdx ? " current" : ""}`}
                      aria-pressed={i === stageIdx}
                      onClick={() => onStatus(s.id, s.status, st)}
                    >
                      <span className="step-dot" aria-hidden="true">
                        {i < stageIdx ? (
                          <svg width="10" height="10" viewBox="0 0 12 12"><path d="M2.5 6.2l2.3 2.3L9.5 3.8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : null}
                      </span>
                      {STATUS_LABEL[st]}
                    </button>
                  </li>
                ))}
              </ol>
            </div>

            <div className="m-block">
              <h3>Add a note</h3>
              <textarea
                className="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) saveNote(); }}
                placeholder="Called, left a voicemail, sent pricing..."
                aria-label="Internal note"
              />
              <div className="row m-note-row">
                <span className="q-n hide-m">Ctrl/⌘ + Enter to save</span>
                <button className="btn" type="button" disabled={!note.trim()} onClick={saveNote}>Save note</button>
              </div>
            </div>

            <div className="m-block">
              <h3>Activity</h3>
              <div className="tl">
                {[...s.notes].reverse().map((n) => (
                  <div key={n.id}>
                    <span><b>{n.by}</b> {n.text}<br /><small className="q-n">{fmt(n.at)}</small></span>
                  </div>
                ))}
                <div><span><b>Submitted</b> via {s.source === "survey" ? "survey" : "website form"}<br /><small className="q-n">{fmt(s.createdAt)}</small></span></div>
              </div>
            </div>
          </aside>
        </div>

        <footer className="m-foot hide-m">
          <span><kbd>←</kbd> <kbd>→</kbd> browse</span>
          <span><kbd>Esc</kbd> close</span>
        </footer>
      </div>
    </div>
  );
}
