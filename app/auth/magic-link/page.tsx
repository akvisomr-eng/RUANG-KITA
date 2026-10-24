import Link from "next/link";
import { AuthView } from "@neondatabase/auth-ui";

export default function MagicLinkPage() {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/">RUANGKITA</Link>
      <section className="auth-card">
        <p className="auth-eyebrow">RUANGKITA CREATOR</p>
        <h1>Masuk lewat email</h1>
        <p className="auth-description">Kami akan mengirim tautan masuk sekali pakai ke email Anda. Buka email tersebut untuk masuk ke RUANGKITA.</p>
        <AuthView path="magic-link" />
        <p className="auth-description"><Link href="/auth/sign-in">Kembali ke halaman masuk</Link></p>
      </section>
    </main>
  );
}
