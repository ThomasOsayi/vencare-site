"use client";

import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";

import { firebaseConfig as config, useFirebaseEmulators as useEmulators } from "./config";

/** True when the web config is present. Without it the admin runs on sample data. */
export const firebaseConfigured = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

function firebaseApp() {
  if (!firebaseConfigured) throw new Error("Firebase is not configured (NEXT_PUBLIC_FIREBASE_* env vars).");
  if (!app) app = getApps().length ? getApp() : initializeApp(config);
  return app;
}

export function clientAuth() {
  if (!auth) {
    auth = getAuth(firebaseApp());
    if (useEmulators) connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
  }
  return auth;
}

export function clientDb() {
  if (!db) {
    db = getFirestore(firebaseApp());
    if (useEmulators) connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return db;
}
