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
  const input = body as { name?: unknown; email?: unknown; message?: unknown; consent?: unknown; website?: unknown };
  if (typeof input.website === "string" && input.website.trim()) return Response.json({ message: "Pesan diterima." });
  if (input.consent !== true) return Response.json({ error: "Persetujuan pemrosesan data diperlukan." }, { status: 400 });
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (name.length < 1 || name.length > 100) return Response.json({ error: "Nama wajib diisi (maksimal 100 karakter)." }, { status: 400 });
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return Response.json({ error: "Alamat email tidak valid." }, { status: 400 });
  if (message.length < 10 || message.length > 5000) return Response.json({ error: "Pesan harus berisi 10–5000 karakter." }, { status: 400 });
  const sql = sqlClient();
  if (!sql) return Response.json({ error: "Penyimpanan pesan belum dikonfigurasi." }, { status: 503 });
  let withinLimit: boolean;
  try { withinLimit = await checkPublicFormRateLimit(request, "contact"); }
  catch { return Response.json({ error: "Proteksi anti-spam belum tersedia; pengiriman pesan sementara dihentikan." }, { status: 503 }); }
  if (!withinLimit) return Response.json({ error: "Batas pengiriman tercapai. Coba lagi dalam 15 menit." }, { status: 429 });
  try {
    await sql`INSERT INTO contact_messages (name, email, message, consent_at, status) VALUES (${name}, ${email}, ${message}, now(), 'new')`;
    return Response.json({ message: "Pesan tersimpan. Tim belum menerima notifikasi email otomatis; tindak lanjut masih perlu dilakukan melalui dashboard database." }, { status: 201 });
  } catch {
    return Response.json({ error: "Pesan belum tersimpan. Silakan coba lagi nanti." }, { status: 500 });
  }
}
