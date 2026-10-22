"use client";

import {
  arrayUnion,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { clientDb } from "@/lib/firebase/client";
import { newNoteId, statusNote, type SubmissionsRepository } from "./repository";
import type { Audience, Note, Status, Submission } from "./types";

export const SUBMISSIONS = "submissions";

const iso = (v: unknown) =>
  v instanceof Timestamp ? v.toDate().toISOString() : typeof v === "string" ? v : new Date().toISOString();

function toSubmission(d: QueryDocumentSnapshot<DocumentData>): Submission {
  const x = d.data();
  return {
    id: d.id,
    audience: (x.audience ?? "individual") as Audience,
    name: x.name ?? "",
    email: x.email ?? "",
    org: x.org || undefined,
    // serverTimestamp() is null in the local echo until the server confirms it
    createdAt: iso(x.createdAt),
    status: (x.status ?? "new") as Status,
    answers: (x.answers ?? {}) as Record<string, string>,
    notes: ((x.notes ?? []) as Note[]).slice().sort((a, b) => a.at.localeCompare(b.at)),
    source: x.source ?? "website",
  };
}

export class FirestoreRepository implements SubmissionsRepository {
  readonly isSample = false;

  subscribe(onChange: (items: Submission[]) => void, onError?: (e: Error) => void) {
    const q = query(collection(clientDb(), SUBMISSIONS), orderBy("createdAt", "desc"), limit(2000));
    return onSnapshot(q, (snap) => onChange(snap.docs.map(toSubmission)), (e) => onError?.(e));
  }

  async updateStatus(id: string, from: Status, to: Status, by: string) {
    if (from === to) return;
    const note: Note = { id: newNoteId(), by, text: statusNote(from, to), at: new Date().toISOString() };
    await updateDoc(doc(clientDb(), SUBMISSIONS, id), { status: to, notes: arrayUnion(note), updatedAt: serverTimestamp() });
  }

  async addNote(id: string, text: string, by: string) {
    if (!text.trim()) return;
    const note: Note = { id: newNoteId(), by, text: text.trim(), at: new Date().toISOString() };
    await updateDoc(doc(clientDb(), SUBMISSIONS, id), { notes: arrayUnion(note), updatedAt: serverTimestamp() });
  }
}
