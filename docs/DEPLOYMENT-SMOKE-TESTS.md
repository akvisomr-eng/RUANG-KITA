# Deployment smoke tests

## Run

In GitHub Actions, select **RUANGKITA deployment smoke test** and choose `production` or `preview`. The workflow makes unauthenticated HTTPS requests; it does not need database credentials.

If the preview is protected by Vercel SSO, configure Vercel's **Automation Bypass Secret** for the project, then add the same value in GitHub repository **Settings → Secrets and variables → Actions** as `VERCEL_AUTOMATION_BYPASS_SECRET`. The test sends this value only as the `x-vercel-protection-bypass` request header and never prints it. Do not disable deployment protection to make the smoke test pass. If this secret is not configured, a protected preview can return a redirect and the test will fail with a diagnostic hint.

## What a passing run proves

- The selected origin serves the home page over HTTPS with HTTP 200.
- `/manifest.webmanifest` serves valid install metadata, Indonesian language, standalone display mode, and at least one icon declaration.
- An unauthenticated request to `/api/rooms` is rejected with HTTP 401 after the deployment edge allows the request through.

## What it does not prove

A pass is not a commercial launch approval. It does **not** test successful sign-in/sign-out, session restoration, database connectivity or writes, tenant isolation, RLS, invitation expiry, live audio/video, recording consent, Android packaging, physical-device behavior, load, billing, monitoring, privacy compliance, or deployment ownership. Those require separate authenticated and end-to-end tests.

The test does not send database credentials or print environment variables. The bypass secret, if configured, is only used to access the protected preview and does not authenticate to the app itself.
