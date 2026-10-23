import { neon } from "@neondatabase/serverless";
import { checkPublicFormRateLimit } from "@/lib/security/public-rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sqlClient() {
  const url = process.env.DATABASE_URL;
  return url ? neon(url) : null;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Permintaan lintas-origin ditolak." }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Format permintaan tidak valid." }, { status: 400 }); }
  if (!body || typeof body !== "object") return Response.json({ error: "Data tidak valid." }, { status: 400 });
  const input = body as { email?: unknown; consent?: unknown; website?: unknown };
  if (typeof input.website === "string" && input.website.trim()) return Response.json({ message: "Terima kasih." });
  if (input.consent !== true) return Response.json({ error: "Persetujuan newsletter diperlukan." }, { status: 400 });
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Alamat email tidak valid." }, { status: 400 });
  const sql = sqlClient();
  if (!sql) return Response.json({ error: "Penyimpanan newsletter belum dikonfigurasi." }, { status: 503 });
  let withinLimit: boolean;
  try { withinLimit = await checkPublicFormRateLimit(request, "newsletter"); }
  catch { return Response.json({ error: "Proteksi anti-spam belum tersedia; pendaftaran sementara dihentikan." }, { status: 503 }); }
  if (!withinLimit) return Response.json({ error: "Batas pengiriman tercapai. Coba lagi dalam 15 menit." }, { status: 429 });
  try {
    await sql`
      INSERT INTO newsletter_subscriptions (email, consent_at, status, source)
      VALUES (${email}, now(), 'subscribed', 'podcast-page')
      ON CONFLICT (email) DO UPDATE SET consent_at = EXCLUDED.consent_at, status = 'subscribed', updated_at = now()
    `;
    return Response.json({ message: "Pendaftaran tersimpan. Pengiriman email otomatis belum aktif; kami belum mengirim email." }, { status: 201 });
  } catch {
    return Response.json({ error: "Pendaftaran belum tersimpan. Silakan coba lagi nanti." }, { status: 500 });
  }
}
