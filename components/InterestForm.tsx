"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAudience, type Audience } from "./AudienceContext";
import { Arrow, ArrowUpRight, delay } from "./icons";

// Replace with the live survey links.
const SURVEY_LINKS = {
  operators: "#",
  allergy: "#",
};

const tabs: { id: Audience; label: string; value: string }[] = [
  { id: "op", label: "A venue or organization", value: "organization" },
  { id: "al", label: "An individual", value: "individual" },
  { id: "in", label: "An insurer or MGA", value: "insurer" },
];

function Select({ label, name, options, full }: { label: string; name: string; options: string[]; full?: boolean }) {
  return (
    <label className={`f${full ? " full" : ""}`}>
      {label}
      <select name={name} defaultValue="">
        <option value="">Select one</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Notes({ name, label = "Anything else?" }: { name: string; label?: string }) {
  return (
    <label className="f full">
      <span>
        {label} <span className="opt">(optional)</span>
      </span>
      <textarea name={name} placeholder="Share a few words..." maxLength={2000} />
    </label>
  );
}

function OrgPanel() {
  return (
    <div className="fields">
      <label className="f">Organization name<input type="text" name="org_name" placeholder="Restaurant, venue or company" autoComplete="organization" /></label>
      <label className="f">Role<input type="text" name="role" placeholder="Owner, GM, safety lead..." /></label>
      <Select label="Organization type" name="org_type" options={["Restaurant", "Hospitality", "Workplace", "School / University", "Venue", "Insurance / Risk", "Other"]} />
      <Select label="Number of locations" name="locations" options={["1", "2 to 5", "6 to 20", "21+"]} />
      <Select label="Clear approach to severe allergic reactions today?" name="has_approach" options={["Yes", "No", "Not sure"]} />
      <Select label="What would be most useful?" name="most_useful" options={["Better preparedness guidance", "Emergency epinephrine access", "Staff awareness / readiness", "A clearer response approach", "Still exploring"]} />
      <Select label="Open to learning more?" name="open_to_more" options={["Yes", "Maybe", "Not right now"]} full />
      <Notes name="notes" />
    </div>
  );
}

function IndividualPanel() {
  return (
    <>
      <fieldset>
        <legend>Which best describes you?</legend>
        <div className="chips">
          {["Someone with food allergies", "Parent / family member", "Healthcare-related", "Other"].map((v) => (
            <label className="chip" key={v}>
              <input type="radio" name="describes" value={v} />
              <span>{v}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="fields">
        <Select label="Ever worried about epinephrine access outside the home?" name="concerned_access" options={["Yes", "No", "Prefer not to say"]} />
        <Select label="What would matter most to you?" name="matters_most" options={["Better preparedness in public places", "Easier access", "More awareness", "Better information", "Other"]} />
        <Select label="Would a VenCare Ready sign make you more likely to choose a venue?" name="ready_sign" options={["Yes, definitely", "Somewhat", "No difference"]} full />
        <Notes name="help_most" label="What would you want VenCare to help with most?" />
      </div>
    </>
  );
}

function InsurerPanel() {
  return (
    <div className="fields">
      <label className="f">Company<input type="text" name="ins_company" placeholder="Carrier, MGA or broker" autoComplete="organization" /></label>
      <label className="f">Role<input type="text" name="ins_role" placeholder="Loss control, underwriting..." /></label>
      <Select label="Restaurant or venue accounts in your book" name="ins_book" options={["Under 50", "50 to 500", "500+", "Not sure"]} />
      <Select label="What are you interested in?" name="ins_interest" options={["Piloting with a group of accounts", "Loss-control documentation", "General information"]} />
      <Notes name="ins_notes" />
    </div>
  );
}

export default function InterestForm() {
  const { audience, setAudience, instantRef } = useAudience();
  const [panel, setPanel] = useState<Audience>(audience);
  const [phase, setPhase] = useState<"" | "leaving" | "entering">("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [invalid, setInvalid] = useState<Record<string, boolean>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLHeadingElement>(null);

  // Crossfade between question sets when the audience changes.
  useEffect(() => {
    if (audience === panel) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (instantRef.current || reduce) {
      instantRef.current = false;
      setPanel(audience);
      setPhase("");
      return;
    }
    setPhase("leaving");
    const t1 = setTimeout(() => {
      setPanel(audience);
      setPhase("entering");
      requestAnimationFrame(() => requestAnimationFrame(() => setPhase("")));
    }, 220);
    return () => clearTimeout(t1);
  }, [audience, panel, instantRef]);

  useEffect(() => {
    if (status === "done") thanksRef.current?.focus({ preventScroll: true });
  }, [status]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = form.elements.namedItem("name") as HTMLInputElement;
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const bad = { name: !name.checkValidity(), email: !email.checkValidity() };
    setInvalid(bad);
    if (bad.name || bad.email) {
      (bad.name ? name : email).focus();
      form.reportValidity();
      return;
    }

    const data: Record<string, string> = {};
    new FormData(form).forEach((v, k) => {
      if (typeof v === "string" && v.trim()) data[k] = v.trim();
    });

    setStatus("sending");
    try {
      const res = await fetch("/api/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    formRef.current?.reset();
    setInvalid({});
    setAudience("op", { instant: true });
    setStatus("idle");
  };

  const idx = tabs.findIndex((t) => t.id === audience);

  return (
    <section id="join" className="section">
      <div className="wrap join-grid">
        <div className="join-copy reveal">
          <span className="eyebrow">Help us build VenCare</span>
          <h2>
            Your perspective <em>shapes what we build.</em>
          </h2>
          <p>We&apos;re hearing from guests, venues, and insurers about allergic emergency preparedness. Takes about a minute.</p>
          <div className="side-links">
            <span>Prefer the full survey?</span>
            <a className="side-link" href={SURVEY_LINKS.operators} target="_blank" rel="noopener">
              Restaurant operator survey <ArrowUpRight />
            </a>
            <a className="side-link" href={SURVEY_LINKS.allergy} target="_blank" rel="noopener">
              Food allergy survey <ArrowUpRight />
            </a>
          </div>
        </div>

        <div className="form-card reveal" style={delay(0.1)}>
          {status === "done" ? (
            <div className="thanks in">
              <svg className="check" viewBox="0 0 48 48" aria-hidden="true">
                <circle cx="24" cy="24" r="21" stroke="#0B2345" strokeWidth="3" fill="none" />
                <path d="M15 24.5l6 6 12-13" stroke="#FF5A1F" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h3 tabIndex={-1} ref={thanksRef}>Thank you for sharing.</h3>
              <p>Your input helps us understand where preparedness support is needed most. We&apos;ll be in touch.</p>
              <button type="button" className="btn btn-secondary" onClick={reset}>
                Submit another response
              </button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <input type="hidden" name="audience" value={tabs[idx].value} />
              <fieldset>
                <legend>I&apos;m responding as...</legend>
                <div className="seg" role="group" aria-label="Respondent type">
                  <span className="thumb" aria-hidden="true" style={{ transform: `translateX(${idx * 100}%)` }} />
                  {tabs.map((t) => (
                    <button key={t.id} type="button" aria-pressed={audience === t.id} onClick={() => setAudience(t.id)}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="fields">
                <label className="f">
                  Name
                  <input type="text" name="name" placeholder="Jordan Lee" required maxLength={120} autoComplete="name" className={invalid.name ? "invalid" : undefined} onInput={() => setInvalid((s) => ({ ...s, name: false }))} />
                </label>
                <label className="f">
                  <span>{audience === "al" ? "Email" : "Work email"}</span>
                  <input type="email" name="email" placeholder="you@example.com" required maxLength={200} autoComplete="email" className={invalid.email ? "invalid" : undefined} onInput={() => setInvalid((s) => ({ ...s, email: false }))} />
                </label>
              </div>

              <div className="panels">
                <div className={`panel ${phase}`} key={panel}>
                  {panel === "op" && <OrgPanel />}
                  {panel === "al" && <IndividualPanel />}
                  {panel === "in" && <InsurerPanel />}
                </div>
              </div>

              <button type="submit" className={`btn btn-primary submit${status === "sending" ? " loading" : ""}`} disabled={status === "sending"}>
                <span>Submit</span>
                <span className="spin" aria-hidden="true" />
                <span className="arrow"><Arrow /></span>
              </button>
              {status === "error" ? (
                <p className="fine" role="alert" style={{ color: "#C2410C" }}>Something went wrong. Please try again in a moment.</p>
              ) : (
                <p className="fine">We&apos;ll only use this to follow up about VenCare.</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
