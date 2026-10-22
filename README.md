# VenCare website

Marketing site for VenCare: an on-site emergency epinephrine station for restaurants and public venues. Like an AED, but for severe allergic reactions.

Next.js (App Router) + TypeScript, deployed on Vercel.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run typecheck
```

## Structure

- `app/(site)/` marketing site (`page.tsx` composes the homepage sections)
- `app/globals.css` design system (brand tokens, layout, motion). Tailwind v4 is installed for utilities.
- `components/` sections (`Hero`, `EmergencySequence`, `Sections`, `Faq`, `InterestForm`, `Header`)
- `components/AudienceContext.tsx` shares the selected audience (venue / individual / insurer) between the hero CTA, insurer CTA and the form
- `app/api/interest/route.ts` receives form submissions
- `public/assets/` images (WebP)

## Admin dashboard (`/admin`)

Intake dashboard for form responses: overview (KPIs, weekly volume, follow-up list, lead pipeline),
a filterable submissions table with a detail drawer (status, internal notes, activity, email), insights per survey question, and CSV export.

- `app/admin/` has its own root layout and `admin.css`, isolated from the marketing site styles, and is `noindex`
- `components/admin/` UI
- `lib/submissions/` data model (`types.ts`), helpers, sample data, and `repository.ts`

**Currently runs on sample data and has no login.** The Firebase step:
1. Add `FirestoreRepository` in `lib/submissions/repository.ts` (`onSnapshot` for `subscribe`, `updateDoc`/`arrayUnion` for status and notes) and return it from `getSubmissionsRepository()`
2. Write website submissions to the `submissions` collection from `app/api/interest/route.ts` (firebase-admin)
3. Gate `/admin` with Firebase Auth (Google sign-in) plus an allowlist, and lock Firestore rules to admins

## Form submissions

The interest form posts to `/api/interest`, which validates and forwards each response as JSON to `FORM_WEBHOOK_URL`
(set it in Vercel > Project > Settings > Environment Variables). Point it at the same sheet or tool the standalone surveys use
(Google Apps Script web app, Zapier/Make webhook, etc.). Each submission includes `audience`: `organization`, `individual` or `insurer`.
Without the env var, submissions are logged to the Vercel runtime logs.

## Before launch

- [ ] Set `FORM_WEBHOOK_URL`
- [ ] Add the two full-survey links (`SURVEY_LINKS` in `components/InterestForm.tsx`)
- [ ] Replace `[PRICE]` placeholders
- [ ] Confirm the legal FAQ answer with counsel
- [ ] Swap the placeholder logo (`app/icon.svg`, `LogoMark` in `components/icons.tsx`) for the final brand files
- [ ] Confirm the "VenCare Ready" program and readiness dashboard preview with the founders
