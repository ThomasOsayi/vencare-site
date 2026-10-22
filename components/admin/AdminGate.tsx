"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import AdminApp from "./AdminApp";

type State =
  | { kind: "loading" }
  | { kind: "sample" }
  | { kind: "signed-out"; error?: string }
  | { kind: "denied"; email: string }
  | { kind: "ok"; user: User };

const Logo = () => (
  <svg width="34" height="38" viewBox="0 0 30 34" aria-hidden="true">
    <path d="M15 1.5L28 6v10.5c0 7.6-5.4 13.6-13 16-7.6-2.4-13-8.4-13-16V6z" fill="#0B2345" />
    <path d="M8.5 11l6.5 13 6.5-13" stroke="#FF5A1F" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * Firebase configured: Google sign-in, then an allowlist check against the `admins/{email}` doc.
 * Not configured: renders the dashboard on sample data.
 */
export default function AdminGate() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      const { firebaseConfigured, clientAuth, clientDb } = await import("@/lib/firebase/client");
      if (!firebaseConfigured) return setState({ kind: "sample" });
      const { onAuthStateChanged } = await import("firebase/auth");
      const { doc, getDoc } = await import("firebase/firestore");
      if (process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1") {
        // Emulator-only helper for automated tests (the emulator accepts unsigned Google ID tokens). Stripped from production builds.
        const { GoogleAuthProvider, signInWithCredential } = await import("firebase/auth");
        (window as unknown as { __testSignIn?: (email: string, name?: string) => Promise<unknown> }).__testSignIn = (email, name) =>
          signInWithCredential(clientAuth(), GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name })));
      }
      unsub = onAuthStateChanged(clientAuth(), async (user) => {
        if (!user) return setState({ kind: "signed-out" });
        const email = (user.email ?? "").toLowerCase();
        try {
          const snap = await getDoc(doc(clientDb(), "admins", email));
          setState(snap.exists() && user.emailVerified ? { kind: "ok", user } : { kind: "denied", email });
        } catch {
          setState({ kind: "denied", email });
        }
      });
    })();
    return () => unsub();
  }, []);

  const signIn = async () => {
    const { clientAuth } = await import("@/lib/firebase/client");
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    try {
      await signInWithPopup(clientAuth(), new GoogleAuthProvider());
    } catch (e) {
      const code = (e as { code?: string }).code ?? "";
      if (code !== "auth/popup-closed-by-user" && code !== "auth/cancelled-popup-request") {
        setState({ kind: "signed-out", error: "Sign-in failed. Please try again." });
      }
    }
  };

  const signOut = async () => {
    const { clientAuth } = await import("@/lib/firebase/client");
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(clientAuth());
  };

  if (state.kind === "sample") return <AdminApp userName="Thomas" />;
  if (state.kind === "ok") return <AdminApp userName={state.user.displayName?.split(" ")[0] || state.user.email || "Admin"} email={state.user.email ?? undefined} onSignOut={signOut} />;

  return (
    <main className="gate">
      <div className="gate-card">
        <Logo />
        <h1>VenCare Admin</h1>
        {state.kind === "loading" && <p className="q-n">Checking your session...</p>}
        {state.kind === "signed-out" && (
          <>
            <p>Sign in with your team Google account to view form submissions.</p>
            <button type="button" className="btn primary gate-btn" onClick={signIn}>
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>
              Sign in with Google
            </button>
            {state.error && <p className="gate-err" role="alert">{state.error}</p>}
          </>
        )}
        {state.kind === "denied" && (
          <>
            <p><b>{state.email}</b> doesn&apos;t have admin access. Ask a VenCare admin to add you.</p>
            <button type="button" className="btn" onClick={signOut}>Use a different account</button>
          </>
        )}
      </div>
    </main>
  );
}
