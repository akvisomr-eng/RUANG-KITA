import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const auth = getServerAuth();
  if (!auth) {
    return <main className="auth-shell"><section className="auth-card"><h1>Login belum dikonfigurasi</h1><p>Deployment perlu variabel NEON_AUTH_BASE_URL dan NEON_AUTH_COOKIE_SECRET sebelum fitur akun dapat digunakan.</p><Link href="/">Kembali ke beranda</Link></section></main>;
  }
  const { data } = await auth.getSession();
  if (!data?.user) redirect("/auth/sign-in");
  return <main className="dashboard-shell"><header className="dashboard-top"><Link href="/" className="auth-brand">RUANGKITA</Link><span>Creator Workspace</span></header><section className="dashboard-welcome"><p className="auth-eyebrow">WORKSPACE</p><h1>Selamat datang, {data.user.name || data.user.email}</h1><p>Akun Anda berhasil dikenali. Pembuatan ruang dan media langsung akan diaktifkan setelah backend dan izin akses lulus pengujian.</p><Link className="primary-button" href="/">Buka studio</Link></section></main>;
}