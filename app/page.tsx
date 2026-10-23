'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, AudioLines, Bot, Check, ChevronDown, CircleHelp, Clapperboard, Layers3, MonitorPlay, Plus, Settings2, ShieldCheck, Sparkles, Users, Wifi, X, Mic, LockKeyhole, Palette, SlidersHorizontal } from 'lucide-react';

type Scene = { name: string; label: string; description: string; colors: [string, string] };
type Panel = 'studio' | 'avatars' | 'production';
type Dialog = 'status' | 'privacy' | 'help' | null;

const scenes: Scene[] = [
  { name: 'Ruang Hangat', label: 'PODCAST', description: 'Studio intim untuk percakapan mendalam', colors: ['#173c37', '#c69b66'] },
  { name: 'Kota Malam', label: 'COMMUNITY TALK', description: 'Nuansa neon untuk diskusi komunitas dan hiburan', colors: ['#30205a', '#8e6aff'] },
  { name: 'Ruang Berita', label: 'HYBRID AVATAR', description: 'Format gabungan video manusia dan avatar 3D', colors: ['#18324e', '#57a9d8'] },
  { name: 'Suara Fokus', label: 'AUDIO FIRST', description: 'Produksi berbasis suara untuk perangkat atau jaringan terbatas', colors: ['#173b44', '#55c7b6'] },
];

const presetSlugs = ['podcast-formal', 'community-talk', 'podcast-hybrid', 'audio-first'];

const avatarOptions = [
  { id: 'human', title: 'Presenter realistis', detail: 'Gaya presenter manusia untuk podcast formal', icon: Users },
  { id: 'stylized', title: 'Karakter stylized', detail: 'Gaya karakter 3D untuk konten kreatif', icon: Palette },
  { id: 'voice', title: 'Suara tanpa kamera', detail: 'Format audio-first tanpa menampilkan wajah', icon: Mic },
];

