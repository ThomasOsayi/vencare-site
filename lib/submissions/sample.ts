import type { Audience, Status, Submission } from "./types";

type Row = [id: number, audience: Audience, name: string, email: string, daysAgo: number, status: Status, answers: Record<string, string>, org?: string];

// Clearly fictional sample records so the dashboard can be reviewed before Firebase is connected.
const rows: Row[] = [
  [1, "organization", "Maria Lopez", "maria@example.com", 0.2, "new", { org_type: "Restaurant", locations: "2 to 5", has_approach: "No", most_useful: "Emergency epinephrine access", open_to_more: "Yes", role: "Owner" }, "Sample Taqueria Group"],
  [2, "insurer", "Daniel Kim", "dkim@example.com", 0.6, "new", { ins_book: "500+", ins_interest: "Piloting with a group of accounts", ins_role: "Loss control" }, "Sample MGA"],
  [3, "individual", "Priya Shah", "priya@example.com", 1.1, "new", { describes: "Parent / family member", concerned_access: "Yes", matters_most: "Better preparedness in public places", ready_sign: "Yes, definitely" }],
  [4, "organization", "James Carter", "jcarter@example.com", 1.8, "contacted", { org_type: "Venue", locations: "1", has_approach: "Not sure", most_useful: "Staff awareness / readiness", open_to_more: "Yes", role: "GM" }, "Sample Event Hall"],
  [5, "individual", "Alex Rivera", "alex@example.com", 2.3, "new", { describes: "Someone with food allergies", concerned_access: "Yes", matters_most: "Easier access", ready_sign: "Yes, definitely" }],
  [6, "organization", "Hannah Brooks", "hannah@example.com", 3.1, "in_conversation", { org_type: "Restaurant", locations: "6 to 20", has_approach: "No", most_useful: "Emergency epinephrine access", open_to_more: "Yes", role: "Ops director" }, "Sample Burger Co."],
  [7, "individual", "Sam Patel", "sam@example.com", 3.9, "new", { describes: "Someone with food allergies", concerned_access: "Yes", matters_most: "More awareness", ready_sign: "Somewhat" }],
  [8, "organization", "Olivia Chen", "olivia@example.com", 4.6, "new", { org_type: "School / University", locations: "2 to 5", has_approach: "Yes", most_useful: "A clearer response approach", open_to_more: "Maybe", role: "Dining services" }, "Sample University Dining"],
  [9, "insurer", "Rachel Green", "rgreen@example.com", 5.2, "contacted", { ins_book: "50 to 500", ins_interest: "Loss-control documentation", ins_role: "Underwriting" }, "Sample Insurance Brokers"],
  [10, "individual", "Jordan Lee", "jordan@example.com", 6.4, "closed", { describes: "Healthcare-related", concerned_access: "No", matters_most: "Better information", ready_sign: "No difference" }],
  [11, "organization", "Marcus Hill", "marcus@example.com", 7.5, "pilot", { org_type: "Restaurant", locations: "1", has_approach: "No", most_useful: "Emergency epinephrine access", open_to_more: "Yes", role: "Owner" }, "Sample Pizza Kitchen"],
  [12, "individual", "Emma Wilson", "emma@example.com", 8.2, "new", { describes: "Parent / family member", concerned_access: "Yes", matters_most: "Better preparedness in public places", ready_sign: "Yes, definitely" }],
  [13, "organization", "Noah Adams", "noah@example.com", 9.6, "contacted", { org_type: "Hospitality", locations: "21+", has_approach: "Not sure", most_useful: "Better preparedness guidance", open_to_more: "Yes", role: "Safety lead" }, "Sample Hotels"],
  [14, "individual", "Grace Park", "grace@example.com", 10.4, "new", { describes: "Someone with food allergies", concerned_access: "Prefer not to say", matters_most: "Easier access", ready_sign: "Yes, definitely" }],
  [15, "organization", "Leo Martinez", "leo@example.com", 12.2, "new", { org_type: "Workplace", locations: "1", has_approach: "No", most_useful: "Staff awareness / readiness", open_to_more: "Maybe", role: "HR" }, "Sample Tech Office"],
  [16, "individual", "Mia Thompson", "mia@example.com", 13.5, "closed", { describes: "Parent / family member", concerned_access: "Yes", matters_most: "More awareness", ready_sign: "Somewhat" }],
  [17, "insurer", "Ethan Brown", "ethan@example.com", 15.1, "in_conversation", { ins_book: "500+", ins_interest: "Piloting with a group of accounts", ins_role: "Loss control" }, "Sample Carrier"],
  [18, "individual", "Ava Nguyen", "ava@example.com", 16.8, "new", { describes: "Someone with food allergies", concerned_access: "Yes", matters_most: "Better preparedness in public places", ready_sign: "Yes, definitely" }],
  [19, "organization", "Lucas White", "lucas@example.com", 18.3, "contacted", { org_type: "Restaurant", locations: "2 to 5", has_approach: "No", most_useful: "Emergency epinephrine access", open_to_more: "Yes", role: "GM" }, "Sample Noodle Bar"],
  [20, "individual", "Chloe Davis", "chloe@example.com", 20.9, "new", { describes: "Other", concerned_access: "No", matters_most: "Better information", ready_sign: "Somewhat" }],
  [21, "individual", "Ben Foster", "ben@example.com", 23.4, "closed", { describes: "Someone with food allergies", concerned_access: "Yes", matters_most: "Easier access", ready_sign: "Yes, definitely" }],
  [22, "organization", "Zoe Clark", "zoe@example.com", 26.1, "pilot", { org_type: "Venue", locations: "1", has_approach: "Not sure", most_useful: "Emergency epinephrine access", open_to_more: "Yes", role: "Owner" }, "Sample Stadium Club"],
  [23, "individual", "Ryan Scott", "ryan@example.com", 33.5, "closed", { describes: "Parent / family member", concerned_access: "Yes", matters_most: "Better preparedness in public places", ready_sign: "Yes, definitely" }],
  [24, "organization", "Ella Young", "ella@example.com", 41.2, "closed", { org_type: "Restaurant", locations: "1", has_approach: "Yes", most_useful: "Still exploring", open_to_more: "Not right now", role: "Owner" }, "Sample Cafe"],
  [25, "individual", "Nina Brooks", "nina@example.com", 48.7, "closed", { describes: "Someone with food allergies", concerned_access: "Yes", matters_most: "More awareness", ready_sign: "Somewhat" }],
  [26, "insurer", "Owen Reed", "owen@example.com", 52.2, "closed", { ins_book: "Under 50", ins_interest: "General information", ins_role: "Broker" }, "Sample Agency"],
];

export function sampleSubmissions(now = Date.now()): Submission[] {
  const day = 864e5;
  return rows.map(([id, audience, name, email, daysAgo, status, answers, org]) => ({
    id: `sample-${id}`,
    audience,
    name,
    email,
    org,
    createdAt: new Date(now - daysAgo * day - ((id * 37) % 600) * 6e4).toISOString(),
    status,
    answers,
    notes: [],
    source: "website",
  }));
}
