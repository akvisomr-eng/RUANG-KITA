import Link from "next/link";
import { AuthView } from "@neondatabase/auth-ui";

export default function ResetPasswordPage() {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/">RUANGKITA</Link>
      <section className="auth-card">
        <p className="auth-eyebrow">RUANGKITA CREATOR</p>
        <h1>Buat kata sandi baru</h1>
        <p className="auth-description">Buka halaman ini melalui tautan pemulihan yang dikirim ke email Anda.</p>
        <AuthView path="reset-password" />
        <p className="auth-description"><Link href="/auth/sign-in">Kembali ke halaman masuk</Link></p>
      </section>
    </main>
  );
}
