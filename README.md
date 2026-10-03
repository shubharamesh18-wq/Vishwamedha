# Vishwamedha Consultancy Services — Website (Phase 1)

Next.js (App Router) + TypeScript + Tailwind CSS v4, built for Vercel.

## Pages
`/` Home · `/about` · `/founders` · `/services` (+ mega-menu) · `/services/[management-systems | hr-consultancy | academy-training]` · `/academy` (23 batches, filters, enquiry links) · `/industries` · `/contact` (working enquiry form + map) · sitemap, robots, 404.

## Run locally
```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Deploy on Vercel
1. Push this folder to the `Vishwamedha` GitHub repo.
2. Import the repo in Vercel (framework: Next.js; no build settings needed).
3. Add environment variables (see `.env.example`):
   - `NEXT_PUBLIC_SITE_URL` – your live domain (used for canonical links, sitemap, social cards)
   - `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` – the contact form emails enquiries via Resend. **Without these the form shows a "temporarily unavailable, please call or email" message in production** (it never silently drops enquiries).
4. Deploy, then submit a test enquiry.

## Where to edit content
| What | File |
|---|---|
| Address, phones, email, LinkedIn URL, founders' bios | `lib/site.ts` |
| Services, industries, "Why VCS" copy | `lib/services.ts` |
| Training batches (dates, fees, syllabus) | `data/courses.json` (from `course_calendar_events.csv`) |
| Colours and fonts | `app/globals.css` (`@theme`) |

Batches whose end date has passed are hidden automatically (page refreshes daily).

## Phase 2 (not built yet)
Booking form, seat availability, booking references, Razorpay payment + server-side verification + webhooks, confirmation/admin emails, booking management, database. Secrets (`RAZORPAY_*`) will live only in Vercel environment variables.
