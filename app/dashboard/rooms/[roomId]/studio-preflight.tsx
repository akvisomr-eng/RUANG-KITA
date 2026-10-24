"use client";

import { useEffect, useRef, useState } from "react";

export function StudioPreflight() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState("Perangkat belum diperiksa.");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState(false);

  async function startPreview() {
    setBusy(true);
    setStatus("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Browser ini tidak mendukung akses kamera/mikrofon atau halaman tidak menggunakan HTTPS.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setActive(true);
      setStatus("Kamera dan mikrofon lokal aktif pada perangkat ini. Belum ada peserta lain yang terhubung dan belum ada siaran.");
    } catch (error) {
      const name = error instanceof DOMException ? error.name : "";
      const message = name === "NotAllowedError"
        ? "Izin kamera/mikrofon ditolak. Izinkan akses melalui pengaturan izin situs browser, lalu coba lagi."
        : name === "NotFoundError"
          ? "Kamera atau mikrofon tidak ditemukan. Periksa perangkat yang tersambung."
          : error instanceof Error ? error.message : "Perangkat belum dapat diakses.";
      setStatus(message);
      setActive(false);
    } finally {
      setBusy(false);
    }
  }

  function stopPreview() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
    setStatus("Pratinjau lokal dihentikan. Tidak ada siaran yang berjalan.");
  }

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  return (
    <section className="room-manager" aria-labelledby="device-check-title">
      <div className="room-manager-head">
        <div>
          <h2 id="device-check-title">Pemeriksaan perangkat lokal</h2>
          <p>Uji kamera dan mikrofon sebelum produksi. Ini hanya pratinjau pada browser Anda, bukan koneksi WebRTC.</p>
        </div>
        <span className="room-count">{active ? "PRATINJAU AKTIF" : "BELUM AKTIF"}</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) minmax(220px, 1fr)", gap: 20, alignItems: "start" }}>
        <video ref={videoRef} muted playsInline autoPlay aria-label="Pratinjau kamera lokal" style={{ width: "100%", minHeight: 220, maxHeight: 420, background: "#102e2a", borderRadius: 12, objectFit: "cover" }} />
        <div>
          <p style={{ lineHeight: 1.7, color: "#52625c" }}>Saat pratinjau dimulai, browser akan meminta izin kamera dan mikrofon. Audio tidak dikirim ke server dan video tidak disiarkan.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <button className="primary-button" type="button" onClick={startPreview} disabled={busy || active}>{busy ? "Memeriksa…" : "Uji kamera & mikrofon"}</button>
            <button className="primary-button" type="button" onClick={stopPreview} disabled={!active} style={{ background: "#e8eeeb", color: "#263b34", boxShadow: "none" }}>Hentikan pratinjau</button>
          </div>
          <p className="room-message" role="status" aria-live="polite">{status}</p>
        </div>
      </div>
      {active && (
        <section className="room-manager" aria-labelledby="production-workspace-title" style={{ marginTop: 24 }}>
          <div className="room-manager-head">
            <div>
              <p className="auth-eyebrow">PERANGKAT SIAP</p>
              <h2 id="production-workspace-title">Dashboard produksi</h2>
              <p>Kamera dan mikrofon lokal aktif. Anda tetap berada di halaman studio ini; tidak perlu kembali ke detail ruang untuk melanjutkan persiapan.</p>
            </div>
            <span className="room-count">LOKAL SAJA</span>
          </div>
          <p className="room-field-help">Status ini menandakan perangkat siap pada browser ini, bukan siaran langsung. Penyiaran ke peserta lain, WebRTC/SFU, undangan peserta, dan perekaman belum diaktifkan.</p>
        </section>
      )}
      <p className="room-field-help">Fitur siaran multi-peserta tetap dinonaktifkan sampai penyedia WebRTC/SFU, otorisasi peserta, dan pengujian privasi disiapkan.</p>
    </section>
  );
}
