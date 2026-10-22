"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const steps = [
  { t: "Recognize", tag: "Spot it", sub: "Recognize the signs", h: "A guest is having a severe reaction.", p: "Hives, swelling, trouble breathing. Trained staff know the signs, and the station is visible from the floor." },
  { t: "Pull", tag: "Pull", sub: "Open the station", h: "Open the station and take a pen.", p: "Adult and child doses sit behind a clear door with an Emergency Access tab. Nothing to unlock or search for." },
  { t: "Inject", tag: "Inject", sub: "Outer thigh, as shown", h: "Follow the printed steps.", p: "Illustrated instructions on the station show exactly where and how to use the auto-injector." },
  { t: "Call 911", tag: "Call 911", sub: "Then we restock", h: "Call 911. We handle the rest.", p: "Emergency services take over. Log the use and VenCare replaces the dose, so the station is ready again." },
];

export default function EmergencySequence() {
  const [active, setActive] = useState(0);
  const [scrollDriven, setScrollDriven] = useState(false);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (!window.matchMedia("(min-width: 1041px)").matches || !("IntersectionObserver" in window)) return;
    setScrollDriven(true);
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }),
      { rootMargin: "-48% 0px -48% 0px" }
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const s = steps[active];

  return (
    <section id="how" className="section seq">
      <div className="wrap">
        <div className="head reveal">
          <span className="eyebrow">In an emergency</span>
          <h2>
            Clear enough to follow <em>under pressure.</em>
          </h2>
          <p>The station walks staff through every step. No hunting for a kit, no guessing.</p>
        </div>
        <div className="seq-grid">
          <div className="seq-visual reveal">
            <div className="seq-card" data-s={active + 1}>
              <Image className="main" src="/assets/station.webp" alt="" aria-hidden="true" fill sizes="(max-width: 1040px) 440px, 560px" />
              <Image className="alt" src="/assets/staff-mounting.webp" alt="" aria-hidden="true" fill sizes="(max-width: 1040px) 440px, 560px" />
              <div className="seq-tag" aria-live="polite">
                <span className="n">{active + 1}</span>
                <div>
                  <b>{s.tag}</b>
                  <span>{s.sub}</span>
                </div>
              </div>
            </div>
          </div>
          <ol className="seq-steps">
            {steps.map((st, i) => (
              <li
                key={st.t}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-i={i}
                className={`seq-step${active === i ? " on" : ""}`}
                onClick={scrollDriven ? undefined : () => setActive(i)}
              >
                <span className="dot">{i + 1}</span>
                <span className="t">{st.t}</span>
                <h3>{st.h}</h3>
                <p>{st.p}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
