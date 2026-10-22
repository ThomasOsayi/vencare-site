import { sampleSubmissions } from "./sample";
import { STATUS_LABEL, type Note, type Status, type Submission } from "./types";

/**
 * Everything the admin dashboard needs from storage.
 * Firestore when NEXT_PUBLIC_FIREBASE_* is configured, in-memory sample data otherwise.
 */
export interface SubmissionsRepository {
  /** Streams the full list, newest first; returns an unsubscribe function. */
  subscribe(onChange: (items: Submission[]) => void, onError?: (e: Error) => void): () => void;
  updateStatus(id: string, from: Status, to: Status, by: string): Promise<void>;
  addNote(id: string, text: string, by: string): Promise<void>;
  /** True when showing sample data rather than live submissions. */
  readonly isSample: boolean;
}

export const newNoteId = () => Math.random().toString(36).slice(2, 10);
export const statusNote = (from: Status, to: Status) => `changed status from ${STATUS_LABEL[from]} to ${STATUS_LABEL[to]}`;

class SampleRepository implements SubmissionsRepository {
  readonly isSample = true;
  private items: Submission[] = sampleSubmissions();
  private listeners = new Set<(items: Submission[]) => void>();

  private snapshot() {
    return this.items.map((s) => ({ ...s, notes: [...s.notes] }));
  }

  private emit() {
    const snap = this.snapshot();
    this.listeners.forEach((l) => l(snap));
  }

  subscribe(onChange: (items: Submission[]) => void) {
    this.listeners.add(onChange);
    setTimeout(() => onChange(this.snapshot()), 0);
    return () => {
      this.listeners.delete(onChange);
    };
  }

  async updateStatus(id: string, from: Status, to: Status, by: string) {
    const s = this.items.find((x) => x.id === id);
    if (!s || from === to) return;
    const note: Note = { id: newNoteId(), by, text: statusNote(from, to), at: new Date().toISOString() };
    s.status = to;
    s.notes = [...s.notes, note];
    this.emit();
  }

  async addNote(id: string, text: string, by: string) {
    const s = this.items.find((x) => x.id === id);
    if (!s || !text.trim()) return;
    s.notes = [...s.notes, { id: newNoteId(), by, text: text.trim(), at: new Date().toISOString() }];
    this.emit();
  }
}

let repo: Promise<SubmissionsRepository> | null = null;

export function getSubmissionsRepository(): Promise<SubmissionsRepository> {
  if (!repo) {
    repo = import("@/lib/firebase/client").then(async ({ firebaseConfigured }) => {
      if (!firebaseConfigured) return new SampleRepository();
      const { FirestoreRepository } = await import("./firestore");
      return new FirestoreRepository();
    });
  }
  return repo;
}
