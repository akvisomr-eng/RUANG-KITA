# RUANGKITA commercial readiness gate

Updated: 2026-10-23

## Implemented in code (requires deployment and environment validation)
- Podcast player renders a native HTML audio player only when a public HTTPS audio URL is configured. Episode URLs: `PODCAST_EPISODE_1_AUDIO_URL` through `PODCAST_EPISODE_3_AUDIO_URL`.
- Official channel cards read only configured HTTPS URLs: `PODCAST_SPOTIFY_URL`, `PODCAST_APPLE_URL`, `PODCAST_YOUTUBE_URL`, `PODCAST_INSTAGRAM_URL`, `PODCAST_X_URL`, `PODCAST_OFFICIAL_URL`. Do not invent official account URLs.
- Newsletter and contact forms validate inputs, require explicit consent, reject cross-origin requests, use a honeypot, and persist through the server-side Neon connection. Tables are defined in `db/migrations/20261023_podcast_communications.sql`.
- Public form writes are server-side only; no database credentials are exposed to the browser.

## Required before production
1. Apply the additive migration to the development branch, verify the tables and test inserts, then review and separately apply to production only after approval.
2. Configure real recorded episodes on a controlled HTTPS media host and test playback, CORS/range requests, mobile behavior, licensing, and accessibility. The UI must not treat stock photos or generated audio as published podcast episodes.
3. Set only verified official social/platform URLs.
4. Configure an email provider, sender domain, double opt-in and unsubscribe flow before promising automated newsletters. Contact messages currently persist but do not send notifications.
5. Add edge/WAF rate limits and spam controls. In-process rate limiting is not a production guarantee.
6. Configure a payment provider account, products/prices, webhook signing secret, idempotent webhook handling, entitlement checks, cancellation/refund handling, and test-mode end-to-end tests. Never enable paid checkout without these.
7. Run hosted sign-up/sign-in/sign-out/session restoration, cross-user room isolation, room CRUD, API abuse, accessibility, dependency/security, recovery, and production smoke tests.
8. Configure monitoring, alerting, backup/restore, privacy notice, terms, retention/deletion process and a verified support channel.

## Honest state
This repository work alone does not prove production readiness. Audio and official channels stay unpopulated until verified URLs/assets are provided. Billing is intentionally not represented as active because provider credentials and product configuration are not available in the repository context.
