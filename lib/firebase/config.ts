/**
 * Firebase web config for the VenCare project (vencare-c1826).
 * This is public by design (it ships to every browser); access is enforced by Firestore rules.
 * NEXT_PUBLIC_FIREBASE_* env vars override it, e.g. for a staging project or the emulators.
 */
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB9gt0ETdjlIXtLkgn5QLZ5aBcwVQfayjw",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "vencare-c1826.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "vencare-c1826",
  storageBucket: "vencare-c1826.firebasestorage.app",
  messagingSenderId: "672560428162",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:672560428162:web:81a1307cc62dc92332309b",
};

export const useFirebaseEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "1";
