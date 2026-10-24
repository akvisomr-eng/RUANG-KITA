import Link from "next/link";
import ResetPasswordAuthView from "./reset-password-auth-view";

export default function ResetPasswordPage() {
  return (
    <main className="auth-shell">
      <Link className="auth-brand" href="/">RUANGKITA</Link>
      <section className="auth-card">
        <p className="auth-eyebrow">RUANGKITA CREATOR</p>
        <h1>Buat kata sandi baru</h1>
        <p className="auth-description">
          Buka halaman ini melalui tautan pemulihan yang dikirim ke email Anda.
          Setelah kata sandi berhasil diperbarui, Anda akan diarahkan ke halaman login RUANGKITA.
        </p>
        <ResetPasswordAuthView />
        <p className="auth-description">
          <Link href="/auth/sign-in">Kembali ke halaman masuk</Link>
        </p>
      </section>
    </main>
  );
}