const features = [
  { icon: Users, title: 'Multi-host & tamu', text: 'Fondasi ruang untuk host, co-host, tamu, produser, dan penonton.' },
  { icon: Clapperboard, title: 'Adegan fleksibel', text: 'Pilih preset visual untuk menyiapkan konsep produksi.' },
  { icon: Bot, title: 'AI co-producer', text: 'Direncanakan sebagai asisten saran dengan kendali tetap di tangan host.' },
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [tab, setTab] = useState<Panel>('studio');
  const [dialog, setDialog] = useState<Dialog>(null);
  const [avatarChoice, setAvatarChoice] = useState('human');
  const scene = scenes[selected];

  const switchPanel = (panel: Panel) => {
    setTab(panel);
    setDialog(null);
  };

  return <main className="shell">
    <aside className="sidebar">
      <a className="brand" href="#top" aria-label="RUANGKITA beranda"><span className="brand-mark"><AudioLines size={22}/></span><span>RUANG<span className="brand-light">KITA</span><small>VIRTUAL PRODUCTION</small></span></a>
      <div className="workspace"><div className="workspace-icon">RK</div><div><strong>Creator Workspace</strong><small>Pratinjau lokal</small></div><ChevronDown size={16}/></div>
      <div className="nav-label">WORKSPACE</div>
      <button className={`nav-item ${tab === 'studio' ? 'active' : ''}`} aria-current={tab === 'studio' ? 'page' : undefined} onClick={() => switchPanel('studio')}><MonitorPlay size={18}/> Studio {tab === 'studio' && <span className="nav-dot"/>}</button>
      <button className={`nav-item ${tab === 'avatars' ? 'active' : ''}`} aria-current={tab === 'avatars' ? 'page' : undefined} onClick={() => switchPanel('avatars')}><Users size={18}/> Avatar Studio {tab === 'avatars' && <span className="nav-dot"/>}</button>
      <button className={`nav-item ${tab === 'production' ? 'active' : ''}`} aria-current={tab === 'production' ? 'page' : undefined} onClick={() => switchPanel('production')}><Layers3 size={18}/> Produksi & Scene {tab === 'production' && <span className="nav-dot"/>}</button>
      <div className="nav-label nav-label-gap">TOOLS</div>
      <button className="nav-item" onClick={() => setDialog('status')}><Activity size={18}/> Status sistem</button>
      <button className="nav-item" onClick={() => setDialog('privacy')}><ShieldCheck size={18}/> Privasi & izin</button>
      <button className="nav-item" onClick={() => setDialog('help')}><CircleHelp size={18}/> Bantuan & panduan</button>
      <div className="sidebar-bottom"><div className="support-icon"><CircleHelp size={18}/></div><div><strong>Perlu mulai bekerja?</strong><small>Buat draft ruang privat</small></div></div>
      <Link className="sidebar-cta" href="/pricing">Paket & Langganan</Link><Link className="sidebar-cta" href="/dashboard"><Plus size={15}/> Buka workspace</Link>
      <div className="profile"><div className="profile-avatar">RK</div><div><strong>Pengunjung</strong><small>Mode pratinjau</small></div><Settings2 size={18}/></div>
    </aside>
    <section className="main-panel" id="top">
      <header className="topbar"><div className="breadcrumbs">Workspace <span>/</span> <strong>{tab === 'studio' ? 'Studio' : tab === 'avatars' ? 'Avatar Studio' : 'Produksi & Scene'}</strong></div><div className="top-actions"><span className="preview-pill"><span/> PRATINJAU</span><button className="icon-button" aria-label="Bantuan" onClick={() => setDialog('help')}><CircleHelp size={18}/></button><div className="profile-avatar mini">RK</div></div></header>
      <div className="content">
        <section className="welcome-row"><div><div className="eyebrow"><Sparkles size={14}/> RUANG KREATIF ANDA</div><h1>{tab === 'studio' ? 'Semua ide punya ruang.' : tab === 'avatars' ? 'Hadir dengan cara Anda.' : 'Produksi, dengan kendali penuh.'}</h1><p>{tab === 'studio' ? 'Siapkan panggung, kumpulkan suara, dan bangun percakapan yang berkesan.' : tab === 'avatars' ? 'Pilih konsep avatar untuk menentukan arah tampilan konten Anda.' : 'Pilih preset, periksa detail scene, lalu lanjutkan ke draft ruang privat.'}</p></div><Link className="primary-button" href={`/dashboard?preset=${presetSlugs[selected]}`}><Plus size={17}/> Buat ruang</Link></section>

        {tab === 'studio' && <>
          <section className="hero-card"><div className="hero-copy"><div className="live-chip"><span className="live-dot"/> CREATOR STUDIO</div><h2>Podcast tanpa batas<br/><em>ruang dan ekspresi.</em></h2><p>Mulai dari percakapan sederhana hingga produksi multi-host. Pilih suasana, tentukan format, dan siapkan ide Anda.</p><button className="hero-button" onClick={() => switchPanel('production')}>Jelajahi studio <span>↗</span></button><div className="hero-meta"><span><ShieldCheck size={14}/> Privasi sebagai prioritas</span><span><Wifi size={14}/> Adaptif untuk koneksi</span></div></div><div className="hero-art" aria-label="Ilustrasi ruang podcast abstrak"><div className="orb orb-one"/><div className="orb orb-two"/><div className="sound-ring ring-one"/><div className="sound-ring ring-two"/><div className="mic-stand"><div className="mic-head"/><div className="mic-neck"/><div className="mic-base"/></div><div className="equalizer"><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="art-caption"><span className="art-caption-icon"><AudioLines size={17}/></span><div><strong>YOUR SPACE, YOUR VOICE</strong><small>Studio experience · Preview</small></div></div></div></section>
          <section className="section-head"><div><h2>Pilih suasana studio</h2><p>Pilih salah satu preset untuk melihat detail produksi.</p></div><button className="text-button" onClick={() => switchPanel('production')}>Lihat detail <span>→</span></button></section>
          <section className="scene-grid">{scenes.map((s, i) => <button key={s.name} className={`scene-card ${selected === i ? 'selected' : ''}`} aria-pressed={selected === i} onClick={() => setSelected(i)}><div className="scene-preview" style={{background:`radial-gradient(circle at 75% 22%, ${s.colors[1]}aa, transparent 35%), linear-gradient(135deg, ${s.colors[0]}, #101820)`}}><div className="scene-grid-lines"/><div className="scene-window"/><div className="scene-sofa"><span/><span/><span/></div><div className="scene-mic"><i/><b/></div><span className="scene-type">{s.label}</span><span className="scene-select">{selected === i ? <Check size={14}/> : <Plus size={14}/>}</span></div><div className="scene-info"><div><strong>{s.name}</strong><p>{s.description}</p></div><ChevronDown size={16}/></div></button>)}</section>
          <section className="feature-grid">{features.map(({icon: Icon, title, text}) => <article className="feature-card" key={title}><span className="feature-icon"><Icon size={19}/></span><h3>{title}</h3><p>{text}</p></article>)}</section>
        </>}

        {tab === 'avatars' && <section className="module-panel">
          <div className="module-heading"><span className="module-icon"><Users size={20}/></span><div><h2>Avatar Studio</h2><p>Pilih preferensi visual awal. Ini belum menghasilkan atau memuat avatar 3D.</p></div></div>
          <div className="avatar-preview"><div className="avatar-orbit"/><div className="avatar-placeholder"><Users size={48}/></div><span className="preview-tag">KONSEP · BELUM 3D</span><h3>{avatarOptions.find(option => option.id === avatarChoice)?.title}</h3><p>{avatarOptions.find(option => option.id === avatarChoice)?.detail}</p></div>
          <div className="avatar-option-grid">{avatarOptions.map(({id,title,detail,icon: Icon}) => <button key={id} className={`avatar-option ${avatarChoice === id ? 'selected' : ''}`} aria-pressed={avatarChoice === id} onClick={() => setAvatarChoice(id)}><Icon size={20}/><strong>{title}</strong><span>{detail}</span><small>{avatarChoice === id ? 'Dipilih' : 'Pilih konsep'}</small></button>)}</div>
          <div className="notice-row"><ShieldCheck size={18}/><p>Untuk avatar yang menyerupai orang nyata, RUANGKITA akan mensyaratkan persetujuan pemilik kemiripan dan bukti lisensi aset sebelum dipublikasikan.</p></div>
          <div className="module-actions"><button className="secondary-button" onClick={() => setDialog('privacy')}><LockKeyhole size={16}/> Baca privasi & izin</button><Link className="primary-button" href={`/dashboard?preset=${presetSlugs[selected]}`}><Plus size={16}/> Buat draft ruang</Link></div>
        </section>}

        {tab === 'production' && <section className="module-panel">
          <div className="module-heading"><span className="module-icon"><Clapperboard size={20}/></span><div><h2>Produksi & Scene</h2><p>Konfigurasi konsep visual sebelum membuat draft ruang.</p></div></div>
          <div className="production-selected"><div className="production-art" style={{background:`radial-gradient(circle at 75% 22%, ${scene.colors[1]}aa, transparent 35%), linear-gradient(135deg, ${scene.colors[0]}, #101820)`}}><span>{scene.label}</span><AudioLines size={42}/></div><div className="production-detail"><span className="detail-label">PRESET TERPILIH</span><h3>{scene.name}</h3><p>{scene.description}</p><ul><li><Check size={15}/> Konsep visual siap ditinjau</li><li><Check size={15}/> Privasi ruang default: undangan saja</li><li><Activity size={15}/> Siaran langsung belum tersedia</li></ul><Link className="primary-button" href={`/dashboard?preset=${presetSlugs[selected]}`}><Plus size={16}/> Buat draft dengan preset ini</Link></div></div>
          <div className="section-head"><div><h2>Semua preset</h2><p>Pilih preset untuk memperbarui detail di atas.</p></div><span className="count-pill">{scenes.length} preset konsep</span></div>
          <div className="scene-grid">{scenes.map((s, i) => <button key={s.name} className={`scene-card ${selected === i ? 'selected' : ''}`} aria-pressed={selected === i} onClick={() => setSelected(i)}><div className="scene-preview" style={{background:`radial-gradient(circle at 75% 22%, ${s.colors[1]}aa, transparent 35%), linear-gradient(135deg, ${s.colors[0]}, #101820)`}}><div className="scene-grid-lines"/><div className="scene-window"/><div className="scene-sofa"><span/><span/><span/></div><div className="scene-mic"><i/><b/></div><span className="scene-type">{s.label}</span><span className="scene-select">{selected === i ? <Check size={14}/> : <Plus size={14}/>}</span></div><div className="scene-info"><div><strong>{s.name}</strong><p>{s.description}</p></div><ChevronDown size={16}/></div></button>)}</div>
          <div className="notice-row"><SlidersHorizontal size={18}/><p>Preset disimpan bersama draft ruang saat Anda membuat ruang di workspace. Pratinjau visual di halaman ini masih berupa konsep; preset belum mengendalikan compositor siaran langsung.</p></div>
        </section>}

        <section className="status-banner"><div className="status-banner-icon"><Activity size={20}/></div><div><strong>Pratinjau antarmuka — bukan status siaran</strong><p>Menu kini berpindah ke panel yang sesuai. Login, database hosted, kamera/audio-video real-time, perekaman, dan streaming masih memerlukan pengujian terpisah.</p></div><button onClick={() => setDialog('status')}>Lihat status <span>→</span></button></section>
        <footer><span>© 2026 RUANGKITA</span><span>Built for better conversations <AudioLines size={13}/></span><button onClick={() => setDialog('status')}>Status sistem</button></footer>
      </div>
    </section>
    {dialog && <div className="modal-backdrop" role="presentation" onClick={() => setDialog(null)}><section className="status-modal" role="dialog" aria-modal="true" aria-labelledby="status-title" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setDialog(null)} aria-label="Tutup"><X size={18}/></button><span className="modal-symbol">{dialog === 'privacy' ? <ShieldCheck size={22}/> : dialog === 'help' ? <CircleHelp size={22}/> : <Activity size={22}/>}</span><div className="eyebrow">{dialog === 'privacy' ? 'PRIVASI & IZIN' : dialog === 'help' ? 'PANDUAN' : 'STATUS IMPLEMENTASI'}</div><h2 id="status-title">{dialog === 'privacy' ? 'Kontrol privasi' : dialog === 'help' ? 'Cara mulai menggunakan RUANGKITA' : 'Pratinjau, belum live'}</h2>
      {dialog === 'privacy' ? <><p>Ruang baru dirancang privat secara default. Sebelum fitur media aktif, aplikasi harus menerapkan pemeriksaan pemilik/anggota di server, token singkat, persetujuan eksplisit untuk perekaman, dan pengelolaan retensi media.</p><div className="status-list"><div><span className="status-neutral"/> Ruang draft <strong>Privat default</strong></div><div><span className="status-neutral"/> Perekaman <strong>Belum tersedia</strong></div><div><span className="status-neutral"/> Avatar orang nyata <strong>Perlu persetujuan</strong></div></div></> : dialog === 'help' ? <><p>Gunakan menu kiri untuk berpindah modul. Pilih preset di Studio atau Produksi & Scene. Tombol “Buat ruang” membuka dashboard akun; login dan koneksi database hosting masih perlu diverifikasi.</p><div className="status-list"><div><span className="status-neutral"/> Studio <strong>Pilih preset</strong></div><div><span className="status-neutral"/> Avatar Studio <strong>Pilih konsep</strong></div><div><span className="status-neutral"/> Workspace <strong>Draft privat</strong></div></div></> : <><p>CI harus diverifikasi pada commit terbaru melalui GitHub Actions sebelum rilis. Namun autentikasi dan draft-room API belum diuji di hosting; media real-time, perekaman, dan streaming belum terhubung.</p><div className="status-list"><div><span className="status-neutral"/> Antarmuka studio <strong>Pratinjau interaktif</strong></div><div><span className="status-neutral"/> Neon Auth & kontrol akses <strong>Kode ada; hosted test tertunda</strong></div><div><span className="status-neutral"/> WebRTC / SFU <strong>Belum terintegrasi</strong></div><div><span className="status-neutral"/> Launch komersial <strong>Belum siap</strong></div></div></>}
      <button className="primary-button full" onClick={() => setDialog(null)}>Mengerti</button></section></div>}
  </main>;
}
