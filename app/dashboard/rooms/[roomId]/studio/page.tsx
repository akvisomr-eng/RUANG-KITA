import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { getServerAuth } from "@/lib/auth/server";
import { StudioPreflight } from "../studio-preflight";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ roomId: string }> };

export default async function PodcastStudioPreflightPage({ params }: PageProps) {
  const { roomId } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(roomId)) notFound();

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
    SELECT id, title, status
    FROM podcast_rooms
    WHERE id = ${roomId}::uuid AND owner_subject = ${data.user.id}
    LIMIT 1
  `;
  const room = rows[0] as { id: string; title: string; status: string } | undefined;
  if (!room) notFound();

  return (
    <main className="dashboard-shell">
      <header className="dashboard-top"><Link href="/" className="auth-brand">RUANGKITA</Link><span>Dashboard Produksi</span></header>
      <section className="dashboard-welcome">
        <p className="auth-eyebrow">DASHBOARD PRODUKSI · {room.status.toUpperCase()}</p>
        <h1>{room.title}</h1>
        <p>Siapkan perangkat dan kelola ruang dari satu halaman. Setelah perangkat aktif, panel produksi akan tampil di bawah ini.</p>
      </section>
      <StudioPreflight />
      <nav aria-label="Navigasi ruang" style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 16 }}><Link href={`/dashboard/rooms/${encodeURIComponent(room.id)}`}>Detail ruang</Link><Link href="/dashboard">Semua ruang</Link></nav>
    </main>
  );
}
