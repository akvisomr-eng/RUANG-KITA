"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, AudioLines, BookOpen, CalendarDays, CheckCircle2,
  Clock3, Headphones, Mail, Mic2, PlayCircle, Podcast, Search, Send,
  Share2, Sparkles, Users,
} from "lucide-react";
import "./podcast.css";

type Episode = {
  id: number;
  title: string;
  category: string;
  date: string;
  duration: string;
  summary: string;
  status: string;
  notes: { time: string; title: string }[];
};

const episodes: Episode[] = [
  { id: 1, title: "Membangun Percakapan yang Bermakna", category: "Percakapan", date: "Konsep episode", duration: "Audio belum tersedia", summary: "Rancangan obrolan tentang cara menciptakan ruang aman untuk ide, pengalaman, dan sudut pandang yang berbeda.", status: "Konsep", notes: [{ time: "00:00", title: "Pembukaan dan konteks" }, { time: "05:00", title: "Mendengar dengan rasa ingin tahu" }, { time: "18:00", title: "Merangkum ide utama" }] },
  { id: 2, title: "Komunitas, Kreativitas, dan Kolaborasi", category: "Komunitas", date: "Konsep episode", duration: "Audio belum tersedia", summary: "Kerangka diskusi mengenai cara komunitas kreatif bertumbuh melalui kolaborasi yang sehat.", status: "Konsep", notes: [{ time: "00:00", title: "Perkenalan topik" }, { time: "07:30", title: "Membangun kepercayaan" }, { time: "20:00", title: "Langkah kolaborasi" }] },
  { id: 3, title: "Di Balik Mikrofon: Menyiapkan Podcast", category: "Produksi", date: "Konsep episode", duration: "Audio belum tersedia", summary: "Panduan perencanaan format, peran host, alur pembahasan, dan catatan episode sebelum rekaman.", status: "Konsep", notes: [{ time: "00:00", title: "Merumuskan tujuan episode" }, { time: "06:00", title: "Menyusun alur dan pertanyaan" }, { time: "16:00", title: "Persiapan produksi" }] },
];

const articles = [
  { category: "Panduan", title: "Cara menyusun show notes yang berguna bagi pendengar", summary: "Kerangka untuk merangkum poin penting, tautan referensi, dan penanda waktu setelah episode terbit." },
  { category: "Produksi", title: "Checklist sebelum merekam podcast bersama tamu", summary: "Persiapan topik, peran, izin rekaman, perangkat, dan rencana cadangan koneksi." },
  { category: "Komunitas", title: "Mengubah satu episode menjadi beberapa konten", summary: "Cara merencanakan ringkasan, kutipan, dan artikel turunan tanpa kehilangan konteks." },
];

