import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return Response.json({ status: "degraded" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1 AS healthy`;
    return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
  } catch {
    return Response.json({ status: "degraded" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
