import { neon } from "@neondatabase/serverless";
import { getServerAuth } from "@/lib/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const auth = getServerAuth();
  if (!auth) return Response.json({ error: "Login belum dikonfigurasi." }, { status: 503 });
  const { data } = await auth.getSession();
  if (!data?.user) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!process.env.DATABASE_URL) return Response.json({ error: "Database belum dikonfigurasi." }, { status: 503 });
  try {
    const sql = neon(process.env.DATABASE_URL);
    const rows = await sql`SELECT status, current_period_end FROM billing_subscriptions WHERE owner_subject = ${data.user.id} AND status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete') ORDER BY updated_at DESC LIMIT 1`;
    const subscription = rows[0] ?? null;
    return Response.json({ subscription }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Status langganan belum dapat diperiksa." }, { status: 500 });
  }
}
