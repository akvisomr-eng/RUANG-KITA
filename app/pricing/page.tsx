import Link from "next/link";
import { CheckoutButton } from "./checkout-button";

export const metadata = {
  title: "Paket RUANGKITA",
  description: "Informasi paket RUANGKITA dan kesiapan checkout.",
};

export default function PricingPage() {
  const checkoutConfigured = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_CREATOR_MONTHLY && process.env.NEXT_PUBLIC_APP_URL?.startsWith("https://"));
  return <main className="pricing-shell">
    <header><Link href="/">← Kembali ke RUANGKITA</Link><p>PAKET & AKSES</p><h1>Mulai dari ruang yang tepat.</h1><span>Paket berbayar hanya aktif setelah konfigurasi pembayaran dan verifikasi akses selesai.</span></header>
    <section className="pricing-card">
      <p className="pricing-eyebrow">CREATOR</p><h2>Creator Monthly</h2>
      <p>Langganan bulanan untuk fitur Creator yang nantinya akan diaktifkan secara bertahap.</p>
      <ul><li>Workspace akun dan draft ruang</li><li>Fitur media premium hanya setelah dirilis dan diuji</li><li>Status langganan diproses melalui webhook pembayaran terverifikasi</li></ul>
      <p className="pricing-price">Harga final ditampilkan pada checkout resmi</p>
      {checkoutConfigured ? <CheckoutButton /> : <p className="pricing-notice" role="status">Checkout belum aktif: akun penyedia pembayaran, ID harga, dan URL HTTPS produksi harus dikonfigurasi terlebih dahulu.</p>}
      <small>Jangan melakukan transfer manual. RUANGKITA tidak meminta data kartu di situs ini.</small>
    </section>
    <style>{`
      .pricing-shell{min-height:100vh;padding:32px 20px 80px;background:#f4f7f4;color:#18342d;font-family:Arial,sans-serif}
      .pricing-shell header{max-width:900px;margin:0 auto 36px}.pricing-shell header a{color:#1b6557;text-decoration:none;font-size:14px}.pricing-shell header>p{margin-top:42px;font-size:11px;letter-spacing:2px;font-weight:700;color:#1b6557}.pricing-shell h1{font-size:clamp(32px,6vw,56px);margin:12px 0}.pricing-shell header span{color:#61746b;line-height:1.7}
      .pricing-card{max-width:540px;margin:auto;padding:32px;background:white;border:1px solid #dce7df;border-radius:20px;box-shadow:0 18px 55px #1c47310d}.pricing-eyebrow{font-size:11px;letter-spacing:2px;color:#1b6557;font-weight:700}.pricing-card h2{font-size:28px;margin:8px 0}.pricing-card p,.pricing-card li{line-height:1.7;color:#60736a;font-size:14px}.pricing-card ul{padding-left:20px}.pricing-price{font-weight:700!important;color:#18342d!important}.pricing-notice{padding:12px;background:#f9f1e2;border-radius:8px;color:#74501d!important}.pricing-checkout button{width:100%;padding:14px;background:#1b6557;color:#fff;border:0;border-radius:9px;font-weight:700;cursor:pointer}.pricing-checkout button:disabled{opacity:.6}.pricing-checkout p{font-size:13px;color:#9b3b30}.pricing-card small{display:block;margin-top:16px;color:#728178;line-height:1.6}
    `}</style>
  </main>;
}
