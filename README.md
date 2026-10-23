# RUANGKITA

AI Virtual Podcast & Live Production Platform.

> **Status:** visual starter only. Authentication, database integration, live media, recording, and streaming are not implemented. See `docs/STATUS.md` for verified facts in the starter package.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Technical principles

- Free-tier-first without assuming unlimited free usage.
- Development branches first; never test migrations directly on production.
- AI is outside the real-time media critical path.
- Server-side authorization is mandatory; client state is not a security boundary.
- Recording and personal likeness use require explicit consent.
- Do not claim live media or commercial readiness before evidence-based testing.

## Implementation roadmap

1. Import the reviewed starter package and establish CI.
2. Define and test identity/authentication and tenant authorization before enabling database RLS.
3. Add secure room lifecycle and short-lived room tokens.
4. Integrate WebRTC/SFU only after selecting and validating the free-tier and deployment limits.
5. Add private media storage, consent/audit workflows, and offline recording.
6. Run functional, security, accessibility, and load tests before any commercial-readiness claim.

See the starter package's `docs/` directory for architecture, security gates, free-tier policy, and verified status.
