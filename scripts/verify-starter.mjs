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
assert.match(page, /className="mobile-dock"/);
assert.match(page, /aria-label="Navigasi utama"/);
const mobileCss = readFileSync('app/globals.css', 'utf8');
assert.match(mobileCss, /\.mobile-dock\{display:grid/);
assert.match(mobileCss, /env\(safe-area-inset-bottom\)/);
assert.match(mobileCss, /prefers-reduced-motion:reduce/);
assert.ok(existsSync('app/manifest.ts'), 'Missing web app manifest');
const layout = readFileSync('app/layout.tsx', 'utf8');
assert.match(layout, /viewportFit: 'cover'/);

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
