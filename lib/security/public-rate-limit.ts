import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export async function checkPublicFormRateLimit(request: Request, scope: "newsletter" | "contact") {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("Database is not configured for public form rate limiting.");
  // Vercel supplies x-real-ip. The forwarded-for fallback supports local/proxy development.
  const identity = request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const keyHash = createHmac("sha256", databaseUrl).update(`${scope}:${identity}`).digest("hex");
  const sql = neon(databaseUrl);
  const rows = await sql`
    INSERT INTO public_form_rate_limits (key_hash, window_started_at, hits)
    VALUES (${keyHash}, now(), 1)
    ON CONFLICT (key_hash) DO UPDATE SET
      window_started_at = CASE
        WHEN public_form_rate_limits.window_started_at <= now() - interval '15 minutes' THEN now()
        ELSE public_form_rate_limits.window_started_at
      END,
      hits = CASE
        WHEN public_form_rate_limits.window_started_at <= now() - interval '15 minutes' THEN 1
        ELSE public_form_rate_limits.hits + 1
      END
    RETURNING hits
  `;
  return Number(rows[0]?.hits ?? 99) <= 5;
}
