import "server-only";
import { getApp, getApps, initializeApp } from "firebase/app";
import { addDoc, collection, connectFirestoreEmulator, getFirestore, serverTimestamp, type Firestore } from "firebase/firestore";
import { firebaseConfig, useFirebaseEmulators } from "./config";

const APP_NAME = "vencare-server";
let db: Firestore | null = null;

function serverDb() {
  if (!db) {
    const app = getApps().some((a) => a.name === APP_NAME) ? getApp(APP_NAME) : initializeApp(firebaseConfig, APP_NAME);
    db = getFirestore(app);
    if (useFirebaseEmulators) connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return db;
}

export type NewSubmission = {
  audience: string;
  name: string;
  email: string;
  org: string;
  answers: Record<string, string>;
  userAgent: string;
};

/**
 * Creates a submission without a service-account key.
 * Firestore rules only allow this exact shape (status "new", empty notes, server timestamp, size limits),
 * and nobody but admins can read it back.
 */
export async function createSubmission(s: NewSubmission) {
  await addDoc(collection(serverDb(), "submissions"), {
    ...s,
    status: "new",
    notes: [],
    source: "website",
    createdAt: serverTimestamp(),
  });
}
