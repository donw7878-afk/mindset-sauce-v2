-- ============================================================
-- THE MINDSET SAUCE INSTITUTE™ — Builder Portal schema
-- Run once in the Supabase SQL Editor (Dashboard → SQL → New query).
--
-- All access goes through the server with the service-role key;
-- RLS is enabled with no anon policies, so the anon key can read
-- nothing. The browser never talks to these tables directly.
-- ============================================================

-- The ledger. One row per Builder, written by the Stripe webhook.
create table if not exists public.builders (
  id             uuid primary key default gen_random_uuid(),
  email          text not null unique,
  name           text not null default 'Builder',
  builder_number text,
  payment_intent text unique,
  product        text,
  amount_paid    integer,
  coupon         text,
  livemode       boolean not null default false,
  purchased_at   timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

-- One-time combination codes for The Door (login).
create table if not exists public.login_codes (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  code_hash   text not null,
  expires_at  timestamptz not null,
  consumed_at timestamptz,
  created_at  timestamptz not null default now()
);
create index if not exists login_codes_email_idx
  on public.login_codes (email, created_at desc);

-- 24 chapters across 6 modules. A row means the chapter is sealed.
create table if not exists public.chapter_progress (
  id           uuid primary key default gen_random_uuid(),
  builder_id   uuid not null references public.builders(id) on delete cascade,
  module       int  not null check (module between 1 and 6),
  chapter      int  not null check (chapter between 1 and 4),
  completed_at timestamptz not null default now(),
  unique (builder_id, module, chapter)
);

-- Per-track playback position — resume on any device.
create table if not exists public.audio_positions (
  builder_id uuid not null references public.builders(id) on delete cascade,
  track_id   text not null,
  seconds    double precision not null default 0,
  duration   double precision,
  updated_at timestamptz not null default now(),
  primary key (builder_id, track_id)
);

-- One row per active day — the Builder Streak is computed from these.
create table if not exists public.activity_days (
  builder_id uuid not null references public.builders(id) on delete cascade,
  day        date not null,
  primary key (builder_id, day)
);

-- Recent Wins feed: chapter seals, chamber seals, streaks, check-ins.
create table if not exists public.wins (
  id         uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.builders(id) on delete cascade,
  kind       text not null,
  label      text not null,
  created_at timestamptz not null default now()
);
create index if not exists wins_builder_idx
  on public.wins (builder_id, created_at desc);

-- Builder Assessment leads — written by /api/lead at capture time.
create table if not exists public.leads (
  id             uuid primary key default gen_random_uuid(),
  email          text not null,
  name           text not null,
  score          int,
  archetype      text,
  obstacle       text,
  builder_number text,
  answers        jsonb,
  coupon         text,
  captured_at    timestamptz not null default now()
);
create index if not exists leads_email_idx on public.leads (email, captured_at desc);

-- Pre-purchase nurture letters — scheduled ids per lead, cancelled by
-- the Stripe webhook on purchase.
create table if not exists public.nurture_emails (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  resend_ids   text[] not null default '{}',
  enrolled_at  timestamptz not null default now(),
  cancelled_at timestamptz
);
create index if not exists nurture_email_idx on public.nurture_emails (email);

-- The Builder Path — scheduled onboarding letter ids per Builder,
-- recorded so the sequence can be cancelled (e.g. on refund).
create table if not exists public.onboarding_emails (
  id           uuid primary key default gen_random_uuid(),
  email        text not null,
  resend_ids   text[] not null default '{}',
  enrolled_at  timestamptz not null default now(),
  cancelled_at timestamptz
);
create index if not exists onboarding_email_idx
  on public.onboarding_emails (email);

-- Stripe event dedupe — the webhook is idempotent across deploys.
create table if not exists public.stripe_events (
  id         text primary key,
  created_at timestamptz not null default now()
);

-- Lock everything down: service role bypasses RLS, anon sees nothing.
alter table public.builders         enable row level security;
alter table public.login_codes      enable row level security;
alter table public.chapter_progress enable row level security;
alter table public.audio_positions  enable row level security;
alter table public.activity_days    enable row level security;
alter table public.wins              enable row level security;
alter table public.leads             enable row level security;
alter table public.nurture_emails    enable row level security;
alter table public.onboarding_emails enable row level security;
alter table public.stripe_events     enable row level security;
