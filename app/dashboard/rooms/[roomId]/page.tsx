import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { getServerAuth } from "@/lib/auth/server";
import { LocalDateTime } from "@/app/components/local-date-time";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ roomId: string }> };

export default async function PodcastDraftPage({ params }: PageProps) {
  const { roomId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roomId)) {
    notFound();
  }

  const auth = getServerAuth();
  if (!auth) {
    return <main className="auth-shell"><section className="auth-card"><h1>Login belum dikonfigurasi</h1><Link href="/auth/sign-in">Ke halaman login</Link></section></main>;
  }
  const { data } = await auth.getSession();
  if (!data?.user) redirect("/auth/sign-in");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return <main className="dashboard-shell"><section className="dashboard-welcome"><h1>Layanan ruang belum siap</h1><p>Konfigurasi database belum tersedia.</p><Link href="/dashboard">Kembali ke Workspace</Link></section></main>;
  }

  const sql = neon(connectionString);
  const rows = await sql`
    SELECT r.id, r.title, r.status, r.privacy_mode, r.created_at, s.title AS scene_title, s.description AS scene_description
    FROM podcast_rooms r
    LEFT JOIN scene_presets s ON s.id = r.scene_preset_id
    WHERE r.id = ${roomId}::uuid AND r.owner_subject = ${data.user.id}
    LIMIT 1
  `;
  const room = rows[0] as {
    id: string; title: string; status: string; privacy_mode: string; created_at: string;
    scene_title: string | null; scene_description: string | null;
  } | undefined;
  if (!room) notFound();

  return (
    <main className="dashboard-shell">
      <header className="dashboard-top"><Link href="/" className="auth-brand">RUANGKITA</Link><span>Podcast Workspace</span></header>
      <section className="dashboard-welcome">
        <p className="auth-eyebrow">DRAFT PODCAST</p>
        <h1>{room.title}</h1>
        <p>{room.scene_title ? `Preset: ${room.scene_title}. ` : "Belum menggunakan preset produksi. "}{room.scene_description ?? ""}</p>
        <p>Status: <strong>{room.status === "draft" ? "DRAFT" : room.status.toUpperCase()}</strong> · {room.privacy_mode === "invite_only" ? "Privat · Undangan saja" : room.privacy_mode}</p>
        <p>Dibuat: <LocalDateTime value={room.created_at} /></p>
        <div className="room-message" role="status">
          Draft berhasil dibuka. Kontrol produksi, media langsung, WebRTC, dan undangan peserta belum diaktifkan pada tahap ini. Ruang ini belum menyiarkan audio atau video.
        </div>
        <p><Link className="primary-button" href="/dashboard">Kembali ke semua ruang</Link></p>
      </section>
    </main>
  );
}
