"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

type Room = {
  id: string;
  title: string;
  status: string;
  privacy_mode: string;
  created_at: string;
  scene_title?: string | null;
};
type ScenePreset = { id: string; slug: string; title: string; description: string };

export function RoomManager({ initialPresetSlug = "" }: { initialPresetSlug?: string }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [presets, setPresets] = useState<ScenePreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadRooms() {
    try {
      const response = await fetch("/api/rooms", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) {
        setMessage(response.status === 401 ? "Silakan masuk kembali untuk melihat ruang Anda." : (data.error || "Ruang belum dapat dimuat."));
        setRooms([]);
      } else {
        const loadedPresets = (data.presets ?? []) as ScenePreset[];
        setRooms(data.rooms ?? []);
        setPresets(loadedPresets);
        if (!selectedPresetId && initialPresetSlug) {
          const matchingPreset = loadedPresets.find((preset) => preset.slug === initialPresetSlug);
          if (matchingPreset) setSelectedPresetId(matchingPreset.id);
        }
        setMessage("");
      }
    } catch {
      setMessage("Koneksi ke layanan ruang gagal. Coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rooms", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const message = response.status === 401
            ? "Silakan masuk kembali untuk melihat ruang Anda."
            : (data.error || "Ruang belum dapat dimuat.");
          throw new Error(message);
        }
        return data as { rooms: Room[]; presets: ScenePreset[] };
      })
      .then((data) => {
        setRooms(data.rooms ?? []);
        const loadedPresets = data.presets ?? [];
        setPresets(loadedPresets);
        if (initialPresetSlug) {
          const matchingPreset = loadedPresets.find((preset) => preset.slug === initialPresetSlug);
          if (matchingPreset) setSelectedPresetId(matchingPreset.id);
        }
        setMessage("");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setRooms([]);
        setMessage(error instanceof Error ? error.message : "Koneksi ke layanan ruang gagal.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [initialPresetSlug]);

  async function createRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const safeTitle = title.trim();
    if (!safeTitle || safeTitle.length > 160) {
      setMessage("Judul harus berisi 1–160 karakter.");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: safeTitle, privacyMode: "invite_only", scenePresetId: selectedPresetId || null }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || "Ruang belum dapat dibuat.");
      } else {
        setTitle("");
        setMessage("Ruang draft berhasil dibuat. Siaran langsung belum aktif.");
        await loadRooms();
      }
    } catch {
      setMessage("Koneksi gagal. Ruang belum dapat dibuat.");
    } finally {
      setSaving(false);
    }
  }

  return <section className="room-manager">
    <div className="room-manager-head"><div><h2>Ruang podcast Anda</h2><p>Ruang disimpan sebagai draft privat; membuat ruang belum memulai siaran.</p></div><span className="room-count">{rooms.length} ruang</span></div>
    <form className="room-create-form" onSubmit={createRoom}>
      <label htmlFor="room-title">Nama ruang baru</label>
      <div className="room-create-row"><input id="room-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={160} placeholder="Contoh: Podcast Kreator Mingguan" required /><button className="primary-button" type="submit" disabled={saving || loading}>{saving ? "Menyimpan…" : "Buat draft ruang"}</button></div>
      <label htmlFor="scene-preset">Preset produksi</label>
      <select id="scene-preset" className="room-preset-select" value={selectedPresetId} onChange={(event) => setSelectedPresetId(event.target.value)} disabled={loading || presets.length === 0}>
        <option value="">Tanpa preset</option>
        {presets.map((preset) => <option key={preset.id} value={preset.id}>{preset.title} — {preset.description}</option>)}
      </select>
      <p className="room-field-help">Preset disimpan bersama draft ruang dan belum mengaktifkan siaran.</p>
    </form>
    {message && <p className="room-message" role="status">{message} {message.includes("masuk") && <Link href="/auth/sign-in">Masuk</Link>}</p>}
    {loading ? <p className="room-empty">Memuat ruang dan preset…</p> : rooms.length === 0 ? <p className="room-empty">Belum ada ruang. Buat draft pertama Anda di atas.</p> : <div className="room-list">{rooms.map((room) => <article className="room-item" key={room.id}><span className="room-item-icon">RK</span><div className="room-item-copy"><strong>{room.title}</strong><small>{room.scene_title ? `${room.scene_title} · ` : ""}{room.privacy_mode === "invite_only" ? "Privat · Undangan saja" : room.privacy_mode} · {new Date(room.created_at).toLocaleString("id-ID")}</small></div><span className="room-status">{room.status === "draft" ? "DRAFT" : room.status.toUpperCase()}</span></article>)}</div>}
  </section>;
}