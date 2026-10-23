"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownRight, ArrowRight, ArrowUpRight, AudioLines, BookOpen, CheckCircle2,
  Clock3, Headphones, Mail, Mic2, Play, Podcast, Search, Send, Sparkles, Users,
} from "lucide-react";
import "./podcast.css";

type Episode = {
  id: number;
  title: string;
  category: string;
  duration: string;
  summary: string;
  image: string;
  credit: string;
  creditUrl: string;
  notes: { time: string; title: string }[];
};

const photos = {
  studio: "https://images.pexels.com/photos/38125420/pexels-photo-38125420.jpeg?cs=srgb&dl=pexels-jakubzerdzicki-38125420.jpg&fm=jpg",
  host: "https://images.pexels.com/photos/7598553/pexels-photo-7598553.jpeg?cs=srgb&dl=pexels-cottonbro-7598553.jpg&fm=jpg",
  conversation: "https://images.pexels.com/photos/7598549/pexels-photo-7598549.jpeg?cs=srgb&dl=pexels-cottonbro-7598549.jpg&fm=jpg",
};

const episodes: Episode[] = [
  { id: 1, title: "Membangun Percakapan yang Bermakna", category: "Percakapan", duration: "Segera hadir", summary: "Cara mendengar dengan rasa ingin tahu dan memberi ruang bagi perspektif yang berbeda.", image: photos.host, credit: "cottonbro studio / Pexels", creditUrl: "https://www.pexels.com/photo/a-woman-in-a-studio-7598553/" , notes: [{ time: "00:00", title: "Pembukaan dan konteks" }, { time: "05:00", title: "Mendengar dengan rasa ingin tahu" }, { time: "18:00", title: "Merangkum ide utama" }] },
  { id: 2, title: "Komunitas, Kreativitas, dan Kolaborasi", category: "Komunitas", duration: "Segera hadir", summary: "Membangun kepercayaan dan kolaborasi yang sehat di dalam komunitas kreatif.", image: photos.conversation, credit: "cottonbro studio / Pexels", creditUrl: "https://www.pexels.com/photo/a-woman-in-a-studio-7598553/", notes: [{ time: "00:00", title: "Perkenalan topik" }, { time: "07:30", title: "Membangun kepercayaan" }, { time: "20:00", title: "Langkah kolaborasi" }] },
  { id: 3, title: "Di Balik Mikrofon: Menyiapkan Podcast", category: "Produksi", duration: "Segera hadir", summary: "Persiapan format, peran host, alur pembahasan, dan catatan sebelum rekaman.", image: photos.studio, credit: "Jakub Zerdzicki / Pexels", creditUrl: "https://www.pexels.com/photo/professional-podcast-setup-with-microphone-and-headphones-38125420/", notes: [{ time: "00:00", title: "Merumuskan tujuan episode" }, { time: "06:00", title: "Menyusun alur dan pertanyaan" }, { time: "16:00", title: "Persiapan produksi" }] },
];

const articles = [
  { category: "PANDUAN", title: "Show notes yang benar-benar membantu pendengar", summary: "Poin penting, tautan referensi, dan penanda waktu yang memudahkan pendengar kembali ke bagian favorit." },
  { category: "PRODUKSI", title: "Checklist sebelum merekam bersama tamu", summary: "Persiapan topik, izin rekaman, perangkat, dan rencana cadangan koneksi." },
  { category: "KOMUNITAS", title: "Satu percakapan, banyak cerita", summary: "Merencanakan ringkasan dan konten turunan tanpa kehilangan konteks pembicaraan." },
];

