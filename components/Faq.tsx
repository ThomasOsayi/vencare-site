"use client";

import { useRef, type MouseEvent } from "react";
import { delay } from "./icons";

const faqs = [
  { q: "Does VenCare replace calling 911?", a: "No. Calling 911 is a step printed on the station itself. VenCare covers the minutes before EMS arrives." },
  { q: "What's inside the station?", a: "Adult and child epinephrine auto-injectors and clear, illustrated response steps, with regular checks so it stays ready." },
  { q: "What happens after it's used or expires?", a: "We monitor expiration dates and replace medication after use or expiration as part of the subscription." },
  { q: "Do my staff need training?", a: "The station's guidance is designed to be simple, and we provide short training for your team with completion tracked per location." },
  { q: "Can my venue legally stock epinephrine?", a: "[Answer to be confirmed by counsel. Many states allow businesses to stock epinephrine and offer Good Samaritan protections; rules vary by state.]" },
  { q: "How much does it cost?", a: "[PRICE] per station per month, with installation, signage, checks, and replacements included. Ask about multi-location and insurer pilot pricing." },
];

function Item({ q, a }: { q: string; a: string }) {
  const d = useRef<HTMLDetailsElement>(null);
  const ans = useRef<HTMLDivElement>(null);

  const toggle = (e: MouseEvent) => {
    const det = d.current, el = ans.current;
    if (!det || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault();
    const done = (fn: () => void) => {
      const f = () => { fn(); el.removeEventListener("transitionend", f); };
      el.addEventListener("transitionend", f);
    };
    if (det.open) {
      el.style.height = `${el.scrollHeight}px`;
      requestAnimationFrame(() => (el.style.height = "0px"));
      done(() => { det.open = false; el.style.height = ""; });
    } else {
      det.open = true;
      el.style.height = "0px";
      requestAnimationFrame(() => (el.style.height = `${el.scrollHeight}px`));
      done(() => (el.style.height = ""));
    }
  };

  return (
    <details ref={d}>
      <summary onClick={toggle}>
        {q}
        <span className="pm" aria-hidden="true" />
      </summary>
      <div className="ans" ref={ans}>
        <p>{a}</p>
      </div>
    </details>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="section faq-sec">
      <div className="wrap faq-grid">
        <div className="head reveal">
          <span className="eyebrow">FAQ</span>
          <h2>
            Questions venues <em>ask first.</em>
          </h2>
          <p>Don&apos;t see yours? Send it through the form below.</p>
        </div>
        <div className="faq reveal" style={delay(0.1)}>
          {faqs.map((f) => (
            <Item key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
