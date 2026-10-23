"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, Headphones, Mail, Send } from "lucide-react";

type PodcastConfig = {
  episodes: Record<string, string | null>;
  platforms: { label: string; url: string | null }[];
};

function usePodcastConfig() {
  const [config, setConfig] = useState<PodcastConfig | null>(null);
  useEffect(() => {
    let active = true;
    fetch("/api/podcast/config", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("config unavailable")))
      .then((data: PodcastConfig) => { if (active) setConfig(data); })
      .catch(() => { if (active) setConfig({ episodes: {}, platforms: [] }); });
    return () => { active = false; };
  }, []);
  return config;
}

export function PodcastEpisodePlayer({ episodeId }: { episodeId: number }) {
  const config = usePodcastConfig();
  const src = config?.episodes[String(episodeId)] ?? null;
  if (!config) return <div className="ph-player-placeholder" role="status"><span className="ph-player-icon"><Headphones size={16} /></span><div><strong>Memeriksa audio…</strong><span>Memuat sumber episode</span></div></div>;
  if (!src) return <div className="ph-player-placeholder"><span className="ph-player-icon"><Headphones size={16} /></span><div><strong>Audio belum diterbitkan</strong><span>Episode ini baru berupa konsep editorial</span></div></div>;
  return <div className="ph-audio-player"><audio controls preload="none" src={src} aria-label={`Putar episode podcast ${episodeId}`}>Browser Anda tidak mendukung pemutar audio.</audio></div>;
}

export function PodcastPlatforms() {
  const config = usePodcastConfig();
  const defaults = [
    { key: "spotify", label: "Spotify" },
    { key: "apple", label: "Apple Podcasts" },
    { key: "youtube", label: "YouTube" },
    { key: "instagram", label: "Instagram" },
    { key: "x", label: "X" },
    { key: "website", label: "Situs resmi" },
  ];
  return <div className="ph-platforms">{defaults.map((item) => {
    const url = config?.platforms.find((p) => p.label === item.key)?.url ?? null;
    return <div className={`ph-platform-item ${url ? "is-connected" : ""}`} key={item.key}>
      <strong>{item.label}</strong>
      {url ? <a href={url} target="_blank" rel="noopener noreferrer">Buka kanal <ExternalLink size={14} /></a> : <small>Belum dikonfigurasi</small>}
    </div>;
  })}</div>;
}

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setMessage("Persetujuan menerima newsletter wajib dicentang."); return; }
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, consent, website: "" }) });
      const data = await response.json();
      setMessage(response.ok ? data.message : (data.error || "Pendaftaran belum berhasil."));
      if (response.ok) { setEmail(""); setConsent(false); }
    } catch { setMessage("Koneksi gagal. Silakan coba lagi."); }
    finally { setBusy(false); }
  }
  return <form className="ph-live-form" onSubmit={submit}>
    <label>Email Anda<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@email.com" /></label>
    <label className="ph-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /> Saya setuju menerima email newsletter RUANGKITA dan memahami bahwa saya dapat meminta berhenti berlangganan.</label>
    <label className="ph-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" /></label>
    <button className="ph-button primary" type="submit" disabled={busy}><Mail size={16} /> {busy ? "Menyimpan…" : "Daftar newsletter"}</button>
    {message && <p className="ph-form-message" role="status">{message}</p>}
    <small><CheckCircle2 size={13} /> Email disimpan hanya setelah persetujuan Anda.</small>
  </form>;
}

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) { setStatus("Persetujuan pemrosesan pesan wajib dicentang."); return; }
    setBusy(true); setStatus("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, consent, website: "" }) });
      const data = await response.json();
      setStatus(response.ok ? data.message : (data.error || "Pesan belum berhasil dikirim."));
      if (response.ok) setForm({ name: "", email: "", message: "" });
    } catch { setStatus("Koneksi gagal. Silakan coba lagi."); }
    finally { setBusy(false); }
  }
  return <form className="ph-live-form" onSubmit={submit}>
    <label>Nama<input autoComplete="name" required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nama Anda" /></label>
    <label>Email<input type="email" autoComplete="email" required maxLength={254} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="nama@email.com" /></label>
    <label>Pesan<textarea required minLength={10} maxLength={5000} rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Ceritakan ide Anda..." /></label>
    <label className="ph-consent"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required /> Saya setuju RUANGKITA memproses data ini untuk menanggapi pesan saya.</label>
    <label className="ph-honeypot" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" name="website" /></label>
    <button className="ph-button primary" type="submit" disabled={busy}><Send size={16} /> {busy ? "Mengirim…" : "Kirim pesan"}</button>
    {status && <p className="ph-form-message" role="status">{status}</p>}
  </form>;
}
