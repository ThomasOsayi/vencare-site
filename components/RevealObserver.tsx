"use client";

import { useEffect } from "react";

function countUp(el: HTMLElement) {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? "";
  const dur = 1400;
  let t0: number | null = null;
  const step = (t: number) => {
    if (t0 === null) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/** Fades `.reveal` elements in as they scroll into view and runs `[data-count]` counters. */
export default function RevealObserver() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          el.classList.add("in");
          el.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
