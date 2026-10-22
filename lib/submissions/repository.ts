import { sampleSubmissions } from "./sample";
import { STATUS_LABEL, type Note, type Status, type Submission } from "./types";

/**
 * Everything the admin dashboard needs from storage.
 * Today it's backed by in-memory sample data; the Firebase step adds a
 * Firestore implementation (onSnapshot for `subscribe`, updateDoc for writes)
 * and swaps it in via `getSubmissionsRepository()`. No UI changes needed.
 */
export interface SubmissionsRepository {
  /** Streams the full list; returns an unsubscribe function. */
  subscribe(onChange: (items: Submission[]) => void, onError?: (e: Error) => void): () => void;
  updateStatus(id: string, status: Status, by: string): Promise<void>;
  addNote(id: string, text: string, by: string): Promise<void>;
  /** True when showing sample data rather than live submissions. */
  readonly isSample: boolean;
}

const uid = () => Math.random().toString(36).slice(2, 10);

class SampleRepository implements SubmissionsRepository {
  readonly isSample = true;
  private items: Submission[] = sampleSubmissions();
  private listeners = new Set<(items: Submission[]) => void>();

  private emit() {
    const snapshot = this.items.map((s) => ({ ...s, notes: [...s.notes] }));
    this.listeners.forEach((l) => l(snapshot));
  }

  subscribe(onChange: (items: Submission[]) => void) {
    this.listeners.add(onChange);
    // async like a real listener
    setTimeout(() => onChange(this.items.map((s) => ({ ...s, notes: [...s.notes] }))), 0);
    return () => {
      this.listeners.delete(onChange);
    };
  }

  async updateStatus(id: string, status: Status, by: string) {
    const s = this.items.find((x) => x.id === id);
    if (!s || s.status === status) return;
    const note: Note = { id: uid(), by, text: `changed status from ${STATUS_LABEL[s.status]} to ${STATUS_LABEL[status]}`, at: new Date().toISOString() };
    s.status = status;
    s.notes = [...s.notes, note];
    this.emit();
  }

  async addNote(id: string, text: string, by: string) {
    const s = this.items.find((x) => x.id === id);
    if (!s || !text.trim()) return;
    s.notes = [...s.notes, { id: uid(), by, text: text.trim(), at: new Date().toISOString() }];
    this.emit();
  }
}

let repo: SubmissionsRepository | null = null;

export function getSubmissionsRepository(): SubmissionsRepository {
  // Firebase step: return a FirestoreRepository here when configured.
  if (!repo) repo = new SampleRepository();
  return repo;
}
