# RUANGKITA

AI Virtual Podcast & Live Production Platform.

> **Current status:** application foundation and first authenticated draft-room API are in the repository. This is **not yet a live podcast or commercial service**. Live media transport, recording, streaming, private media storage, billing, production monitoring, and end-to-end verification remain outstanding.

## Local development

1. Copy `.env.example` to `.env.local`.
2. Set `DATABASE_URL` to the **development branch** connection string.
3. Set `NEON_AUTH_COOKIE_SECRET` to a unique secret generated with `openssl rand -base64 32`.
4. Keep `NEON_AUTH_BASE_URL` pointed at the matching development branch.
5. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000. Sign-in and sign-up routes are under `/auth/sign-in` and `/auth/sign-up`; the authenticated dashboard is `/dashboard`.

## Checks

```bash
npm run test:static
npm run typecheck
npm run lint
npm run build
```

Latest verified successful CI before the auth/room additions: commit `9b06bdc` (static checks, typecheck, lint, build). Newer auth/room changes are being revalidated; see [GitHub Actions](https://github.com/akvisomr-eng/RUANG-KITA/actions) for the latest result.

## Security and product principles

- Free-tier-first; never assume unlimited compute, storage, egress, or media capacity.
- Use development branches first; production database was not modified during the current work.
- Server-side session and ownership checks are mandatory; client state is not a security boundary.
- Recording requires explicit consent and visible recording state.
- Personal likeness/avatar assets require consent and license provenance.
- AI must remain outside the real-time media critical path.
- Do not claim commercial readiness until media, privacy, security, load, and production smoke tests pass.

## Implementation roadmap

1. Complete and verify authentication + draft-room CRUD on the development branch.
2. Configure a deploy host and branch-specific environment variables.
3. Implement room invitations, roles, and short-lived room credentials.
4. Integrate and test a WebRTC/SFU provider for real multi-participant audio/video.
5. Add local/offline recording, private media storage, consent and retention workflows.
6. Add quotas, monitoring, recovery, legal/privacy pages, and monetization only after usage/cost limits are measured.
7. Run security, accessibility, cross-browser/mobile, and target load tests before production launch.

See `docs/` for architecture, security gates, free-tier policy, and verified status.
