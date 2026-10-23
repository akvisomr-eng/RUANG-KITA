import { createNeonAuth } from "@neondatabase/auth/next/server";

export function getServerAuth() {
  const baseUrl = process.env.NEON_AUTH_BASE_URL;
  const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET;
  if (!baseUrl || !cookieSecret || cookieSecret.length < 32) {
    return null;
  }
  return createNeonAuth({
    baseUrl,
    cookies: { secret: cookieSecret },
  });
}