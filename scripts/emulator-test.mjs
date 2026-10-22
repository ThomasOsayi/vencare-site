// End-to-end check against the Firebase emulators (no real project touched).
//   1. npx firebase emulators:start --only auth,firestore --project demo-vencare
//   2. Run the app pointed at the emulators (see README), then:
//   3. APP_URL=http://localhost:3000 node scripts/emulator-test.mjs
import assert from "node:assert/strict";
import { initializeApp as initAdmin } from "firebase-admin/app";
import { getAuth as adminAuth } from "firebase-admin/auth";
import { getFirestore as adminFs } from "firebase-admin/firestore";
import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, connectFirestoreEmulator, doc, getDoc, getDocs, getFirestore, serverTimestamp, updateDoc, arrayUnion } from "firebase/firestore";

process.env.FIRESTORE_EMULATOR_HOST ??= "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST ??= "127.0.0.1:9099";
const projectId = "demo-vencare";
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

const admin = initAdmin({ projectId });
const adb = adminFs(admin);

// Seed users
const ADMIN = "admin@example.com", OTHER = "someone@example.com", PW = "password123";
for (const email of [ADMIN, OTHER]) {
  try { await adminAuth(admin).createUser({ email, password: PW, emailVerified: true, displayName: email.split("@")[0] }); } catch {}
}
await adb.collection("admins").doc(ADMIN).set({ email: ADMIN });

let pass = 0;
const ok = (msg) => { pass++; console.log("  ✓", msg); };
const denied = async (p, msg) => { await assert.rejects(p, (e) => /permission/i.test(String(e.code ?? e.message))); ok(msg); };

// 1. Website form -> API route -> Firestore
const before = (await adb.collection("submissions").get()).size;
const res = await fetch(`${APP_URL}/api/interest`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ audience: "organization", name: "Emulator Test", email: "Test@Example.com", org_name: "Sample Bistro", org_type: "Restaurant", locations: "2 to 5", evil_Key: "x", nested: { a: 1 } }),
});
assert.equal(res.status, 200);
const after = await adb.collection("submissions").orderBy("createdAt", "desc").limit(1).get();
assert.equal((await adb.collection("submissions").get()).size, before + 1);
const saved = after.docs[0].data();
assert.equal(saved.email, "test@example.com");
assert.equal(saved.org, "Sample Bistro");
assert.equal(saved.status, "new");
assert.deepEqual(saved.answers, { org_name: "Sample Bistro", org_type: "Restaurant", locations: "2 to 5" });
ok("API route saves a sanitized submission to Firestore");
const bad = await fetch(`${APP_URL}/api/interest`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: "x", email: "nope" }) });
assert.equal(bad.status, 400);
ok("API route rejects an invalid email");
const id = after.docs[0].id;

// 2. Security rules through the client SDK
const app = initializeApp({ apiKey: "demo", projectId }, "client");
const auth = getAuth(app); connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });
const db = getFirestore(app); connectFirestoreEmulator(db, "127.0.0.1", 8080);

await denied(getDocs(collection(db, "submissions")), "signed-out users can't read submissions");

await signInWithEmailAndPassword(auth, OTHER, PW);
assert.equal((await getDoc(doc(db, "admins", OTHER))).exists(), false);
ok("non-admin can check their own admin doc (and isn't one)");
await denied(getDoc(doc(db, "admins", ADMIN)), "non-admin can't read someone else's admin doc");
await denied(getDocs(collection(db, "submissions")), "non-admin can't read submissions");
await signOut(auth);

await signInWithEmailAndPassword(auth, ADMIN, PW);
assert.equal((await getDoc(doc(db, "admins", ADMIN))).exists(), true);
const list = await getDocs(collection(db, "submissions"));
assert.ok(list.size >= 1);
ok(`admin can read submissions (${list.size})`);
await updateDoc(doc(db, "submissions", id), { status: "contacted", notes: arrayUnion({ id: "t1", by: "admin", text: "test note", at: new Date().toISOString() }) });
const upd = (await adb.collection("submissions").doc(id).get()).data();
assert.equal(upd.status, "contacted"); assert.equal(upd.notes.length, 1);
ok("admin can update status and add notes");
await denied(updateDoc(doc(db, "submissions", id), { email: "hacked@example.com" }), "admin can't edit submitted answers/contact fields");
await denied(updateDoc(doc(db, "submissions", id), { status: "deleted" }), "admin can't set an unknown status");
await denied(addDoc(collection(db, "submissions"), { name: "x" }), "malformed submissions are rejected");
await denied(addDoc(collection(db, "submissions"), { audience: "insurer", name: "x", email: "x@example.com", org: "", answers: {}, status: "pilot", notes: [], source: "website", createdAt: serverTimestamp(), userAgent: "" }), "new submissions can't skip the 'new' status");
await signOut(auth);

console.log(`\n${pass} checks passed. Submission id: ${id}`);
process.exit(0);
