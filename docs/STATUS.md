# RUANGKITA status

## Verified as of 2026-10-23

- Repository: https://github.com/akvisomr-eng/RUANG-KITA
- Starter UI, Next.js App Router, TypeScript, static checks, and CI workflow are committed on `main`.
- The earlier starter commit `9b06bdc` passed static checks, TypeScript, ESLint, and production build before auth/room additions. Every later change must be re-verified against the current commit in [GitHub Actions](https://github.com/akvisomr-eng/RUANG-KITA/actions); the latest Vercel status observed during this work was pending.
- Next.js is pinned to `16.4.2`; React is pinned to `19.3.1`.
- Neon project `mute-cherry-80708442` has separate production and development branches.
- Neon Auth (Managed Better Auth) is provisioned on development branch `br-noisy-rain-b4eivynk`. On 2026-10-23, additive `newsletter_subscriptions`, `contact_messages`, `billing_webhook_events`, `billing_subscriptions`, and `public_form_rate_limits` tables/indexes were applied to development and production branches; existing tables were not modified. Application forms still need hosted smoke tests.
- Auth server/client wiring, sign-in/sign-up routes, authenticated dashboard, and server-side room list/create API are committed.
- The room API checks the server session, validates title/privacy/scene preset, scopes room listing to the authenticated owner, and writes an audit event when creating a draft. These flows have not yet been verified through a real hosted browser session.
- `.env.example` documents both server-side `NEON_AUTH_BASE_URL` and browser-side `NEXT_PUBLIC_NEON_AUTH_URL`; deployment values must match the same development Auth endpoint for preview testing.
- Neon development tables have RLS disabled and there are no policies yet. The app must not expose direct browser database access; RLS policy design and tests remain a release gate.
- No WebRTC/SFU, live streaming, recording, private media storage, billing, or production monitoring is implemented/verified.
- Vercel deployment/project metadata and protected URLs remain inaccessible to the connected integration (HTTP 403 for team scope `akvisio-autohost`). Existing deployment links are known, but current runtime/build status could not be independently inspected.

## Commercial release gate

Do not call RUANGKITA commercially live until:
1. Latest CI passes for the current source.
2. Development authentication sign-up/sign-in/sign-out/session restoration and protected access are exercised.
3. Database access is securely configured; ownership checks, RLS policy plan, rate limits, and audit behavior are tested.
4. Room lifecycle and invitation/participant roles work end-to-end.
5. A WebRTC/SFU provider is configured and real multi-participant media is tested.
6. Recording consent, local/offline recording, private uploads, retention, and export are tested.
7. A hosting project is authorized, environment variables and trusted domains are configured, and production smoke tests/monitoring are verified.
8. Privacy/terms pages, incident/recovery plan, provider limits, and real operating-cost ceilings are documented.
