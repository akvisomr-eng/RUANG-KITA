# RUANGKITA status

## Verified as of 2026-10-23

- Repository: https://github.com/akvisomr-eng/RUANG-KITA
- Starter UI, Next.js App Router, TypeScript, static checks, and CI workflow are committed on `main`.
- Commit `9b06bdc` passed static checks, TypeScript, ESLint, and production build before auth/room additions.
- Next.js is pinned to patched release `16.4.2`; React is pinned to `19.3.1`.
- Neon project `mute-cherry-80708442` has separate production and development branches.
- Neon Auth (Managed Better Auth) is provisioned on development branch `br-noisy-rain-b4eivynk` only. Production branch was not changed.
- Auth server/client wiring, sign-in/sign-up routes, authenticated dashboard, and server-side room list/create API have been added to the repository.
- The room API checks the server session, validates title/privacy/scene preset, scopes room listing to the authenticated owner, and writes an audit event when creating a draft.
- Auth/room code has not yet passed a final complete CI run. Earlier CI runs caught and corrected a lint issue in the room manager; the latest run must be checked for the final result.
- Neon development tables have RLS disabled and there are no policies yet. The app must not expose direct browser database access; RLS policy design and tests remain a release gate.
- No WebRTC/SFU, live streaming, recording, private media storage, billing, or production monitoring is implemented/verified.
- Vercel project creation for this repo was denied by the connected integration with HTTP 403. No Vercel project or public deployment URL was created.
- The local `.env.example` contains placeholders only. The real database connection string and cookie secret must be configured securely in the deployment environment, never committed.

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
