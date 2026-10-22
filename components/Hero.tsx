"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useAudience, type Audience } from "./AudienceContext";
import { Arrow, SmallCheck, barWidth, delay } from "./icons";

type HeroKey = "venue" | "guest" | "insurer";

const copy: Record<HeroKey, { label: string; short: string; lede: string; cta: string; aud: Audience }> = {
  venue: {
    label: "Venue",
    short: "Venue",
    lede: "A wall-mounted epinephrine station for your restaurant or venue, kept stocked, in date, and ready for your staff. One subscription, nothing to manage.",
    cta: "Bring VenCare to your venue",
    aud: "op",
  },
  guest: {
    label: "Guest with allergies",
    short: "Guest",
    lede: "Imagine knowing, before you sit down, that help is on the wall. VenCare puts epinephrine where you eat, so a forgotten pen isn't the end of the story.",
    cta: "Tell us what would help",
    aud: "al",
  },
  insurer: {
    label: "Insurer",
    short: "Insurer",
    lede: "A documented, auditable allergy response program for the restaurants you cover. Real loss control your accounts can stand behind.",
    cta: "Talk to us about a pilot",
    aud: "in",
  },
};

export default function Hero() {
  const { setAudience } = useAudience();
  const [key, setKey] = useState<HeroKey>("venue");
  const [shown, setShown] = useState<HeroKey>("venue");
  const [out, setOut] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pick = (k: HeroKey) => {
    setKey(k);
    if (timer.current) clearTimeout(timer.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(k);
    setOut(true);
    timer.current = setTimeout(() => {
      setShown(k);
      setOut(false);
    }, 220);
  };

  const c = copy[shown];

  return (
    <section id="top" className="hero">
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <div className="aud reveal" role="group" aria-label="Show me VenCare for">
            <span className="aud-label">I&apos;m a</span>
            {(Object.keys(copy) as HeroKey[]).map((k) => (
              <button key={k} type="button" aria-pressed={key === k} onClick={() => pick(k)}>
                <span className="full">{copy[k].label}</span>
                <span className="short">{copy[k].short}</span>
              </button>
            ))}
          </div>
          <h1 className="reveal" style={delay(0.08)}>
            Like an AED, but for <em>severe allergic reactions.</em>
          </h1>
          {/* .reveal stays on a static wrapper so React re-renders never strip its "in" class */}
          <div className="reveal" style={delay(0.16)}>
            <p className={`lede swap${out ? " out" : ""}`} aria-live="polite">
              {c.lede}
            </p>
          </div>
          <div className="ctas reveal" style={delay(0.24)}>
            <a
              className={`btn btn-primary swap${out ? " out" : ""}`}
              href="#join"
              onClick={() => setAudience(c.aud, { instant: true })}
            >
              <span>{c.cta}</span>
              <Arrow />
            </a>
            <a className="btn btn-secondary" href="#how">
              See it in action
            </a>
          </div>
          <div className="proof reveal" style={delay(0.32)}>
            <span><SmallCheck />Installed and serviced for you</span>
            <span><SmallCheck />Auto-replaced before expiry</span>
            <span><SmallCheck />Documented for your insurer</span>
          </div>
        </div>

        <div className="visual reveal" style={delay(0.2)}>
          <div className="station">
            <Image
              src="/assets/station.webp"
              alt="The VenCare emergency epinephrine station with two auto-injectors and pull, inject, call 911 instructions"
              width={960}
              height={1200}
              priority
              sizes="(max-width: 1040px) 90vw, 430px"
            />
          </div>
          <div className="badge-float">
            <span className="seal" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M3.5 8.3l2.8 2.8L12.5 4.8" stroke="#0B2345" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            VenCare Ready venue
          </div>
          <div className="status" role="img" aria-label="Example station status card: station 014, main dining room, ready">
            <div className="status-top">
              <span>STATION 014</span>
              <span className="live"><i aria-hidden="true" />Ready</span>
            </div>
            <div className="status-name">Main dining room</div>
            <div className="meter">
              <div className="meter-row"><span>Doses</span><div className="bar"><i style={barWidth(100)} /></div><b>2/2</b></div>
              <div className="meter-row"><span>Shelf life</span><div className="bar"><i style={barWidth(72)} /></div><b>8 mo</b></div>
              <div className="meter-row"><span>Staff trained</span><div className="bar"><i className="o" style={barWidth(86)} /></div><b>86%</b></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
