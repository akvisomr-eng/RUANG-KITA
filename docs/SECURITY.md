# Security gates

- No secret in client bundles, logs, repository, or NEXT_PUBLIC variables.
- Verify workspace/room ownership server-side on every protected request.
- Room credentials must be short-lived and scoped to room/role.
- Recording requires visible status and consent; keep audit trail.
- Personal likeness/avatar uploads require consent and license provenance.
- Rate-limit auth, room creation, invitation, and AI endpoints.
- Validate MIME type, size, and ownership for uploaded media.
- Do not enable RLS until the identity claim mapping and policies have been tested on development.
- Keep production schema unchanged until a reviewed migration is validated on a development branch.
