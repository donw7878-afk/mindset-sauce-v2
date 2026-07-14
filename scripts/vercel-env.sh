#!/usr/bin/env bash
# Push production env vars to Vercel: values from .env.local, with
# production overrides (live Stripe keys, site URL, auth URL, production
# webhook secret) read from .env.production.local — which is gitignored
# and must never be committed. Run after `vercel login` + `vercel link`,
# from the repo root:
#   bash scripts/vercel-env.sh
# (bash 3.2 compatible — macOS default shell has no associative arrays)
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env.production.local ]; then
  echo "missing .env.production.local — create it with the live Stripe keys,"
  echo "STRIPE_WEBHOOK_SECRET, AUTH_URL and NEXT_PUBLIC_SITE_URL overrides."
  exit 1
fi

get() { grep -E "^$2=" "$1" 2>/dev/null | head -1 | cut -d= -f2- ; }

KEYS="STRIPE_SECRET_KEY NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY STRIPE_PRICE_ID \
STRIPE_COUPON_ID STRIPE_WEBHOOK_SECRET \
RESEND_API_KEY EMAIL_FROM_VAULT EMAIL_FROM_INSTITUTE EMAIL_FROM_DON \
NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY SUPABASE_SERVICE_ROLE_KEY \
AUTH_SECRET AUTH_URL NEXT_PUBLIC_SITE_URL"

for key in $KEYS; do
  # Production override wins; .env.local fills in the rest.
  value="$(get .env.production.local "$key")"
  if [ -z "$value" ]; then
    value="$(get .env.local "$key")"
  fi
  if [ -z "$value" ]; then
    echo "  ! $key is empty — skipped"
    continue
  fi
  npx vercel env rm "$key" production --yes >/dev/null 2>&1 || true
  printf '%s' "$value" | npx vercel env add "$key" production >/dev/null
  echo "  ✓ $key"
done
echo "done — production env is set."
