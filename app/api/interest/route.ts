import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { createSubmission } from "@/lib/firebase/server-writer";

const AUDIENCES = new Set(["organization", "individual", "insurer"]);
const MAX_FIELDS = 30;
const MAX_LEN = 2000;
/** Fields stored at the top level of the Firestore doc rather than inside `answers`. */
const TOP_LEVEL = new Set(["name", "email", "audience"]);

/**
 * Receives interest-form submissions from the homepage.
 * 1. Writes them to Firestore `submissions` for the /admin dashboard: via the Admin SDK when a service account
 *    is configured, otherwise via the web SDK (Firestore rules only allow a well-formed new submission).
 * 2. Optionally forwards them as JSON to FORM_WEBHOOK_URL (e.g. the sheet the standalone surveys use).
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

  // Keep only short string fields with simple keys.
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(body as Record<string, unknown>).slice(0, MAX_FIELDS)) {
    if (typeof v === "string" && /^[a-z_]{1,40}$/.test(k) && v.trim()) clean[k] = v.trim().slice(0, MAX_LEN);
  }

  const email = (clean.email ?? "").toLowerCase();
  if (!clean.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Name and a valid email are required." }, { status: 400 });
  }
  const audience = AUDIENCES.has(clean.audience ?? "") ? clean.audience : "individual";
  const answers = Object.fromEntries(Object.entries(clean).filter(([k]) => !TOP_LEVEL.has(k)));
  const org = clean.org_name ?? clean.ins_company ?? "";

  const db = adminDb();
  const webhook = process.env.FORM_WEBHOOK_URL;

  try {
    const userAgent = (req.headers.get("user-agent") ?? "").slice(0, 300);
    if (db) {
      await db.collection("submissions").add({
        audience,
        name: clean.name,
        email,
        org,
        answers,
        status: "new",
        notes: [],
        source: "website",
        createdAt: FieldValue.serverTimestamp(),
        userAgent,
      });
    } else {
      await createSubmission({ audience: audience!, name: clean.name.slice(0, 120), email: email.slice(0, 200), org: org.slice(0, 200), answers, userAgent });
    }
    if (webhook) {
      const r = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audience, name: clean.name, email, org, ...answers, source: "website", submitted_at: new Date().toISOString() }),
      });
      if (!r.ok) throw new Error(`Webhook responded ${r.status}`);
    }
  } catch (err) {
    console.error("[interest] save failed", err);
    return NextResponse.json({ ok: false, error: "Could not save your response." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
