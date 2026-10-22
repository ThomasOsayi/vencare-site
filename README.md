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

### Firebase (project `vencare-c1826`)

- **Auth:** Google sign-in. Access is limited to emails listed in the Firestore `admins` collection (doc id = lowercased email).
  Add people in the Firebase console (Firestore > `admins` > Add document) or with `node --env-file=.env.local scripts/add-admin.mjs person@example.com` (needs a service account).
- **Data:** website submissions land in `submissions`. `/api/interest` writes them with the web SDK (rules only allow a well-formed new
  submission, and nobody but admins can read them). If `FIREBASE_CLIENT_EMAIL`/`FIREBASE_PRIVATE_KEY` are set it uses the Admin SDK instead.
- **Rules:** `firestore.rules` (published in the console). Admins can only change `status`, `notes`, `updatedAt`.
- **Config:** the public web config is in `lib/firebase/config.ts`; `NEXT_PUBLIC_FIREBASE_*` env vars override it.
- **After deploying:** add the Vercel domain under Firebase console > Authentication > Settings > Authorized domains, or Google sign-in will be blocked there.

### Testing against the emulators

```bash
npx firebase emulators:start --only auth,firestore --project demo-vencare
NEXT_PUBLIC_FIREBASE_API_KEY=demo NEXT_PUBLIC_FIREBASE_PROJECT_ID=demo-vencare NEXT_PUBLIC_FIREBASE_EMULATORS=1 npm run build && npm start
APP_URL=http://localhost:3000 node scripts/emulator-test.mjs   # API + security rules checks
```
In emulator builds, `window.__testSignIn(email)` signs in without the Google popup.

## Form submissions

The interest form posts to `/api/interest`, which validates each response, saves it to Firestore, and optionally forwards it as JSON to `FORM_WEBHOOK_URL`
(set it in Vercel > Project > Settings > Environment Variables). Point it at the same sheet or tool the standalone surveys use
(Google Apps Script web app, Zapier/Make webhook, etc.). Each submission includes `audience`: `organization`, `individual` or `insurer`.

## Before launch

- [ ] Add the Vercel domain to Firebase Auth authorized domains
- [ ] (Optional) Set `FORM_WEBHOOK_URL` to also send responses to the survey sheet
- [ ] Add the two full-survey links (`SURVEY_LINKS` in `components/InterestForm.tsx`)
- [ ] Replace `[PRICE]` placeholders
- [ ] Confirm the legal FAQ answer with counsel
- [ ] Swap the placeholder logo (`app/icon.svg`, `LogoMark` in `components/icons.tsx`) for the final brand files
- [ ] Confirm the "VenCare Ready" program and readiness dashboard preview with the founders
