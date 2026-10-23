# RUANGKITA commercial readiness gate

Updated: 2026-10-23

## Implemented in code (still requires hosted validation)
- Podcast player renders a native HTML audio player only when a public HTTPS audio URL is configured: `PODCAST_EPISODE_1_AUDIO_URL` through `PODCAST_EPISODE_3_AUDIO_URL`.
- Official platform cards read only configured HTTPS URLs: `PODCAST_SPOTIFY_URL`, `PODCAST_APPLE_URL`, `PODCAST_YOUTUBE_URL`, `PODCAST_INSTAGRAM_URL`, `PODCAST_X_URL`, `PODCAST_OFFICIAL_URL`. Do not invent official accounts.
- Newsletter and contact forms validate input, require explicit consent, reject cross-origin requests, use a honeypot, and persist via the server-side Neon connection. Automated email sending, double opt-in, unsubscribe, and contact notifications are not implemented.
- A fail-closed Stripe Checkout endpoint, signed webhook verification, subscription status endpoint, pricing UI, and webhook/subscription tables are implemented. Checkout is disabled until provider credentials, product price, HTTPS URL, and webhook configuration are set.
- Security headers are configured in `next.config.ts`; `/api/health` checks database connectivity without exposing secrets.
- The additive migration has been applied to Neon development branch `br-noisy-rain-b4eivynk`; schema inspection confirmed all four tables. Production schema was not changed.

## Required before production
1. Supply real recorded episodes and verify playback, range requests, mobile behavior, rights and accessibility. Stock images are not published episodes.
2. Set only verified official channel URLs.
3. Configure an email provider, verified sender domain, double opt-in, unsubscribe flow and contact notifications before sending campaigns.
4. Add edge/WAF rate limiting and spam controls; origin checks and honeypots alone are insufficient.
5. Configure a payment provider account, real product/price ID, webhook signing secret, cancellation/refund handling, idempotency tests and end-to-end test-mode payments. Enforce subscription entitlements on protected features before charging users.
6. Test hosted sign-up/sign-in/sign-out/session restoration, cross-user room isolation, room CRUD and media flows. Current room API has not been validated through a real hosted browser session.
7. Review RLS/DB access, rate limits, accessibility, dependency/security, backup/restore, alerting, privacy notice, terms, retention/deletion, support and production smoke tests.
8. Implement/test WebRTC/SFU, recording consent, storage/retention and real multi-participant audio/video before marketing RUANGKITA as a live production studio.

## Honest state
This code work does not establish full commercial readiness. Audio and channel URLs remain blank until real assets/accounts are supplied. Newsletter/contact persistence is implemented in the development schema, but notifications and unsubscribe are not. Billing remains fail-closed. No production schema changes were made.
