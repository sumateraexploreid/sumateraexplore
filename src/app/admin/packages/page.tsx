"use client";

import React, { useCallback, useEffect, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import {
  AdminPageHeader,
  ModalDialog,
  StatusPill,
  ToastBanner,
} from "@/components/admin/AdminUi";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface PaxTier {
  pax: number;
  vehicle: string;
  priceMyr: number;
  label?: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  stops?: { time: string; place: string }[];
}

interface PackageItem {
  id: number;
  slug: string;
  short_label: string;
  name: string;
  duration: string;
  location_tag: string;
  price_myr: number;
  price_idr: number;
  is_featured: boolean;
  status: string;
  sort_order: number;
  image_url: string;
  hotels: string[];
  description: string;
  includes: string[];
  excludes: string[];
  notes: string[];
  tiers: PaxTier[];
  itinerary: ItineraryDay[];
}

const DEFAULT_FORM = {
  slug: "",
  short_label: "3D 2N",
  name: "",
  duration: "3 Hari 2 Malam",
  location_tag: "Danau Toba & Samosir",
  price_myr: 475,
  price_idr: 2090000,
  is_featured: true,
  status: "active",
  sort_order: 1,
  image_url: "/images/sumut/toba_hero.webp",
  description: "",
  hotelsText: "",
  includesText: "",
  excludesText: "",
  notesText: "",
  tiers: [
    { pax: 2, vehicle: "Innova / SUV", priceMyr: 800, label: "" },
    { pax: 4, vehicle: "Innova / SUV", priceMyr: 550, label: "" },
  ] as PaxTier[],
  itinerary: [
    {
      day: 1,
      title: "Day 1: Kualanamu — Parapat — Samosir",
      description: "Penjemputan bandara KNO langsung menuju Parapat dan Pulau Samosir.",
      stops: [{ time: "08.00", place: "Pickup Bandara Kualanamu (KNO)" }],
    },
  ] as ItineraryDay[],
};

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "tiers" | "details" | "itinerary">(
    "info",
  );
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const loadPackages = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ pageSize: "50" });
      if (q.trim()) qs.set("q", q.trim());
      const res = await adminFetch<ListResult<PackageItem>>(
        `/api/admin/packages?${qs.toString()}`,
      );
      setPackages(res.items);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat paket.",
      });
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    let active = true;
    const qs = new URLSearchParams({ pageSize: "50" });
    if (q.trim()) qs.set("q", q.trim());
    adminFetch<ListResult<PackageItem>>(`/api/admin/packages?${qs.toString()}`)
      .then((res) => {
        if (active) setPackages(res.items);
      })
      .catch((err) => {
        if (active) {
          setToast({
            type: "error",
            message: err instanceof Error ? err.message : "Gagal memuat paket.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("action") === "new") {
      const id = window.setTimeout(() => {
        setEditingId(null);
        setActiveTab("info");
        setForm(DEFAULT_FORM);
        setModalOpen(true);
      }, 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  function openCreate() {
    setEditingId(null);
    setActiveTab("info");
    setForm(DEFAULT_FORM);
    setModalOpen(true);
  }

  function openEdit(pkg: PackageItem) {
    setEditingId(pkg.id);
    setActiveTab("info");
    setForm({
      slug: pkg.slug,
      short_label: pkg.short_label,
      name: pkg.name,
      duration: pkg.duration,
      location_tag: pkg.location_tag,
      price_myr: pkg.price_myr,
      price_idr: pkg.price_idr,
      is_featured: pkg.is_featured,
      status: pkg.status,
      sort_order: pkg.sort_order,
      image_url: pkg.image_url,
      description: pkg.description,
      hotelsText: (pkg.hotels || []).join("\n"),
      includesText: (pkg.includes || []).join("\n"),
      excludesText: (pkg.excludes || []).join("\n"),
      notesText: (pkg.notes || []).join("\n"),
      tiers: pkg.tiers?.length ? pkg.tiers : [],
      itinerary: pkg.itinerary?.length ? pkg.itinerary : [],
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const toLines = (s: string) =>
      s
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

    const payload = {
      slug: form.slug,
      short_label: form.short_label,
      name: form.name,
      duration: form.duration,
      location_tag: form.location_tag,
      price_myr: Number(form.price_myr) || 0,
      price_idr: Number(form.price_idr) || 0,
      is_featured: form.is_featured,
      status: form.status,
      sort_order: Number(form.sort_order) || 0,
      image_url: form.image_url,
      description: form.description,
      hotels: toLines(form.hotelsText),
      includes: toLines(form.includesText),
      excludes: toLines(form.excludesText),
      notes: toLines(form.notesText),
      tiers: form.tiers,
      itinerary: form.itinerary,
    };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/packages/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({
          type: "success",
          message: "Paket tour diperbarui dan disinkronkan ke situs publik.",
        });
      } else {
        await adminFetch("/api/admin/packages", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast({
          type: "success",
          message: "Paket tour baru berhasil ditambahkan.",
        });
      }
      setModalOpen(false);
      await loadPackages();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan paket.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(pkg: PackageItem) {
    if (!window.confirm(`Hapus permanen paket "${pkg.name}"?`)) return;
    try {
      await adminFetch(`/api/admin/packages/${pkg.id}`, { method: "DELETE" });
      setToast({ type: "success", message: `Paket ${pkg.name} dihapus.` });
      await loadPackages();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menghapus paket.",
      });
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Paket Tour & Pricelist Tier (1-20 Pax)"
        subtitle="Edit harga dasar Weekday, daftar tier SUV/Hiace/ELF, pilihan hotel, fasilitas halal, dan itinerary. Perubahan langsung aktif di beranda & katalog."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover transition-colors"
          >
            <AdminIcon name="add_circle" className="w-[18px] h-[18px]" />
            Tambah Paket Baru
          </button>
        }
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      <div className="mb-5 flex items-center justify-between gap-3">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari nama paket, durasi, atau destinasi…"
          className="w-full sm:w-80 px-3.5 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent"
        />
        <span className="text-xs text-muted whitespace-nowrap num">
          {packages.length} paket
        </span>
      </div>

      {loading ? (
        <p className="text-sm text-muted py-8 text-center">Memuat daftar paket…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="rounded-card bg-paper-2 border border-rule overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/9] bg-paper-3 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pkg.image_url}
                  alt={pkg.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <StatusPill status={pkg.status} />
                  {pkg.is_featured ? (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-accent text-accent-ink">
                      Unggulan
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between gap-2 text-xs text-muted mb-1">
                  <span>{pkg.duration}</span>
                  <span className="num">Urutan #{pkg.sort_order}</span>
                </div>
                <h3 className="font-display text-base text-ink mb-1">{pkg.name}</h3>
                <p className="text-xs text-ink-2 mb-3">{pkg.location_tag}</p>

                <div className="mt-auto pt-3 border-t border-rule flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-muted">Mulai Weekday</p>
                    <p className="font-display text-lg text-accent num">
                      RM {pkg.price_myr.toLocaleString("en-US")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openEdit(pkg)}
                      className="px-3 py-1.5 rounded-md bg-accent text-accent-ink text-xs font-bold whitespace-nowrap hover:bg-accent-hover"
                    >
                      Edit Lengkap
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(pkg)}
                      aria-label={`Hapus ${pkg.name}`}
                      className="p-1.5 rounded-md border border-rule text-muted hover:text-error hover:border-error"
                    >
                      <AdminIcon name="delete" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <ModalDialog
        open={modalOpen}
        title={editingId ? `Edit Paket: ${form.name}` : "Tambah Paket Tour Baru"}
        subtitle="Kelola informasi paket, tarif tier per ukuran grup, hotel halal, dan itinerary harian."
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-4xl"
      >
        <div className="flex flex-wrap gap-1.5 mb-5 border-b border-rule pb-3">
          {(
            [
              ["info", "1. Info Utama & Foto"],
              ["tiers", `2. Tier Harga (${form.tiers.length})`],
              ["details", "3. Hotel & Fasilitas"],
              ["itinerary", `4. Itinerary (${form.itinerary.length} Hari)`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${activeTab === key
                ? "bg-accent text-accent-ink"
                : "bg-paper-2 text-ink-2 hover:text-ink"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {activeTab === "info" ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Nama Paket
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-ink-2">
                      Alamat Link Paket (Slug)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const slug = form.name
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/^-+|-+$/g, "");
                        if (slug) setForm({ ...form, slug });
                      }}
                      className="text-[11px] font-bold text-accent hover:underline"
                    >
                      Buat Link Otomatis
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="danau-toba-3d2n"
                    className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink font-mono"
                  />
                  <p className="text-[11px] text-muted mt-1">
                    Dipakai di link web (contoh: /tour/danau-toba-3d2n). Boleh klik &ldquo;Buat Link Otomatis&rdquo;.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Label Singkat (Hero Tile)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.short_label}
                    onChange={(e) => setForm({ ...form, short_label: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Durasi
                  </label>
                  <input
                    type="text"
                    required
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Area / Tag Lokasi
                  </label>
                  <input
                    type="text"
                    required
                    value={form.location_tag}
                    onChange={(e) => setForm({ ...form, location_tag: e.target.value })}
                    className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1">
                      Mulai RM
                    </label>
                    <input
                      type="number"
                      min={0}
                      required
                      value={form.price_myr}
                      onChange={(e) => {
                        const val = Number(e.target.value) || 0;
                        setForm({
                          ...form,
                          price_myr: val,
                          price_idr: val * 4400,
                        });
                      }}
                      className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1">
                      Urutan & Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className="w-full px-2 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                    >
                      <option value="active">Aktif</option>
                      <option value="draft">Draf</option>
                      <option value="archived">Arsip</option>
                    </select>
                  </div>
                </div>
              </div>

              <MediaPickerField
                label="Thumbnail Paket Wisata"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="packages"
              />

              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Deskripsi Paket
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-sm text-ink"
                />
              </div>

              <label className="inline-flex items-center gap-2 text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Tampilkan sebagai Paket Unggulan di Beranda
              </label>
            </div>
          ) : null}

          {activeTab === "tiers" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  Daftar harga resmi per orang berdasarkan kapasitas rombongan & jenis armada.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      tiers: [
                        ...form.tiers,
                        { pax: 4, vehicle: "Innova / SUV", priceMyr: 500, label: "" },
                      ],
                    })
                  }
                  className="px-3 py-1.5 rounded-md bg-paper-2 border border-accent text-xs font-semibold text-accent"
                >
                  + Tambah Baris Tier
                </button>
              </div>

              {form.tiers.map((tier, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 gap-2 items-center p-2.5 rounded-md bg-paper-2 border border-rule"
                >
                  <div className="col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={tier.pax}
                      onChange={(e) => {
                        const next = [...form.tiers];
                        next[idx] = { ...tier, pax: Number(e.target.value) || 1 };
                        setForm({ ...form, tiers: next });
                      }}
                      placeholder="Pax"
                      className="w-full px-2 py-1.5 rounded bg-paper border border-rule text-xs text-ink"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={tier.vehicle}
                      onChange={(e) => {
                        const next = [...form.tiers];
                        next[idx] = { ...tier, vehicle: e.target.value };
                        setForm({ ...form, tiers: next });
                      }}
                      placeholder="Armada"
                      className="w-full px-2 py-1.5 rounded bg-paper border border-rule text-xs text-ink"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="number"
                      min={0}
                      value={tier.priceMyr}
                      onChange={(e) => {
                        const next = [...form.tiers];
                        next[idx] = { ...tier, priceMyr: Number(e.target.value) || 0 };
                        setForm({ ...form, tiers: next });
                      }}
                      placeholder="RM/pax"
                      className="w-full px-2 py-1.5 rounded bg-paper border border-rule text-xs text-ink"
                    />
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      value={tier.label || ""}
                      onChange={(e) => {
                        const next = [...form.tiers];
                        next[idx] = { ...tier, label: e.target.value };
                        setForm({ ...form, tiers: next });
                      }}
                      placeholder="Label opsional"
                      className="w-full px-2 py-1.5 rounded bg-paper border border-rule text-xs text-ink"
                    />
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          tiers: form.tiers.filter((_, i) => i !== idx),
                        })
                      }
                      className="text-muted hover:text-error p-1"
                    >
                      <AdminIcon name="close" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === "details" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Hotel / Akomodasi (1 per baris)
                </label>
                <textarea
                  rows={4}
                  value={form.hotelsText}
                  onChange={(e) => setForm({ ...form, hotelsText: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-xs text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Catatan Khusus Paket (1 per baris)
                </label>
                <textarea
                  rows={4}
                  value={form.notesText}
                  onChange={(e) => setForm({ ...form, notesText: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-xs text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Sudah Termasuk / Include (1 per baris)
                </label>
                <textarea
                  rows={6}
                  value={form.includesText}
                  onChange={(e) => setForm({ ...form, includesText: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-xs text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Belum Termasuk / Exclude (1 per baris)
                </label>
                <textarea
                  rows={6}
                  value={form.excludesText}
                  onChange={(e) => setForm({ ...form, excludesText: e.target.value })}
                  className="w-full px-3 py-2 rounded-md bg-paper-2 border border-rule text-xs text-ink"
                />
              </div>
            </div>
          ) : null}

          {activeTab === "itinerary" ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      itinerary: [
                        ...form.itinerary,
                        {
                          day: form.itinerary.length + 1,
                          title: `Day ${form.itinerary.length + 1}: Baru`,
                          description: "",
                          stops: [],
                        },
                      ],
                    })
                  }
                  className="px-3 py-1.5 rounded-md bg-paper-2 border border-accent text-xs font-semibold text-accent"
                >
                  + Tambah Hari
                </button>
              </div>
              {form.itinerary.map((dayItem, dIdx) => (
                <div
                  key={dIdx}
                  className="p-3.5 rounded-md bg-paper-2 border border-rule space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={dayItem.title}
                      onChange={(e) => {
                        const next = [...form.itinerary];
                        next[dIdx] = { ...dayItem, title: e.target.value };
                        setForm({ ...form, itinerary: next });
                      }}
                      className="flex-1 px-3 py-1.5 rounded bg-paper border border-rule text-sm font-semibold text-ink"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          itinerary: form.itinerary.filter((_, i) => i !== dIdx),
                        })
                      }
                      className="text-xs text-error hover:underline"
                    >
                      Hapus Hari
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={dayItem.description}
                    onChange={(e) => {
                      const next = [...form.itinerary];
                      next[dIdx] = { ...dayItem, description: e.target.value };
                      setForm({ ...form, itinerary: next });
                    }}
                    className="w-full px-3 py-1.5 rounded bg-paper border border-rule text-xs text-ink"
                  />
                </div>
              ))}
            </div>
          ) : null}

          <div className="pt-4 border-t border-rule flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-md border border-rule text-sm text-ink-2"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-md bg-accent text-accent-ink text-sm font-bold whitespace-nowrap hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan…" : "Terbitkan ke Web"}
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