export default function PodcastHubPage() {
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<number | null>(1);
  const categories = ["Semua", ...Array.from(new Set(episodes.map((episode) => episode.category)))];
  const visibleEpisodes = useMemo(() => episodes.filter((episode) => (filter === "Semua" || episode.category === filter) && episode.title.toLowerCase().includes(query.toLowerCase())), [filter, query]);

  return (
    <main className="podcast-hub" id="beranda">
      <header className="ph-nav">
        <Link className="ph-brand" href="/"><span className="ph-brand-mark"><AudioLines size={22} /></span><span>RUANG<span>KITA</span><small>PODCAST & CONVERSATIONS</small></span></Link>
        <nav aria-label="Navigasi podcast"><a href="#episode">Episode</a><a href="#tentang">Tentang</a><a href="#artikel">Artikel</a><a href="#kontak">Kontak</a></nav>
        <Link className="ph-nav-cta" href="/">Buka Studio <ArrowUpRight size={16} /></Link>
      </header>

      <section className="ph-hero">
        <div className="ph-hero-copy">
          <span className="ph-eyebrow"><Sparkles size={14} /> RUANG UNTUK CERITA</span>
          <h1>Setiap suara punya<br /><em>ruang untuk tumbuh.</em></h1>
          <p>Temukan percakapan, ide, dan cerita yang membuka perspektif baru. RUANGKITA dibangun untuk menghadirkan percakapan yang lebih bermakna.</p>
          <div className="ph-hero-actions"><a className="ph-button primary" href="#episode"><Headphones size={17} /> Jelajahi episode</a><a className="ph-button secondary" href="#tentang">Kenali RUANGKITA <ArrowRight size={16} /></a></div>
          <div className="ph-hero-points"><span><Mic2 size={15} /> Percakapan autentik</span><span><Users size={15} /> Ruang komunitas</span></div>
        </div>
        <div className="ph-hero-art" aria-label="Ilustrasi gelombang suara"><div className="ph-orbit o1" /><div className="ph-orbit o2" /><div className="ph-mic"><div /><span /></div><div className="ph-wave">{Array.from({ length: 25 }, (_, i) => <i key={i} style={{ height: `${18 + ((i * 17) % 62)}px` }} />)}</div><div className="ph-art-caption"><AudioLines size={20} /><span><strong>RUANGKITA PODCAST</strong><small>Suara, cerita, perspektif</small></span></div></div>
      </section>

      <section className="ph-featured" aria-labelledby="ph-featured-title">
        <div className="ph-featured-icon"><PlayCircle size={29} /></div><div className="ph-featured-copy"><span className="ph-kicker">SOROTAN</span><h2 id="ph-featured-title">Mulai dari percakapan yang bermakna</h2><p>Episode akan ditampilkan di sini setelah audio dan informasi publikasinya tersedia.</p></div><span className="ph-status">Menunggu episode pertama</span>
      </section>

      <section className="ph-section" id="episode">
        <div className="ph-section-head"><div><span className="ph-kicker">DENGARKAN & TEMUKAN</span><h2>Arsip episode</h2><p>Jelajahi episode berdasarkan topik. Konten di bawah adalah contoh rancangan, bukan episode yang telah terbit.</p></div><label className="ph-search"><Search size={16} /><input aria-label="Cari episode" placeholder="Cari episode..." value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
        <div className="ph-filters" role="group" aria-label="Filter kategori episode">{categories.map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>)}</div>
        <div className="ph-episode-grid">{visibleEpisodes.map((episode, index) => <article className="ph-episode-card" key={episode.id}><div className={`ph-episode-art tone-${index % 3}`}><span>{episode.category.toUpperCase()}</span><AudioLines size={42} /><small>RUANGKITA · DRAF</small></div><div className="ph-episode-body"><div className="ph-episode-meta"><span><CalendarDays size={13} /> {episode.date}</span><span className="ph-draft-pill">{episode.status}</span></div><h3>{episode.title}</h3><p>{episode.summary}</p><div className="ph-player-placeholder"><button disabled aria-label={`Audio ${episode.title} belum tersedia`}><PlayCircle size={22} /></button><div><strong>Audio belum tersedia</strong><span>Player aktif setelah file audio dipasang</span></div><Clock3 size={15} /></div><button className="ph-show-notes-toggle" onClick={() => setExpanded(expanded === episode.id ? null : episode.id)} aria-expanded={expanded === episode.id}>{expanded === episode.id ? "Tutup show notes" : "Lihat show notes"} <ArrowRight size={14} /></button>{expanded === episode.id && <div className="ph-show-notes"><strong>Rancangan show notes</strong>{episode.notes.map((note) => <div key={note.time}><time>{note.time}</time><span>{note.title}</span></div>)}<p>Tautan referensi dan catatan final akan ditambahkan saat episode diterbitkan.</p></div>}</div></article>)}</div>
        {visibleEpisodes.length === 0 && <p className="ph-empty">Tidak ada rancangan episode yang cocok dengan pencarian.</p>}
      </section>

      <section className="ph-about" id="tentang"><div className="ph-about-art"><div className="ph-about-orb"><AudioLines size={52} /></div><span>YOUR SPACE, YOUR VOICE</span></div><div className="ph-about-copy"><span className="ph-kicker">TENTANG RUANGKITA</span><h2>Bukan sekadar siaran. Ini ruang untuk saling memahami.</h2><p>RUANGKITA adalah fondasi studio podcast virtual untuk kreator, komunitas, dan tim. Visi kami adalah membantu orang berkumpul, berbagi gagasan, dan membuat percakapan yang layak didengar.</p><p>Kisah pendiri, misi komunitas, dan cerita di balik program akan dilengkapi bersama tim RUANGKITA sebelum halaman ini dipublikasikan sebagai profil final.</p><a href="#kontak" className="ph-inline-link">Bangun percakapan bersama <ArrowRight size={15} /></a></div></section>

      <section className="ph-section ph-articles" id="artikel"><div className="ph-section-head"><div><span className="ph-kicker">IDE YANG BERLANJUT</span><h2>Artikel & panduan</h2><p>Konten pendamping episode untuk pembaca dan mesin pencari. Artikel saat ini masih berupa kerangka editorial.</p></div><span className="ph-coming"><BookOpen size={15} /> Artikel dalam persiapan</span></div><div className="ph-article-grid">{articles.map((article) => <article className="ph-article-card" key={article.title}><span>{article.category}</span><h3>{article.title}</h3><p>{article.summary}</p><div className="ph-article-foot">Kerangka editorial <ArrowUpRight size={15} /></div></article>)}</div></section>

      <section className="ph-connect"><div><span className="ph-kicker">IKUTI PERJALANAN</span><h2>Terhubung dengan RUANGKITA</h2><p>Tambahkan URL resmi kanal dan media sosial untuk mengaktifkan tombol berikut. Tautan belum dikonfigurasi.</p></div><div className="ph-platforms"><span><strong>Spotify</strong><small>URL belum ditambahkan</small></span><span><strong>Apple Podcasts</strong><small>URL belum ditambahkan</small></span><span><strong>YouTube / iTunes</strong><small>URL belum ditambahkan</small></span><span><strong>Instagram · X · LinkedIn</strong><small>URL belum ditambahkan</small></span></div></section>

      <section className="ph-community-grid">
        <article className="ph-form-card" id="newsletter"><div className="ph-form-icon"><Mail size={21} /></div><span className="ph-kicker">NEWSLETTER</span><h2>Jangan lewatkan cerita berikutnya.</h2><p>Formulir berlangganan siap dirancang; pengumpulan alamat email belum dihubungkan ke layanan backend atau sistem persetujuan email.</p><label>Email Anda<input type="email" placeholder="nama@email.com" disabled /></label><button className="ph-button primary" disabled><Mail size={16} /> Pendaftaran belum aktif</button><small><CheckCircle2 size={13} /> Tidak ada alamat email yang dikirim atau disimpan pada tahap ini.</small></article>
        <article className="ph-form-card" id="kontak"><div className="ph-form-icon"><Send size={21} /></div><span className="ph-kicker">KONTAK & KOLABORASI</span><h2>Punya cerita atau ide kolaborasi?</h2><p>Formulir kontak akan diaktifkan setelah alamat tujuan dan endpoint pengiriman ditentukan. Untuk sementara, belum ada pesan yang dikirim.</p><label>Nama<input type="text" placeholder="Nama Anda" disabled /></label><label>Email<input type="email" placeholder="nama@email.com" disabled /></label><label>Pesan<textarea placeholder="Ceritakan ide Anda..." rows={3} disabled /></label><button className="ph-button primary" disabled><Send size={16} /> Formulir belum aktif</button></article>
      </section>

      <section className="ph-testimonials"><div className="ph-quote-mark">“</div><div><span className="ph-kicker">CERITA PENDENGAR</span><h2>Suara komunitas akan hadir di sini.</h2><p>Belum ada testimoni pendengar terverifikasi yang dipublikasikan. Bagian ini baru akan menampilkan umpan balik dengan izin dari pemberi testimoni.</p></div><span className="ph-testimonial-status">Menunggu masukan berizin</span></section>

      <section className="ph-bottom-cta"><div><span className="ph-kicker">SIAP MEMULAI?</span><h2>Bangun ruang percakapan Anda sendiri.</h2><p>Gunakan studio RUANGKITA untuk menyiapkan konsep produksi podcast.</p></div><Link href="/" className="ph-button light">Masuk ke Studio <ArrowUpRight size={16} /></Link></section>
      <footer className="ph-footer"><Link className="ph-brand" href="/"><span className="ph-brand-mark"><AudioLines size={20} /></span><span>RUANG<span>KITA</span><small>PODCAST & CONVERSATIONS</small></span></Link><p>© 2026 RUANGKITA · Halaman hub podcast dalam tahap fondasi.</p><a href="#beranda">Kembali ke atas ↑</a></footer>
    </main>
  );
}
