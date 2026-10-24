import Link from "next/link";
import { AuthView } from "@neondatabase/auth-ui";

export default function AuthCallbackPage() {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/">RUANGKITA</Link>
      <section className="auth-card">
        <p className="auth-eyebrow">RUANGKITA CREATOR</p>
        <h1>Memverifikasi tautan masuk</h1>
        <p className="auth-description">Tautan email sedang diproses. Setelah verifikasi berhasil, Anda akan diarahkan ke ruang Anda.</p>
        <AuthView path="callback" />
        <p className="auth-description"><Link href="/auth/sign-in">Kembali ke halaman masuk</Link></p>
      </section>
    </main>
  );
}
