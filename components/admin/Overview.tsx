"use client";

import { useEffect, useMemo, useState } from "react";
import { AUDIENCE_LABEL, STATUS_LABEL, type Status, type Submission } from "@/lib/submissions/types";
import { AVATAR_COLORS, DAY, ago, inRange, initials, shortDate } from "@/lib/submissions/utils";

type Props = { items: Submission[]; range: number; now: number; onOpen: (id: string) => void };

function Kpis({ items, range, now }: Omit<Props, "onOpen">) {
  const cur = items.filter((s) => inRange(s, range, now));
  const prev = range
    ? items.filter((s) => {
        const age = now - new Date(s.createdAt).getTime();
        return age > range * DAY && age <= 2 * range * DAY;
      })
    : [];
  const diff = cur.length - prev.length;
  const by = (a: Submission["audience"]) => cur.filter((s) => s.audience === a).length;
  const kpis = [
    { l: "Total responses", v: cur.length, d: range ? <><b>{diff >= 0 ? "+" : ""}{diff}</b> vs prior {range}d</> : "All time", hi: true },
    { l: AUDIENCE_LABEL.organization + "s", dot: AVATAR_COLORS.organization[1], v: by("organization"), d: "Restaurant & venue leads" },
    { l: "Individuals", dot: AVATAR_COLORS.individual[1], v: by("individual"), d: "Guests and families" },
    { l: "Insurers", dot: AVATAR_COLORS.insurer[1], v: by("insurer"), d: "Carriers, MGAs, brokers" },
    { l: "Awaiting review", v: cur.filter((s) => s.status === "new").length, d: "Status: New" },
  ];
  return (
    <div className="kpis">
      {kpis.map((k) => (
        <div key={k.l} className={`card kpi${k.hi ? " hi" : ""}`}>
          <span className="l">{k.dot && <i className="dot" style={{ background: k.dot }} />}{k.l}</span>
          <span className="v">{k.v}</span>
          <span className="d">{k.d}</span>
        </div>
      ))}
    </div>
  );
}

function WeeklyChart({ items, now }: { items: Submission[]; now: number }) {
  const [hover, setHover] = useState<number | null>(null);
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const cols = useMemo(() => {
    const out: { start: Date; end: Date; n: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const end = new Date(now - i * 7 * DAY);
      const start = new Date(end.getTime() - 7 * DAY);
      out.push({ start, end, n: items.filter((s) => { const t = new Date(s.createdAt); return t > start && t <= end; }).length });
    }
    return out;
  }, [items, now]);
  const max = Math.max(4, Math.ceil(Math.max(...cols.map((c) => c.n)) / 4) * 4);
  const h = hover !== null ? cols[hover] : null;

  return (
    <div className="chart" role="img" aria-label={`Responses per week for the last 8 weeks: ${cols.map((c) => `${shortDate(c.start)} ${c.n}`).join(", ")}`}>
      <div className="yax" aria-hidden="true">{[max, max * 0.75, max * 0.5, max * 0.25, 0].map((v) => <span key={v}>{v}</span>)}</div>
      <div className="plot" aria-hidden="true">
        {cols.map((c, i) => (
          <div key={i} className={`col${i === cols.length - 1 ? " last" : ""}`} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span className="lbl">{c.n}</span>
            <div className="bar" style={{ height: grown && c.n ? `max(3px, calc(${(c.n / max) * 100}% - 18px))` : 0 }} />
            <span className="x">{shortDate(c.start)}</span>
            {hover === i && h && (
              <div className="tip on" style={{ left: "50%", bottom: `calc(${(c.n / max) * 100}% + 8px)`, top: "auto", transform: "translateX(-50%)" }}>
                <b>{h.n}</b> responses<br />{shortDate(h.start)} to {shortDate(h.end)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowUp({ items, now, onOpen }: Omit<Props, "range">) {
  const list = items
    .filter((s) => s.status === "new" && s.audience !== "individual")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);
  if (!list.length) return <p className="q-n">All caught up.</p>;
  return (
    <div className="list">
      {list.map((s) => (
        <button key={s.id} type="button" className="li" onClick={() => onOpen(s.id)}>
          <span className="li-av" style={{ background: AVATAR_COLORS[s.audience][0], color: AVATAR_COLORS[s.audience][1] }}>{initials(s.name)}</span>
          <span><span className="li-name">{s.name}</span><small>{s.org}</small></span>
          <span className="when">{ago(s.createdAt, now)}</span>
        </button>
      ))}
    </div>
  );
}

function Pipeline({ items }: { items: Submission[] }) {
  const leads = items.filter((s) => s.audience !== "individual");
  const tot = leads.length || 1;
  return (
    <div className="pipe">
      {(Object.keys(STATUS_LABEL) as Status[]).map((k) => {
        const n = leads.filter((s) => s.status === k).length;
        return (
          <div key={k} className="stage">
            <small><span className={`st ${k}`}>{STATUS_LABEL[k]}</span></small>
            <b>{n}</b>
            <div className="meter"><i style={{ width: `${(n / tot) * 100}%` }} /></div>
          </div>
        );
      })}
    </div>
  );
}

export default function Overview({ items, range, now, onOpen }: Props) {
  return (
    <section className="view on">
      <Kpis items={items} range={range} now={now} />
      <div className="grid2">
        <div className="card">
          <div className="card-h"><h2>Responses per week</h2><small>All audiences, last 8 weeks</small></div>
          <div className="card-b"><WeeklyChart items={items} now={now} /></div>
        </div>
        <div className="card">
          <div className="card-h"><h2>Needs follow-up</h2><small>New venue and insurer leads</small></div>
          <div className="card-b"><FollowUp items={items} now={now} onOpen={onOpen} /></div>
        </div>
      </div>
      <div className="card">
        <div className="card-h"><h2>Lead pipeline</h2><small>Venues and insurers, all time</small></div>
        <div className="card-b"><Pipeline items={items} /></div>
      </div>
    </section>
  );
}
