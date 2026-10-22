import { NextResponse } from "next/server";

const AUDIENCES = new Set(["organization", "individual", "insurer"]);
const MAX_FIELDS = 30;
const MAX_LEN = 2000;

/**
 * Receives interest-form submissions from the homepage.
 * Forwards them as JSON to FORM_WEBHOOK_URL (Google Apps Script, Zapier, Make, Formspree...)
 * so website responses land in the same place as the standalone surveys.
 * If no webhook is configured, the submission is logged (visible in Vercel runtime logs).
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ ok: false, error: "Invalid body" }, { status: 400 });
  }

  // Keep only short string fields.
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>).slice(0, MAX_FIELDS)) {
    if (typeof v === "string" && /^[a-z_]{1,40}$/.test(k)) clean[k] = v.slice(0, MAX_LEN);
  }

  const email = clean.email ?? "";
  if (!clean.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Name and a valid email are required." }, { status: 400 });
  }
  if (!AUDIENCES.has(clean.audience ?? "")) clean.audience = "unknown";

  const payload = { ...clean, source: "website", submitted_at: new Date().toISOString() };
  const webhook = process.env.FORM_WEBHOOK_URL;

  if (webhook) {
    try {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
    } catch (err) {
      console.error("[interest] webhook failed", err);
      return NextResponse.json({ ok: false, error: "Could not save your response." }, { status: 502 });
    }
  } else {
    console.log("[interest]", JSON.stringify(payload));
  }

  return NextResponse.json({ ok: true });
}
