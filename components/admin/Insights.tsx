"use client";

import { useEffect, useState } from "react";
import type { Audience, Submission } from "@/lib/submissions/types";
import { tally } from "@/lib/submissions/utils";

const QUESTIONS: { title: string; audience: Audience; key: string; group: string }[] = [
  { title: "Clear approach to severe reactions today?", audience: "organization", key: "has_approach", group: "Venues / orgs" },
  { title: "Most useful to venues", audience: "organization", key: "most_useful", group: "Venues / orgs" },
  { title: "VenCare Ready sign would influence choice", audience: "individual", key: "ready_sign", group: "Individuals" },
  { title: "What matters most to guests", audience: "individual", key: "matters_most", group: "Individuals" },
  { title: "Organization type", audience: "organization", key: "org_type", group: "Venues / orgs" },
  { title: "Insurer interest", audience: "insurer", key: "ins_interest", group: "Insurers" },
];

function Question({ title, group, pairs, grown }: { title: string; group: string; pairs: [string, number][]; grown: boolean }) {
  const tot = pairs.reduce((a, p) => a + p[1], 0);
  return (
    <div className="card">
      <div className="card-h"><h2>{title}</h2><small>{group} · n={tot}</small></div>
      <div className="card-b">
        {tot ? (
          <div className="hbar">
            {pairs.map(([k, v]) => {
              const pct = (v / tot) * 100;
              return (
                <div key={k} className="hrow" title={`${k}: ${v} of ${tot}`}>
                  <span>{k}</span>
                  <b>{Math.round(pct)}%</b>
                  <div className="track"><i style={{ width: grown ? `${pct}%` : 0 }} /></div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="q-n">No answers in this date range yet.</p>
        )}
      </div>
    </div>
  );
}

export default function Insights({ items }: { items: Submission[] }) {
  const [grown, setGrown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setGrown(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <section className="view on">
      <div className="ins-grid">
        {QUESTIONS.map((q) => (
          <Question key={q.key} title={q.title} group={q.group} pairs={tally(items, q.audience, q.key)} grown={grown} />
        ))}
      </div>
    </section>
  );
}
