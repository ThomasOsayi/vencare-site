import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

let db: Firestore | null | undefined;

/**
 * Server-side Firestore (bypasses security rules). Returns null when not configured.
 * Needs FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (service account),
 * or FIRESTORE_EMULATOR_HOST + FIREBASE_PROJECT_ID for local emulator testing.
 */
export function adminDb(): Firestore | null {
  if (db !== undefined) return db;
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  let app: App | undefined = getApps()[0];
  if (!app) {
    if (projectId && process.env.FIRESTORE_EMULATOR_HOST) {
      app = initializeApp({ projectId });
    } else if (projectId && clientEmail && privateKey) {
      app = initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), projectId });
    }
  }
  db = app ? getFirestore(app) : null;
  return db;
}
