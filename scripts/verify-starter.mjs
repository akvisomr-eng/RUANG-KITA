import { readFileSync, existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
assert.equal(pkg.name, 'ruangkita');
assert.ok(existsSync('app/page.tsx'));
assert.ok(existsSync('app/layout.tsx'));
assert.ok(existsSync('app/globals.css'));
assert.ok(existsSync('docs/ARCHITECTURE.md'));
assert.ok(existsSync('.github/workflows/ci.yml'));

const page = readFileSync('app/page.tsx', 'utf8');
assert.match(page, /Pratinjau, belum live/);
assert.match(page, /Preset disimpan bersama draft ruang/);
for (const slug of ['podcast-formal', 'community-talk', 'podcast-hybrid', 'audio-first']) {
  assert.ok(page.includes(slug), `Missing production preset mapping: ${slug}`);
}

const envExample = readFileSync('.env.example', 'utf8');
assert.match(envExample, /^NEXT_PUBLIC_NEON_AUTH_URL=/m);
assert.match(envExample, /^NEON_AUTH_BASE_URL=/m);
assert.match(envExample, /^DATABASE_URL=/m);

const authServer = readFileSync('lib/auth/server.ts', 'utf8');
assert.match(authServer, /NEON_AUTH_BASE_URL/);
assert.match(authServer, /NEON_AUTH_COOKIE_SECRET/);
assert.match(authServer, /cookieSecret\.length < 32/);

const roomApi = readFileSync('app/api/rooms/route.ts', 'utf8');
// Regression guards: room data must remain session-gated and owner-scoped.
assert.match(roomApi, /async function getUser\(\)/);
assert.match(roomApi, /auth\.getSession\(\)/);
assert.match(roomApi, /if \(!user\) return Response\.json\(\{ error: "Unauthorized" \}, \{ status: 401 \}\)/);
assert.match(roomApi, /WHERE r\.owner_subject = \$\{user\.id\}/);
// Mutations must reject cross-origin requests and validate untrusted input.
assert.match(roomApi, /requestOrigin !== requestUrl\.origin/);
assert.match(roomApi, /Title must contain 1–160 characters/);
assert.match(roomApi, /Invalid privacy mode/);
assert.match(roomApi, /Scene preset is unavailable/);
assert.match(roomApi, /'room\.create'/);
assert.match(roomApi, /INSERT INTO audit_events/);
// This API creates drafts only; do not silently start a broadcast.
assert.match(roomApi, /INSERT INTO podcast_rooms/);
assert.doesNotMatch(roomApi, /INSERT INTO room_participants/);
assert.doesNotMatch(roomApi, /startBroadcast|startStream|recordingStart/i);

const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
for (const script of ['test:static', 'typecheck', 'lint', 'build']) {
  assert.ok(ci.includes(`npm run ${script}`), `CI is missing ${script}`);
}

console.log('RUANGKITA static and security-regression checks passed.');


// Release-gate regression checks for newly connected public and billing APIs.
const podcastIntegrations = readFileSync('app/podcast/integrations.tsx', 'utf8');
assert.match(podcastIntegrations, /<audio controls preload="none"/);
assert.match(podcastIntegrations, /PodcastEpisodePlayer/);
assert.match(podcastIntegrations, /consent/);
assert.match(podcastIntegrations, /new FormData\(event\.currentTarget\)/);
const podcastConfig = readFileSync('app/api/podcast/config/route.ts', 'utf8');
assert.match(podcastConfig, /protocol === "https:"/);
assert.match(podcastConfig, /PODCAST_EPISODE_/);
const newsletterApi = readFileSync('app/api/newsletter/route.ts', 'utf8');
assert.ok(newsletterApi.includes('origin !== new URL(request.url).origin'));
assert.match(newsletterApi, /input\.consent !== true/);
const contactApi = readFileSync('app/api/contact/route.ts', 'utf8');
assert.match(contactApi, /contact_messages/);
assert.match(contactApi, /input\.consent !== true/);
const checkoutApi = readFileSync('app/api/billing/checkout/route.ts', 'utf8');
assert.match(checkoutApi, /STRIPE_SECRET_KEY/);
assert.match(checkoutApi, /auth\.getSession\(\)/);
assert.match(checkoutApi, /checkout\.stripe\.com/);
const webhookApi = readFileSync('app/api/billing/webhook/route.ts', 'utf8');
assert.match(webhookApi, /timingSafeEqual/);
assert.match(webhookApi, /STRIPE_WEBHOOK_SECRET/);
assert.match(webhookApi, /billing_webhook_events/);
const migration = readFileSync('db/migrations/20261023_podcast_communications.sql', 'utf8');
for (const table of ['newsletter_subscriptions', 'contact_messages', 'billing_webhook_events', 'billing_subscriptions']) {
  assert.ok(migration.includes(`CREATE TABLE IF NOT EXISTS public.${table}`), `Missing migration table: ${table}`);
}
const nextConfig = readFileSync('next.config.ts', 'utf8');
assert.match(nextConfig, /X-Content-Type-Options/);
assert.match(nextConfig, /Referrer-Policy/);
assert.match(nextConfig, /Strict-Transport-Security/);
assert.ok(existsSync('app/api/health/route.ts'));
assert.ok(existsSync('app/api/billing/status/route.ts'));
console.log('Podcast, billing, migration, and security regression checks passed.');

const rateLimit = readFileSync('lib/security/public-rate-limit.ts', 'utf8');
assert.match(rateLimit, /createHmac/);
assert.match(rateLimit, /interval '15 minutes'/);
assert.match(rateLimit, /RETURNING hits/);
assert.ok(existsSync('db/migrations/20261023_public_form_rate_limits.sql'));
console.log('Public-form rate-limit regression checks passed.');
