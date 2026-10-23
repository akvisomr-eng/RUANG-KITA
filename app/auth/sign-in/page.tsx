import { AuthView } from "@neondatabase/auth-ui";

export default function SignInPage() {
  return <main className="auth-shell"><a className="auth-brand" href="/">RUANGKITA</a><section className="auth-card"><p className="auth-eyebrow">RUANGKITA CREATOR</p><h1>Masuk ke ruang Anda</h1><p className="auth-description">Masuk untuk mengelola studio dan ruang podcast Anda.</p><AuthView path="sign-in" /></section></main>;
}