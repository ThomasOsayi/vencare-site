import Image from "next/image";
import { AudienceLink } from "./AudienceContext";
import { Arrow, LogoMark, NavyCheck, barWidth, delay } from "./icons";

const places = ["Restaurants", "Stadiums", "Campus dining", "Hotels", "Food halls", "Workplaces", "Event venues", "Schools"];

export function Places() {
  return (
    <div className="places" aria-label="Built for restaurants, stadiums, campus dining, hotels, food halls, workplaces, event venues and schools">
      <div className="places-inner">
        <span className="places-label">Built for</span>
        <div className="marquee">
          <div className="track" aria-hidden="true">
            {[...places, ...places].map((p, i) => (
              <span key={i}>{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="section stats on-dark" aria-labelledby="gap-h">
      <div className="wrap stats-inner">
        <div className="head reveal">
          <span className="eyebrow">Why now</span>
          <h2 id="gap-h">
            Reactions happen in public. <em>Epinephrine usually doesn&apos;t.</em>
          </h2>
        </div>
        <div className="stat-grid">
          <div className="stat reveal">
            <span className="k">Food allergy</span>
            <span className="v" data-count="33" data-suffix="M+">33M+</span>
            <p>Americans live with a food allergy.</p>
          </div>
          <div className="stat reveal" style={delay(0.1)}>
            <span className="k">Every</span>
            <span className="v" data-count="10" data-suffix=" sec">10 sec</span>
            <p>someone in the U.S. is sent to the ER for a food allergy reaction.</p>
          </div>
          <div className="stat reveal" style={delay(0.2)}>
            <span className="k">Only</span>
            <span className="v">7–21%</span>
            <p>of college students with food allergy consistently carry their epinephrine.</p>
          </div>
        </div>
        <div className="gap-line reveal">
          <h3>When a guest&apos;s pen is at home, the only option is waiting for EMS. VenCare puts a second line of defense on the wall.</h3>
          <p className="src">Sources: FARE and peer-reviewed food allergy research.</p>
        </div>
      </div>
    </section>
  );
}

export function Subscription() {
  return (
    <section className="section" aria-labelledby="sub-h">
      <div className="wrap">
        <div className="head center reveal">
          <span className="eyebrow">One subscription</span>
          <h2 id="sub-h">Everything it takes to stay ready.</h2>
          <p>No equipment to buy and no expiration dates to chase. We run the program; your team just knows where the station is.</p>
        </div>
        <div className="sub-grid">
          <div className="tile t-a reveal">
            <div className="copy">
              <div className="ico">
                <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><rect x="4" y="2" width="14" height="18" rx="3" stroke="#FFC928" strokeWidth="1.8" fill="none" /><path d="M11 6v6M8 9h6" stroke="#FFC928" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </div>
              <h3>The station</h3>
              <p>Wall-mounted, high-visibility, and stocked with adult and child epinephrine auto-injectors plus step-by-step guidance. Installation and signage included.</p>
            </div>
            <Image src="/assets/staff-mounting.webp" alt="A staff member opening a VenCare station mounted on a restaurant wall" width={960} height={1200} sizes="(max-width: 760px) 100vw, 300px" />
          </div>
          <div className="tile t-b reveal" style={delay(0.08)}>
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><rect x="3" y="4" width="16" height="15" rx="2.5" stroke="#C43D0A" strokeWidth="1.8" fill="none" /><path d="M3 9h16M7.5 2v4M14.5 2v4" stroke="#C43D0A" strokeWidth="1.8" strokeLinecap="round" /></svg>
            </div>
            <h3>Expiry tracking and restock</h3>
            <p>We track every dose and swap it out before it expires, or after it&apos;s used. No surprises, no extra bills.</p>
            <div className="mini-cal" aria-hidden="true">
              <span className="ok">Jan</span><span className="ok">Feb</span><span>Mar</span><span className="x">Apr</span><span>May</span><span className="ok">Jun</span>
            </div>
          </div>
          <div className="tile t-c reveal">
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="7.5" r="3.8" stroke="#C43D0A" strokeWidth="1.8" fill="none" /><path d="M3.5 19c1.1-3.6 4-5.6 7.5-5.6s6.4 2 7.5 5.6" stroke="#C43D0A" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg>
            </div>
            <h3>Staff training</h3>
            <p>Short, practical training on recognizing anaphylaxis and using the station, with completion tracked per location.</p>
            <div className="train" aria-hidden="true">
              <div className="train-row"><span className="av" style={{ background: "#0B2345" }}>MR</span><div className="bar"><i style={barWidth(100)} /></div></div>
              <div className="train-row"><span className="av" style={{ background: "#C43D0A" }}>JL</span><div className="bar"><i style={barWidth(100)} /></div></div>
              <div className="train-row"><span className="av" style={{ background: "#178A5B" }}>AS</span><div className="bar"><i className="o" style={barWidth(55)} /></div></div>
            </div>
          </div>
          <div className="tile t-d reveal" style={delay(0.08)}>
            <div className="ico">
              <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M4 18V11M11 18V4M18 18v-6" stroke="#C43D0A" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <h3>Readiness records</h3>
            <p>Station checks, training completion, and incident logs in one place. A documented preparedness story for your team, your landlord, and your insurer.</p>
            <a href="#dashboard" style={{ fontWeight: 600, fontSize: 15, marginTop: "auto" }}>Preview the dashboard &rarr;</a>
          </div>
        </div>
        <div className="included reveal">
          <span>Installation</span><span>Signage</span><span>Adult and child doses</span><span>Regular checks</span><span>Replacement after use</span><span>[PRICE] per station / month</span>
        </div>
      </div>
    </section>
  );
}

const stations = [
  { loc: "Main dining room", ready: true, exp: "Jun 2027", trained: "18/20" },
  { loc: "Patio bar", ready: true, exp: "Mar 2027", trained: "9/10" },
  { loc: "Downtown location", ready: false, exp: "Nov 2026", trained: "14/15" },
  { loc: "Event hall", ready: true, exp: "Aug 2027", trained: "12/13" },
];

export function Dashboard() {
  return (
    <section id="dashboard" className="section dash-sec">
      <div className="wrap dash-grid">
        <div className="dash-copy reveal">
          <span className="eyebrow">Readiness tracking</span>
          <h2>
            Know every station is ready, <em>at a glance.</em>
          </h2>
          <p style={{ color: "var(--muted)", fontSize: 18 }}>One view for operators with one location or fifty.</p>
          <ul>
            <li><NavyCheck /><span><b>Station status</b> for every location, with alerts before anything expires.</span></li>
            <li><NavyCheck /><span><b>Training completion</b> per site, so you know who&apos;s ready on every shift.</span></li>
            <li><NavyCheck /><span><b>Exportable records</b> to share with risk managers and carriers.</span></li>
          </ul>
        </div>
        <div className="reveal" style={delay(0.1)}>
          <div className="app" role="img" aria-label="Illustrative preview of the VenCare readiness dashboard showing station status, expiry dates and training completion for four example locations">
            <div className="app-bar" aria-hidden="true"><i /><i /><i /><span>app.vencare.com / readiness</span></div>
            <div className="app-body" aria-hidden="true">
              <div className="app-head"><b>Your stations</b><span className="pill-s g">3 of 4 ready</span></div>
              <div className="kpis">
                <div className="kpi"><small>Stations</small><strong>4</strong></div>
                <div className="kpi"><small>Expiring in 60 days</small><strong>1</strong></div>
                <div className="kpi"><small>Staff trained</small><strong>91%</strong></div>
              </div>
              <table className="st">
                <thead><tr><th>Location</th><th>Status</th><th>Next expiry</th><th>Trained</th></tr></thead>
                <tbody>
                  {stations.map((s) => (
                    <tr key={s.loc}>
                      <td>{s.loc}</td>
                      <td>{s.ready ? <span className="pill-s g">Ready</span> : <span className="pill-s o">Restock scheduled</span>}</td>
                      <td>{s.exp}</td>
                      <td>{s.trained}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="preview-note">Illustrative preview. Readiness tracking is in development.</p>
        </div>
      </div>
    </section>
  );
}

export function ReadyMark() {
  return (
    <section className="section ready" aria-labelledby="ready-h">
      <div className="wrap ready-grid">
        <div className="decal-wrap reveal">
          <Image src="/assets/server-table.webp" alt="A server setting a table in a busy restaurant" width={1024} height={1024} sizes="(max-width: 1040px) 100vw, 560px" />
          <div className="decal" aria-hidden="true">
            <span className="ring" />
            <small>Emergency epinephrine</small>
            <b>VenCare<br />Ready</b>
            <small>on site</small>
          </div>
        </div>
        <div className="ready-copy reveal" style={delay(0.1)}>
          <span className="eyebrow">VenCare Ready</span>
          <h2 id="ready-h">
            A sign guests with allergies <em>look for.</em>
          </h2>
          <p>Every VenCare venue gets a window and menu mark that tells guests help is on the wall. For families managing food allergies, that&apos;s a reason to pick your place.</p>
          <div className="two">
            <div><b>For venues</b><span>A visible signal of care that sets you apart on the block.</span></div>
            <div><b>For guests</b><span>Peace of mind before they even sit down.</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const compare = [
  ["Wait for EMS", "Epinephrine on site in minutes"],
  ["Hope a guest carries a pen", "A visible, stocked station"],
  ["Ad hoc staff reaction", "Printed steps and trained staff"],
  ["Expired or missing kits", "Tracked and auto-replaced"],
  ["No record of readiness", "Documented, exportable program"],
];

export function Insurers() {
  return (
    <section id="insurers" className="section insurers on-dark">
      <div className="wrap">
        <div className="ins-top">
          <div className="head reveal">
            <span className="eyebrow">For carriers, MGAs and brokers</span>
            <h2>
              Loss control, <em>not just another product.</em>
            </h2>
          </div>
          <p className="reveal" style={delay(0.1)}>
            A visible, documented preparedness program is designed to reduce liability exposure. It gives the restaurants you cover a real allergy response plan you can point to.
          </p>
        </div>
        <div className="ins-grid">
          <div className="compare reveal" role="table" aria-label="Venue allergy response today and with VenCare">
            <div className="compare-row h" role="row"><div role="columnheader">Today</div><div role="columnheader">With VenCare</div></div>
            {compare.map(([a, b]) => (
              <div className="compare-row" role="row" key={a}><div role="cell">{a}</div><div role="cell">{b}</div></div>
            ))}
          </div>
          <div className="ins-cards">
            <div className="ins-card reveal">
              <div className="ico"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l7 2.5v6c0 4.2-3 7.4-7 8.5-4-1.1-7-4.3-7-8.5V4z" stroke="#FF5A1F" strokeWidth="1.8" fill="none" strokeLinejoin="round" /><path d="M7 10l2 2 4-4.5" stroke="#FF5A1F" strokeWidth="1.8" fill="none" strokeLinecap="round" /></svg></div>
              <div><h3>Public-safety infrastructure</h3><p>Think AED program, built for severe allergic reactions.</p></div>
            </div>
            <div className="ins-card reveal" style={delay(0.08)}>
              <div className="ico"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="2.5" width="14" height="15" rx="2.5" stroke="#FF5A1F" strokeWidth="1.8" fill="none" /><path d="M7 7h6M7 10.5h6M7 14h3" stroke="#FF5A1F" strokeWidth="1.8" strokeLinecap="round" /></svg></div>
              <div><h3>Records you can underwrite</h3><p>Station checks, training, and incidents documented per location.</p></div>
            </div>
            <div className="ins-card reveal" style={delay(0.16)}>
              <div className="ico"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="3" width="6" height="6" rx="1.5" stroke="#FF5A1F" strokeWidth="1.8" fill="none" /><rect x="11.5" y="3" width="6" height="6" rx="1.5" stroke="#FF5A1F" strokeWidth="1.8" fill="none" /><rect x="2.5" y="12" width="6" height="6" rx="1.5" stroke="#FF5A1F" strokeWidth="1.8" fill="none" /><rect x="11.5" y="12" width="6" height="6" rx="1.5" stroke="#FF5A1F" strokeWidth="1.8" fill="none" /></svg></div>
              <div><h3>Portfolio rollout</h3><p>Offer VenCare across a book of restaurant accounts as a value-add.</p></div>
            </div>
          </div>
        </div>
        <div className="ins-cta reveal">
          <p>Piloting with a group of restaurant accounts?</p>
          <AudienceLink audience="in" className="btn btn-primary">
            Talk to us about your book <Arrow />
          </AudienceLink>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="section">
      <div className="wrap about-grid">
        <div className="about-img reveal">
          <Image src="/assets/dining-room.webp" alt="A warm, sunlit restaurant dining room" width={1024} height={1024} sizes="(max-width: 1040px) 100vw, 560px" />
          <div className="cap">More ready places. Brighter tomorrows.</div>
        </div>
        <div className="about-copy reveal" style={delay(0.1)}>
          <span className="eyebrow">Our story</span>
          <h2>
            Built around a <em>simple gap.</em>
          </h2>
          <p>VenCare exists to close the gap between allergic emergencies and immediate access to epinephrine in the places where people eat, work, study, travel, and gather.</p>
          <p>We believe emergency preparedness should be visible, accessible, and easy for organizations to manage.</p>
          <div className="founders">
            {[
              { i: "TF", n: "Tom Fathi", e: "tfathi@lion.lmu.edu" },
              { i: "CD", n: "Cila David", e: "cdavid3@lion.lmu.edu" },
            ].map((f) => (
              <div className="founder" key={f.n}>
                <div className="fav" aria-hidden="true">{f.i}</div>
                <div><b>{f.n}</b><small>Co-founder</small><a href={`mailto:${f.e}`}>{f.e}</a></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final">
      <div className="wrap final-inner">
        <h2 className="reveal">
          Make your venue <em>VenCare Ready.</em>
        </h2>
        <AudienceLink audience="op" className="btn btn-navy reveal" style={delay(0.1)}>
          Get in touch <Arrow />
        </AudienceLink>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="wrap foot">
        <div className="about">
          <a className="logo" href="#top" aria-label="VenCare home">
            <LogoMark dark />
            <span className="wordmark">VenCare</span>
          </a>
          <span>Managed public-access emergency epinephrine preparedness for the places where people eat, work, study, and gather.</span>
        </div>
        <div className="links">
          <a href="#how">How it works</a>
          <a href="#dashboard">Readiness</a>
          <a href="#insurers">For insurers</a>
          <a href="#about">About</a>
          <a href="#faq">FAQ</a>
          <a href="#join">Contact</a>
        </div>
      </div>
      <div className="wrap foot-bottom">
        <span>
          &copy; {new Date().getFullYear()} VenCare. VenCare is an early-stage company. Nothing on this site is medical advice or a guarantee of any outcome. Always call 911 in an emergency.
        </span>
        <a className="team-login" href="/admin" rel="nofollow">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M5.5 7V5a2.5 2.5 0 015 0v2" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
          Team login
        </a>
      </div>
    </footer>
  );
}
