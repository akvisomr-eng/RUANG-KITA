# Deployment smoke tests

## Run

In GitHub Actions, select **RUANGKITA deployment smoke test** and choose `production` or `preview`. The workflow makes unauthenticated HTTPS requests only; it does not need database credentials, auth secrets, or paid services.

## What a passing run proves

- The selected origin serves the home page over HTTPS with HTTP 200.
- `/manifest.webmanifest` serves valid install metadata, Indonesian language, standalone display mode, and at least one icon declaration.
- An unauthenticated request to `/api/rooms` is rejected with HTTP 401.

## What it does not prove

A pass is not a commercial launch approval. It does **not** test successful sign-in/sign-out, session restoration, database connectivity or writes, tenant isolation, RLS, invitation expiry, live audio/video, recording consent, Android packaging, physical-device behavior, load, billing, monitoring, privacy compliance, or deployment ownership. Those require separate authenticated and end-to-end tests.

The test deliberately does not send credentials or print environment variables. If a deployment is protected by Vercel Authentication, this public smoke test may fail at the edge; configure a safe test route or authorized test method rather than disabling deployment protection.
