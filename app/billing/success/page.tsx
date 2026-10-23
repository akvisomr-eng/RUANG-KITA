import Link from "next/link";

export default function BillingSuccessPage() {
  return <main style={{ maxWidth: 640, margin: "12vh auto", padding: 24, fontFamily: "Arial, sans-serif", color: "#18342d" }}>
    <p style={{ color: "#1b6557", fontWeight: 700 }}>RUANGKITA · CHECKOUT</p>
    <h1>Checkout selesai dikembalikan ke RUANGKITA</h1>
    <p>Status langganan belum dianggap aktif hanya dari halaman ini. Akses berbayar baru dapat diberikan setelah webhook penyedia pembayaran terverifikasi dan status langganan tersimpan.</p>
    <Link href="/dashboard">Kembali ke workspace</Link>
  </main>;
}
