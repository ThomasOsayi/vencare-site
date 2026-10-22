"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./icons";

const links = [
  { href: "#how", label: "How it works" },
  { href: "#dashboard", label: "Readiness" },
  { href: "#insurers", label: "For insurers" },
  { href: "#about", label: "About" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(`#${e.target.id}`)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    links.forEach((l) => {
      const s = document.querySelector(l.href);
      if (s) io.observe(s);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <div className="progress" ref={progress} aria-hidden="true" />
      <header className={scrolled ? "scrolled" : undefined}>
        <div className="wrap nav">
          <a className="logo" href="#top" aria-label="VenCare home">
            <LogoMark />
            <span className="wordmark">VenCare</span>
          </a>
          <nav aria-label="Main">
            <button
              className="burger"
              type="button"
              aria-expanded={open}
              aria-controls="menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span />
            </button>
            <ul className={`menu${open ? " open" : ""}`} id="menu">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={active === l.href ? "active" : undefined} onClick={() => setOpen(false)}>
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <a className="btn btn-primary" href="#join" onClick={() => setOpen(false)}>
                  Get in touch
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
