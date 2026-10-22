// Grants dashboard access: node --env-file=.env.local scripts/add-admin.mjs person@example.com [more@example.com]
// Uses the same service-account env vars as the API route (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY).
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const emails = process.argv.slice(2).map((e) => e.trim().toLowerCase()).filter(Boolean);
if (!emails.length) {
  console.error("Usage: node --env-file=.env.local scripts/add-admin.mjs person@example.com");
  process.exit(1);
}
const { FIREBASE_PROJECT_ID: projectId, FIREBASE_CLIENT_EMAIL: clientEmail, FIREBASE_PRIVATE_KEY } = process.env;
const privateKey = FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
initializeApp(
  process.env.FIRESTORE_EMULATOR_HOST ? { projectId } : { credential: cert({ projectId, clientEmail, privateKey }), projectId }
);
const db = getFirestore();
for (const email of emails) {
  await db.collection("admins").doc(email).set({ email, addedAt: FieldValue.serverTimestamp() }, { merge: true });
  console.log(`Added admin: ${email}`);
}
