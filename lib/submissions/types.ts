/**
 * Shared data model for interest-form submissions.
 * Mirrors the Firestore document shape planned for the `submissions` collection.
 */

export type Audience = "organization" | "individual" | "insurer";
export type Status = "new" | "contacted" | "in_conversation" | "pilot" | "closed";

export interface Note {
  id: string;
  by: string;
  text: string;
  /** ISO timestamp */
  at: string;
}

export interface Submission {
  id: string;
  audience: Audience;
  name: string;
  email: string;
  /** Organization / company name, when the audience has one */
  org?: string;
  /** ISO timestamp */
  createdAt: string;
  status: Status;
  /** Raw form answers keyed by field name (org_type, locations, ins_book, ...) */
  answers: Record<string, string>;
  /** Internal notes and status changes, oldest first */
  notes: Note[];
  source?: "website" | "survey";
}

export const AUDIENCE_LABEL: Record<Audience, string> = {
  organization: "Venue / org",
  individual: "Individual",
  insurer: "Insurer",
};

export const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  in_conversation: "In conversation",
  pilot: "Pilot",
  closed: "Closed",
};

export const ANSWER_LABEL: Record<string, string> = {
  org_type: "Organization type",
  locations: "Locations",
  has_approach: "Clear approach today?",
  most_useful: "Most useful",
  open_to_more: "Open to learning more?",
  role: "Role",
  notes: "Notes",
  describes: "Describes them",
  concerned_access: "Worried about access outside home?",
  matters_most: "Matters most",
  ready_sign: "VenCare Ready sign would influence choice?",
  help_most: "Wants help with",
  ins_book: "Restaurant accounts in book",
  ins_interest: "Interested in",
  ins_role: "Role",
  ins_notes: "Notes",
};
