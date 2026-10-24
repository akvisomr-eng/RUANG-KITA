import Link from "next/link";
import { AuthView } from "@neondatabase/auth-ui";

export default function ForgotPasswordPage() {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/">RUANGKITA</Link>
      <section className="auth-card">
        <p className="auth-eyebrow">RUANGKITA CREATOR</p>
        <h1>Atur ulang kata sandi</h1>
        <p className="auth-description">Masukkan email akun Anda untuk menerima instruksi pemulihan kata sandi.</p>
        <AuthView path="forgot-password" />
        <p className="auth-description"><Link href="/auth/sign-in">Kembali ke halaman masuk</Link></p>
      </section>
    </main>
  );
}
