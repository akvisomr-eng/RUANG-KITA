# Architecture

- Next.js App Router + TypeScript web/PWA UI.
- Neon PostgreSQL stores metadata only; start in the development branch.
- Identity and authorization must be implemented and tested before enabling RLS policies.
- Browser media uses WebRTC; multi-party production needs a validated SFU, capacity and region plan.
- Store user uploads privately with access controls and retention rules.
- AI suggestions must not sit in the real-time media critical path.
- Room roles, quota enforcement, recording state, and permission checks must be deterministic server-side logic.

## Planned service boundaries
1. Authentication/session and workspace ownership.
2. Room lifecycle and participant membership.
3. Consent and audit events.
4. Asset metadata/license provenance.
5. Media transport / SFU adapter.
6. Recording and export jobs.
7. Quotas and future billing.
