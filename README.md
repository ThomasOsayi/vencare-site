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

- `app/page.tsx` composes the homepage sections
- `app/globals.css` design system (brand tokens, layout, motion). Tailwind v4 is installed for utilities.
- `components/` sections (`Hero`, `EmergencySequence`, `Sections`, `Faq`, `InterestForm`, `Header`)
- `components/AudienceContext.tsx` shares the selected audience (venue / individual / insurer) between the hero CTA, insurer CTA and the form
- `app/api/interest/route.ts` receives form submissions
- `public/assets/` images (WebP)

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
