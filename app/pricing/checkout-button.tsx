"use client";

import { useState } from "react";

export function CheckoutButton() {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function startCheckout() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "creator_monthly" }),
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) { setMessage(data.error || "Checkout belum tersedia."); return; }
      window.location.assign(data.url);
    } catch {
      setMessage("Koneksi ke checkout gagal. Tidak ada pembayaran yang dibuat.");
    } finally { setBusy(false); }
  }
  return <div className="pricing-checkout">
    <button type="button" onClick={startCheckout} disabled={busy}>{busy ? "Menyiapkan checkout…" : "Lanjut ke checkout aman"}</button>
    {message && <p role="status">{message}</p>}
  </div>;
}
