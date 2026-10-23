import assert from "node:assert/strict";

const baseUrl = process.env.RUANGKITA_BASE_URL;
assert.ok(baseUrl, "Set RUANGKITA_BASE_URL to the deployment origin.");

const target = new URL(baseUrl);
assert.equal(target.protocol, "https:", "Smoke tests must target HTTPS.");
assert.equal(target.pathname, "/", "RUANGKITA_BASE_URL must be an origin, not a path.");
assert.equal(target.search, "", "Do not pass query parameters.");
assert.equal(target.hash, "", "Do not pass a URL fragment.");

const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

async function get(path) {
  const headers = { "user-agent": "ruangkita-deployment-smoke/1.0" };
  if (bypassSecret) headers["x-vercel-protection-bypass"] = bypassSecret;
  const response = await fetch(new URL(path, target), {
    redirect: "manual",
    signal: AbortSignal.timeout(15_000),
    headers,
  });
  return response;
}

function assertPublicResponse(response, expectedStatus, label) {
  const location = response.headers.get("location");
  const protectionHint =
    response.status >= 300 && response.status < 400 && !bypassSecret
      ? " This preview may be protected by Vercel SSO; configure the Vercel automation bypass secret as GitHub Actions secret VERCEL_AUTOMATION_BYPASS_SECRET. Do not disable deployment protection just to pass this test."
      : "";
  assert.equal(
    response.status,
    expectedStatus,
    `${label} should return ${expectedStatus}; got ${response.status}.${location ? ` Redirect location: ${location}.` : ""}${protectionHint}`,
  );
}

const home = await get("/");
assertPublicResponse(home, 200, "Homepage");
assert.match(home.headers.get("content-type") ?? "", /text\\/html/i, "Homepage must be HTML");
const html = await home.text();
assert.match(html, /RUANGKITA/i, "Homepage response should identify RUANGKITA");
console.log("PASS homepage: HTTPS 200 and RUANGKITA HTML");

const manifestResponse = await get("/manifest.webmanifest");
assertPublicResponse(manifestResponse, 200, "Manifest");
assert.match(manifestResponse.headers.get("content-type") ?? "", /json/i, "Manifest must be JSON");
const manifest = await manifestResponse.json();
assert.equal(manifest.short_name, "RUANGKITA");
assert.equal(manifest.lang, "id");
assert.equal(manifest.display, "standalone");
assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0, "Manifest must declare an app icon");
console.log("PASS manifest: install metadata and icon declaration");

const rooms = await get("/api/rooms");
assert.equal(
  rooms.status,
  401,
  `Unauthenticated room listing must return 401; got ${rooms.status}. Do not accept an unverified auth configuration.`,
);
console.log("PASS access boundary: unauthenticated room listing returns 401");
console.log("LIMIT: this smoke test does not verify login, database writes, owner isolation, WebRTC, Android hardware, or production readiness.");