export default function PodcastHubPage() {
  const [filter, setFilter] = useState("Semua");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);
  const categories = ["Semua", ...Array.from(new Set(episodes.map((episode) => episode.category)))];
  const visibleEpisodes = useMemo(() => episodes.filter((episode) => (filter === "Semua" || episode.category === filter) && episode.title.toLowerCase().includes(query.toLowerCase())), [filter, query]);

  return (
    <main className="podcast-hub" id="beranda">
      <header className="ph-nav">
        <Link className="ph-brand" href="/"><span className="ph-brand-mark"><AudioLines size={22} /></span><span>RUANG<span>KITA</span><small>STORIES THAT BRING US CLOSER</small></span></Link>
        <nav aria-label="Navigasi podcast"><a href="#episode">Jelajahi</a><a href="#tentang">Tentang</a><a href="#artikel">Jurnal</a><a href="#kontak">Kontak</a></nav>
        <Link className="ph-nav-cta" href="/">Masuk Studio <ArrowUpRight size={16} /></Link>
      </header>

      <section className="ph-hero">
        <div className="ph-hero-copy">
          <span className="ph-eyebrow"><span className="ph-live-dot" /> SUARA YANG MENDEKATKAN KITA</span>
          <h1>Ide yang baik<br />dimulai dari <em>mendengar.</em></h1>
          <p>Tempat percakapan jujur, cerita yang membuka perspektif, dan suara komunitas bertemu. Ambil jeda, pasang headphone, dan temukan sesuatu yang baru.</p>
          <div className="ph-hero-actions"><a className="ph-button primary" href="#episode"><Headphones size={17} /> Temukan percakapan <ArrowRight size={16} /></a><a className="ph-text-link" href="#tentang">Kenali RUANGKITA <ArrowDownRight size={16} /></a></div>
          <div className="ph-hero-points"><span><Mic2 size={15} /> Cerita autentik</span><span><Users size={15} /> Perspektif beragam</span><span><Sparkles size={15} /> Ide yang bertumbuh</span></div>
        </div>
        <div className="ph-hero-photo" role="img" aria-label="Foto studio podcast dengan mikrofon dan headphone" style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(13,31,27,.78)), url("${photos.studio}")` }}>
          <div className="ph-photo-tag"><span className="ph-photo-tag-icon"><AudioLines size={18} /></span><span><strong>RUANGKITA ORIGINALS</strong><small>Setiap suara punya cerita.</small></span></div>
          <span className="ph-photo-index">01 — RUANG UNTUK BERCERITA</span>
        </div>
      </section>

      <section className="ph-featured" aria-labelledby="ph-featured-title">
        <div className="ph-featured-label"><span className="ph-live-dot" /> PILIHAN EDITOR</div>
        <div className="ph-featured-main"><div className="ph-featured-cover" style={{ backgroundImage: `url("${photos.host}")` }} /><div className="ph-featured-copy"><span className="ph-kicker">EPISODE PERTAMA · DALAM PERSIAPAN</span><h2 id="ph-featured-title">Mendengar adalah bentuk perhatian.</h2><p>Segera hadir di RUANGKITA Podcast. Audio dan jadwal publikasi belum tersedia.</p></div></div>
        <button className="ph-featured-play" disabled aria-label="Episode belum tersedia"><Play size={18} fill="currentColor" /></button>
      </section>

      <section className="ph-section" id="episode">
        <div className="ph-section-head"><div><span className="ph-kicker">DENGARKAN SESUAI SUASANA</span><h2>Jelajahi cerita</h2><p>Temukan rancangan topik untuk percakapan berikutnya. Kartu bertanda konsep belum merupakan episode yang diterbitkan.</p></div><label className="ph-search"><Search size={16} /><input aria-label="Cari episode" placeholder="Cari cerita..." value={query} onChange={(event) => setQuery(event.target.value)} /></label></div>
        <div className="ph-filters" role="group" aria-label="Filter kategori episode">{categories.map((category) => <button key={category} className={filter === category ? "active" : ""} onClick={() => setFilter(category)}>{category}</button>)}</div>
        <div className="ph-episode-grid">{visibleEpisodes.map((episode, index) => <article className="ph-episode-card" key={episode.id}>
          <div className="ph-episode-art" style={{ backgroundImage: `linear-gradient(180deg, rgba(8,24,21,.04) 25%, rgba(8,24,21,.76) 100%), url("${episode.image}")` }}><span className="ph-episode-number">0{index + 1}</span><span className="ph-episode-category">{episode.category}</span><span className="ph-image-credit"><a href={episode.creditUrl} target="_blank" rel="noreferrer">{episode.credit}</a></span></div>
          <div className="ph-episode-body"><div className="ph-episode-meta"><span className="ph-draft-pill">KONSEP</span><span><Clock3 size={13} /> Audio segera hadir</span></div><h3>{episode.title}</h3><p>{episode.summary}</p><div className="ph-player-placeholder"><span className="ph-player-icon"><Play size={16} fill="currentColor" /></span><div><strong>Belum tersedia untuk diputar</strong><span>Menunggu rekaman dan izin publikasi</span></div></div><button className="ph-show-notes-toggle" onClick={() => setExpanded(expanded === episode.id ? null : episode.id)} aria-expanded={expanded === episode.id}>{expanded === episode.id ? "Tutup garis besar" : "Lihat garis besar"} <ArrowRight size={14} /></button>{expanded === episode.id && <div className="ph-show-notes"><strong>Rencana topik</strong>{episode.notes.map((note) => <div key={note.time}><time>{note.time}</time><span>{note.title}</span></div>)}<p>Penanda waktu ini adalah rancangan editorial, bukan transkrip audio yang sudah terbit.</p></div>}</div>
        </article>)}</div>
        {visibleEpisodes.length === 0 && <p className="ph-empty">Tidak ada topik yang cocok dengan pencarian.</p>}
      </section>

      <section className="ph-about" id="tentang"><div className="ph-about-photo" style={{ backgroundImage: `linear-gradient(180deg, transparent 20%, rgba(10,35,29,.75)), url("${photos.conversation}")` }}><span>RUANG UNTUK SETIAP SUARA</span></div><div className="ph-about-copy"><span className="ph-kicker">CERITA DI BALIK RUANGKITA</span><h2>Lebih dekat lewat percakapan yang berarti.</h2><p>RUANGKITA adalah studio podcast virtual untuk kreator, komunitas, dan tim. Kami ingin membantu orang berkumpul, berbagi gagasan, dan membuat percakapan yang layak didengar.</p><p>Profil pendiri, cerita komunitas, dan program resmi akan dilengkapi sebelum publikasi final.</p><a href="#kontak" className="ph-inline-link">Mari ciptakan sesuatu bersama <ArrowRight size={15} /></a></div></section>

      <section className="ph-section ph-articles" id="artikel"><div className="ph-section-head"><div><span className="ph-kicker">CATATAN DARI RUANG KITA</span><h2>Jurnal & inspirasi</h2><p>Ide dan panduan yang mendampingi proses membuat percakapan lebih bermakna.</p></div><span className="ph-coming"><BookOpen size={15} /> Draf editorial</span></div><div className="ph-article-grid">{articles.map((article, index) => <article className="ph-article-card" key={article.title}><div className={`ph-article-art ph-article-art-${index + 1}`} style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(8,24,21,.45)), url("${[photos.host, photos.conversation, photos.studio][index]}")` }}><span>{article.category}</span></div><div className="ph-article-content"><h3>{article.title}</h3><p>{article.summary}</p><span className="ph-article-foot">KERANGKA ARTIKEL <ArrowUpRight size={15} /></span></div></article>)}</div></section>

      <section className="ph-connect"><div><span className="ph-kicker">DENGARKAN DI MANA SAJA</span><h2>Cerita baru, di platform favoritmu.</h2><p>Kanal resmi belum dihubungkan. Tombol akan diaktifkan setelah akun dan URL terverifikasi.</p></div><div className="ph-platforms"><span><strong>Spotify</strong><small>Menunggu tautan resmi</small><Headphones size={18} /></span><span><strong>Apple Podcasts</strong><small>Menunggu tautan resmi</small><Podcast size={18} /></span><span><strong>YouTube / iTunes</strong><small>Menunggu tautan resmi</small><Play size={18} /></span><span><strong>Instagram · X · LinkedIn</strong><small>Menunggu tautan resmi</small><ArrowUpRight size={18} /></span></div></section>

      <section className="ph-community-grid">
        <article className="ph-form-card" id="newsletter"><div className="ph-form-icon"><Mail size={21} /></div><span className="ph-kicker">SURAT DARI RUANGKITA</span><h2>Ide baru, langsung ke inbox.</h2><p>Newsletter belum aktif. Alamat email tidak akan dikirim atau disimpan sampai layanan dan persetujuan privasi terhubung.</p><label>Email Anda<input type="email" placeholder="nama@email.com" disabled /></label><button className="ph-button primary" disabled><Mail size={16} /> Segera hadir</button><small><CheckCircle2 size={13} /> Privasi pendengar adalah prioritas.</small></article>
        <article className="ph-form-card" id="kontak"><div className="ph-form-icon"><Send size={21} /></div><span className="ph-kicker">KIRIM CERITAMU</span><h2>Setiap ide layak punya ruang.</h2><p>Formulir kontak akan aktif setelah alamat tujuan dan endpoint aman ditetapkan.</p><label>Nama<input type="text" placeholder="Nama Anda" disabled /></label><label>Email<input type="email" placeholder="nama@email.com" disabled /></label><label>Pesan<textarea placeholder="Ceritakan ide Anda..." rows={3} disabled /></label><button className="ph-button primary" disabled><Send size={16} /> Segera hadir</button></article>
      </section>

      <section className="ph-testimonials"><div className="ph-quote-mark">“</div><div><span className="ph-kicker">DARI KOMUNITAS</span><h2>Ruang ini juga milikmu.</h2><p>Testimoni nyata akan ditampilkan setelah ada umpan balik dan izin publikasi dari pemberinya.</p></div><span className="ph-testimonial-status">Menunggu cerita komunitas</span></section>
      <section className="ph-bottom-cta"><div><span className="ph-kicker">PUNYA SESUATU UNTUK DICERITAKAN?</span><h2>Mulai dari satu percakapan.</h2><p>Studio RUANGKITA membantu menyiapkan konsep produksi podcast Anda.</p></div><Link href="/" className="ph-button light">Buka Studio <ArrowUpRight size={16} /></Link></section>
      <footer className="ph-footer"><Link className="ph-brand" href="/"><span className="ph-brand-mark"><AudioLines size={20} /></span><span>RUANG<span>KITA</span><small>STORIES THAT BRING US CLOSER</small></span></Link><p>© 2026 RUANGKITA · Foto: Pexels, digunakan sesuai lisensi platform.</p><a href="#beranda">Kembali ke atas ↑</a></footer>
    </main>
  );
}
