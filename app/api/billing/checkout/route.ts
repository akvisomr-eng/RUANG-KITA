import { getServerAuth } from "@/lib/auth/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Permintaan lintas-origin ditolak." }, { status: 403 });
  const auth = getServerAuth();
  if (!auth) return Response.json({ error: "Login belum dikonfigurasi." }, { status: 503 });
  const { data } = await auth.getSession();
  const user = data?.user;
  if (!user) return Response.json({ error: "Silakan masuk sebelum berlangganan." }, { status: 401 });

  const secret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_CREATOR_MONTHLY;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
  if (!secret || !priceId || !baseUrl.startsWith("https://")) {
    return Response.json({ error: "Checkout berbayar belum diaktifkan. Konfigurasikan akun pembayaran, harga, dan URL produksi terlebih dahulu." }, { status: 503 });
  }

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 }); }
  if (!body || typeof body !== "object" || (body as { plan?: unknown }).plan !== "creator_monthly") {
    return Response.json({ error: "Paket tidak dikenal." }, { status: 400 });
  }

  const form = new URLSearchParams();
  form.set("mode", "subscription");
  form.set("line_items[0][price]", priceId);
  form.set("line_items[0][quantity]", "1");
  form.set("client_reference_id", user.id);
  form.set("metadata[app_user_id]", user.id);
  form.set("subscription_data[metadata][app_user_id]", user.id);
  form.set("success_url", `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${baseUrl}/pricing?checkout=cancelled`);
  if (user.email) form.set("customer_email", user.email);

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
      cache: "no-store",
    });
    const result = await response.json() as { url?: string; error?: { message?: string } };
    if (!response.ok || !result.url || !result.url.startsWith("https://checkout.stripe.com/")) {
      return Response.json({ error: "Penyedia pembayaran belum dapat membuat sesi checkout." }, { status: 502 });
    }
    return Response.json({ url: result.url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "Penyedia pembayaran tidak dapat dijangkau." }, { status: 502 });
  }
}
