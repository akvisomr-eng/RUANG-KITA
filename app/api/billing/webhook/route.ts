import { createHmac, timingSafeEqual } from "node:crypto";
import { neon } from "@neondatabase/serverless";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function verifySignature(rawBody: string, header: string, secret: string) {
  const values = header.split(",").map((part) => part.trim().split("="));
  const timestamp = values.find(([key]) => key === "t")?.[1];
  const signatures = values.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || signatures.length === 0 || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest();
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const received = Buffer.from(signature, "hex");
    return received.length === expected.length && timingSafeEqual(received, expected);
  });
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const databaseUrl = process.env.DATABASE_URL;
  if (!secret || !databaseUrl) return Response.json({ error: "Webhook belum dikonfigurasi." }, { status: 503 });
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Signature diperlukan." }, { status: 400 });
  const rawBody = await request.text();
  if (rawBody.length > 1024 * 1024) return Response.json({ error: "Payload terlalu besar." }, { status: 413 });
  if (!verifySignature(rawBody, signature, secret)) return Response.json({ error: "Signature tidak valid." }, { status: 400 });

  let event: { id?: string; type?: string; data?: { object?: Record<string, unknown> } };
  try { event = JSON.parse(rawBody); } catch { return Response.json({ error: "Payload JSON tidak valid." }, { status: 400 }); }
  if (!event.id || !event.type || !event.data?.object) return Response.json({ error: "Struktur event tidak valid." }, { status: 400 });
  const sql = neon(databaseUrl);
  const object = event.data.object;
  const supported = ["customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"];
  try {
    await sql`INSERT INTO billing_webhook_events (event_id, event_type, received_at) VALUES (${event.id}, ${event.type}, now()) ON CONFLICT (event_id) DO NOTHING`;
    if (supported.includes(event.type)) {
      const subscriptionId = typeof object.id === "string" ? object.id : "";
      const ownerSubject = typeof (object.metadata as Record<string, unknown> | undefined)?.app_user_id === "string" ? String((object.metadata as Record<string, unknown>).app_user_id) : "";
      const customerId = typeof object.customer === "string" ? object.customer : (object.customer && typeof object.customer === "object" && "id" in object.customer ? String((object.customer as { id: unknown }).id) : "");
      const status = typeof object.status === "string" ? object.status : "unknown";
      const item = object.items && typeof object.items === "object" && Array.isArray((object.items as { data?: unknown }).data) ? ((object.items as { data: Record<string, unknown>[] }).data[0] ?? {}) : {};
      const price = item.price && typeof item.price === "object" ? item.price as Record<string, unknown> : {};
      const priceId = typeof price.id === "string" ? price.id : "";
      const periodEnd = typeof object.current_period_end === "number" ? new Date(object.current_period_end * 1000).toISOString() : null;
      if (!subscriptionId || !ownerSubject) return Response.json({ error: "Metadata pelanggan tidak tersedia; event disimpan untuk pemeriksaan." }, { status: 202 });
      await sql`
        INSERT INTO billing_subscriptions (stripe_subscription_id, owner_subject, stripe_customer_id, stripe_price_id, status, current_period_end, updated_at)
        VALUES (${subscriptionId}, ${ownerSubject}, ${customerId || null}, ${priceId || null}, ${status}, ${periodEnd}::timestamptz, now())
        ON CONFLICT (stripe_subscription_id) DO UPDATE SET
          owner_subject = EXCLUDED.owner_subject,
          stripe_customer_id = EXCLUDED.stripe_customer_id,
          stripe_price_id = EXCLUDED.stripe_price_id,
          status = EXCLUDED.status,
          current_period_end = EXCLUDED.current_period_end,
          updated_at = now()
      `;
    }
    return Response.json({ received: true });
  } catch {
    return Response.json({ error: "Event belum dapat diproses; penyedia akan mencoba ulang." }, { status: 500 });
  }
}
