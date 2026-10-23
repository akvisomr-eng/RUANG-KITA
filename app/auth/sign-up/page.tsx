import Link from "next/link";
import { AuthView } from "@neondatabase/auth-ui";

export default function SignUpPage() {
  return <main className="auth-shell"><Link className="auth-brand" href="/">RUANGKITA</Link><section className="auth-card"><p className="auth-eyebrow">MULAI BERKREASI</p><h1>Buat akun RUANGKITA</h1><p className="auth-description">Gunakan alamat email yang dapat Anda akses untuk mengelola akun.</p><AuthView path="sign-up" /></section></main>;
}