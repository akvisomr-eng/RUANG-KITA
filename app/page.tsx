'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, AudioLines, Bot, Check, ChevronDown, CircleHelp, Clapperboard, Layers3, MonitorPlay, Plus, Settings2, ShieldCheck, Sparkles, Users, Wifi, X } from 'lucide-react';

type Scene = { name: string; label: string; description: string; colors: [string, string] };
const scenes: Scene[] = [
  { name: 'Ruang Hangat', label: 'PODCAST', description: 'Studio intim untuk percakapan mendalam', colors: ['#173c37', '#c69b66'] },
  { name: 'Kota Malam', label: 'TALK SHOW', description: 'Nuansa neon untuk diskusi dan hiburan', colors: ['#30205a', '#8e6aff'] },
  { name: 'Ruang Berita', label: 'LIVE UPDATE', description: 'Tata letak bersih untuk berita dan edukasi', colors: ['#18324e', '#57a9d8'] },
];

const features = [
  { icon: Users, title: 'Multi-host & tamu', text: 'Ruang dirancang untuk host, co-host, tamu, produser, dan penonton.' },
  { icon: Clapperboard, title: 'Adegan fleksibel', text: 'Pilih konsep studio dan siapkan alur produksi sebelum siaran.' },
  { icon: Bot, title: 'AI co-producer', text: 'Asisten produksi direncanakan untuk memberi saran, bukan mengambil alih kontrol penting.' },
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<'studio' | 'avatars' | 'production'>('studio');
  const [showStatus, setShowStatus] = useState(false);

  return <main className="shell">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="RUANGKITA beranda"><span className="brand-mark"><AudioLines size={22}/></span><span>RUANG<span className="brand-light">KITA</span><small>VIRTUAL PRODUCTION</small></span></a>
      <div className="workspace"><div className="workspace-icon">RK</div><div><strong>Creator Workspace</strong><small>Personal workspace</small></div><ChevronDown size={16}/></div>
      <div className="nav-label">WORKSPACE</div>
      <button className={`nav-item ${tab === 'studio' ? 'active' : ''}`} onClick={() => setTab('studio')}><MonitorPlay size={18}/> Studio <span className="nav-dot"/></button>
      <button className={`nav-item ${tab === 'avatars' ? 'active' : ''}`} onClick={() => setTab('avatars')}><Users size={18}/> Avatar Studio</button>
      <button className={`nav-item ${tab === 'production' ? 'active' : ''}`} onClick={() => setTab('production')}><Layers3 size={18}/> Produksi & Scene</button>
      <div className="nav-label nav-label-gap">TOOLS</div>
      <button className="nav-item" onClick={() => setShowStatus(true)}><Activity size={18}/> Status sistem</button>
      <button className="nav-item" onClick={() => setShowStatus(true)}><ShieldCheck size={18}/> Privasi & izin</button>
      <div className="sidebar-bottom"><div className="support-icon"><CircleHelp size={18}/></div><div><strong>Butuh bantuan?</strong><small>Dokumentasi segera hadir</small></div></div>
      <div className="profile"><div className="profile-avatar">RK</div><div><strong>Creator</strong><small>Mode pratinjau</small></div><Settings2 size={18}/></div>
    </aside>
    <section className="main-panel" id="top">
      <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <strong>{tab === 'studio' ? 'Studio' : tab === 'avatars' ? 'Avatar Studio' : 'Produksi & Scene'}</strong></div><div className="top-actions"><span className="preview-pill"><span/> PRATINJAU</span><button className="icon-button" aria-label="Bantuan" onClick={() => setShowStatus(true)}><CircleHelp size={18}/></button><div className="profile-avatar mini">RK</div></div></header>
      <div className="content">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> RUANG KREATIF ANDA</div><h1>{tab === 'studio' ? 'Semua ide punya ruang.' : tab === 'avatars' ? 'Hadir dengan cara Anda.' : 'Produksi, dengan kendali penuh.'}</h1><p>{tab === 'studio' ? 'Siapkan panggung, kumpulkan suara, dan bangun percakapan yang berkesan.' : tab === 'avatars' ? 'Konsep avatar 3D dan mode tampil tanpa kamera akan hadir di modul ini.' : 'Atur scene dan alur produksi. Fitur siaran langsung belum diaktifkan.'}</p></div><Link className="primary-button" href="/dashboard"><Plus size={17}/> Buat ruang</Link></section>
        <section className="hero-card"><div className="hero-copy"><div className="live-chip"><span className="live-dot"/> CREATOR STUDIO</div><h2>Podcast tanpa batas<br/><em>ruang dan ekspresi.</em></h2><p>Mulai dari percakapan sederhana hingga produksi multi-host. Pilih suasana, tentukan format, dan biarkan ide Anda menjadi pusat perhatian.</p><button className="hero-button" onClick={() => setShowStatus(true)}>Jelajahi studio <span>↗</span></button><div className="hero-meta"><span><ShieldCheck size={14}/> Privasi sebagai prioritas</span><span><Wifi size={14}/> Adaptif untuk koneksi</span></div></div><div className="hero-art" aria-label="Ilustrasi ruang podcast abstrak"><div className="orb orb-one"/><div className="orb orb-two"/><div className="sound-ring ring-one"/><div className="sound-ring ring-two"/><div className="mic-stand"><div className="mic-head"/><div className="mic-neck"/><div className="mic-base"/></div><div className="equalizer"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="art-caption"><span className="art-caption-icon"><AudioLines size={17}/></span><div><strong>YOUR SPACE, YOUR VOICE</strong><small>Studio experience · Preview</small></div></div></div></section>
        <section className="section-head"><div><h2>Pilih suasana studio</h2><p>Preset visual untuk memulai konsep produksi Anda.</p></div><button className="text-button" onClick={() => setTab('production')}>Lihat semua <span>→</span></button></section>
        <section className="scene-grid">{scenes.map((s, i) => <button key={s.name} className={`scene-card ${selected === i ? 'selected' : ''}`} onClick={() => setSelected(i)}><div className="scene-preview" style={{background:`radial-gradient(circle at 75% 22%, ${s.colors[1]}aa, transparent 35%), linear-gradient(135deg, ${s.colors[0]}, #101820)`}}><div className="scene-grid-lines"/><div className="scene-window"/><div className="scene-sofa"><span/><span/><span/></div><div className="scene-mic"><i/><b/></div><span className="scene-type">{s.label}</span><span className="scene-select">{selected === i ? <Check size={14}/> : <Plus size={14}/>}</span></div><div className="scene-info"><div><strong>{s.name}</strong><p>{s.description}</p></div><ChevronDown size={16}/></div></button>)}</section>
        <section className="section-head features-head"><div><h2>Dirancang untuk kreator</h2><p>Fondasi pengalaman produksi yang sedang dibangun.</p></div></section>
        <section className="feature-grid">{features.map(({icon: Icon, title, text}) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={19}/></span><h3>{title}</h3><p>{text}</p></article>)}</section>
        <section className="status-banner"><div className="status-banner-icon"><Activity size={20}/></div><div><strong>Fondasi teknis sedang disiapkan</strong><p>Ini adalah pratinjau antarmuka. Login, database langsung, kamera, audio/video real-time, perekaman, dan streaming belum terhubung.</p></div><button onClick={() => setShowStatus(true)}>Lihat status <span>→</span></button></section>
        <footer><span>© 2026 RUANGKITA</span><span>Built for better conversations <AudioLines size={13}/></span><button onClick={() => setShowStatus(true)}>Status sistem</button></footer>
      </div>
    </section>
    {showStatus && <div className="modal-backdrop" role="presentation" onClick={() => setShowStatus(false)}><section className="status-modal" role="dialog" aria-modal="true" aria-labelledby="status-title" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setShowStatus(false)} aria-label="Tutup"><X size={18}/></button><span className="modal-symbol"><Activity size={22}/></span><div className="eyebrow">STATUS IMPLEMENTASI</div><h2 id="status-title">Pratinjau, belum live</h2><p>Integrasi autentikasi dan draft-room API sudah ditambahkan, tetapi belum diuji di hosting. Media real-time, perekaman, dan streaming belum terhubung.</p><div className="status-list"><div><span className="status-neutral"/> Antarmuka studio <strong>Pratinjau</strong></div><div><span className="status-neutral"/> Neon Auth & kontrol akses <strong>Kode ada; belum diuji</strong></div><div><span className="status-neutral"/> WebRTC / SFU <strong>Belum</strong></div><div><span className="status-neutral"/> CI & deployment publik <strong>Belum</strong></div></div><button className="primary-button full" onClick={() => setShowStatus(false)}>Mengerti</button></section></div>}
  </main>;
}