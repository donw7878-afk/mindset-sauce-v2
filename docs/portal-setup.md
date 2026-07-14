# Builder Portal — Setup & Operations

Phase Three. Part 1: the authenticated Builder Portal at `/vault`.
Part 2: the 7-email Builder Path onboarding drip.

## One-time setup

1. **Create the tables.** Open the Supabase Dashboard → SQL Editor → New
   query, paste the whole of `supabase/schema.sql`, and run it. Nothing in
   the portal works until this exists.

2. **Env vars** (already in `.env.local`): Supabase URL + keys, `AUTH_SECRET`
   (generated), Resend, Stripe. Optional: `NEXT_PUBLIC_COMMUNITY_URL` — the
   dashboard's Community card reads "Opening soon" until it is set.
   In production also set `AUTH_URL=https://yourdomain.com` and
   `NEXT_PUBLIC_SITE_URL` to match.

3. **Upload media to Storage** (production; optional in dev):
   `node scripts/upload-media.mjs` — creates private `audio-vault` and
   `archive` buckets and uploads the 24 mp3s + 7 PDFs from `assets/`.
   The media routes prefer signed Storage URLs and fall back to streaming
   the local `assets/` files, so dev works without this step.

4. **Test without buying:** `node scripts/seed-builder.mjs you@example.com "Your Name"`
   puts an entry on the builders ledger, then sign in at `/login`.

## How access works

- **Purchase → entitlement.** The Stripe webhook (`payment_intent.succeeded`)
  upserts a row into `builders` (and dedupes events via `stripe_events`).
  The ndjson files remain as a local fallback record.
- **Login = The Door.** `/login` asks for the email on the ledger, emails a
  six-digit single-use combination from vault@ (10-minute expiry, hashed at
  rest, max 5 per 10 minutes), and NextAuth (JWT, 30 days) opens the session.
  Only emails present in `builders` can ever receive a code.
- **Gating.** `src/middleware.ts` protects `/vault/*`; API routes under
  `/api/vault` and `/api/media` answer 401 without a session. All Supabase
  access is server-side with the service-role key; RLS blocks the anon key
  entirely.

## What the portal computes

- **Sequential unlock:** module N opens when module N−1 has all 4 chapters
  sealed; within a module the four chapters unlock in order. Enforced
  server-side in `recordChapterComplete`.
- **Chapter completion:** finishing a track's audio auto-seals that chapter;
  every chapter also has a manual "Mark complete" action.
- **Builder Score:** `50·chapters + 100·modules + 10·active days + 70 (streak≥7) + 300 (streak≥30)`.
- **Streak:** consecutive `activity_days`; a day becomes active by sealing a
  chapter, listening ≥30s, or checking in Today's Executable. Grace: the
  streak survives until a full day is missed.
- **Audio resume:** positions persist per track (5s heartbeat + beacon on tab
  hide) in `audio_positions` — resume on any device.
- **Certificate:** unlocks at 24/24; `/vault/certificate` renders it with the
  Builder's name + Builder Number (print/save as PDF).

## The Builder Path (post-purchase onboarding)

Seven letters, scheduled in full by the Stripe webhook at purchase via
Resend `scheduled_at` (all inside the 30-day window). Content in
`src/lib/emails/onboarding.ts`, machinery in `src/lib/emails/onboard.ts`.

| Nº | When | From | Subject |
|----|------|------|---------|
| 1 | Day 0 (+2h) | vault@ | Welcome inside — start with the Owner's Manual |
| 2 | Day 1 | vault@ | How to use the Workbook — your transformation starts on paper |
| 3 | Day 3 | don@ | Module 1 is unlocked — here's what to expect |
| 4 | Day 5 | vault@ | Your first audio session — the Audio Vault is open |
| 5 | Day 7 | don@ | One week in — how's your Builder Streak? |
| 6 | Day 14 | don@ | Midpoint — you're deeper than most people ever go |
| 7 | Day 21 | vault@ | The Certificate is within reach — finish strong |

Letter 1 is offset two hours so it doesn't stack on the Access Granted
receipt. Every CTA lands on `/vault` (letter 4 on `/vault/audio`).

- **On purchase** the webhook (in order): cancels remaining pre-purchase
  nurture letters → sends Access Granted → schedules the Builder Path
  (via `after()`, so Stripe's 200 never waits on Resend's 2 req/s).
- **Idempotent:** scheduled ids live in `onboarding_emails`; an existing
  row for the address means retries/repeat purchases schedule nothing.
- **Refunds:** call `cancelOnboarding(email)` to cancel unsent letters.
- **Preview in dev:** `/api/dev/onboarding-preview?n=1…7` (404 in prod).
- If you ran `schema.sql` before Part 2, re-run it (idempotent) to add
  the `onboarding_emails` table.

## Known gaps

- No Workbook PDF exists in `assets/` — the Archive shows it as "arriving",
  and The Practice links the Tracker meanwhile. Drop the file in, add its
  path in `ARCHIVE` (`src/lib/tracks.ts`), re-run the upload script.
