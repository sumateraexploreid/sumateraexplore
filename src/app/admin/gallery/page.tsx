"use client";

import React, { useCallback, useEffect, useState } from "react";
import { adminFetch, type ListResult } from "@/lib/admin-client";
import {
  AdminPageHeader,
  ModalDialog,
  ToastBanner,
} from "@/components/admin/AdminUi";
import { MediaPickerField } from "@/components/admin/MediaPickerField";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface GalleryRow {
  id: number;
  image_url: string;
  caption: string;
  category: string;
  type: string;
  slug: string | null;
  sort_order: number;
  is_active: boolean;
}

const EMPTY_GALLERY = {
  image_url: "/images/sumut/toba_hero.webp",
  caption: "",
  category: "Danau Toba",
  type: "general",
  slug: "",
  is_active: true,
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_GALLERY);
  const [saving, setSaving] = useState(false);

  const loadGallery = useCallback(async () => {
    try {
      const res = await adminFetch<ListResult<GalleryRow>>(
        "/api/admin/gallery?pageSize=60",
      );
      setItems(res.items);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat galeri.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminFetch<ListResult<GalleryRow>>("/api/admin/gallery?pageSize=60")
      .then((res) => {
        if (active) setItems(res.items);
      })
      .catch((err) => {
        if (active) {
          setToast({
            type: "error",
            message: err instanceof Error ? err.message : "Gagal memuat galeri.",
          });
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_GALLERY);
    setModalOpen(true);
  }

  function openEdit(item: GalleryRow) {
    setEditingId(item.id);
    setForm({
      image_url: item.image_url,
      caption: item.caption,
      category: item.category,
      type: item.type || "general",
      slug: item.slug || "",
      is_active: item.is_active,
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      type: form.slug ? "package" : "general",
      slug: form.slug || null,
    };
    try {
      if (editingId) {
        await adminFetch(`/api/admin/gallery/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({ type: "success", message: "Item galeri diperbarui." });
      } else {
        await adminFetch("/api/admin/gallery", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast({ type: "success", message: "Foto ditambahkan ke galeri publik." });
      }
      setModalOpen(false);
      await loadGallery();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan foto galeri.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item: GalleryRow) {
    if (!window.confirm(`Hapus foto "${item.caption}" dari galeri publik?`)) return;
    try {
      await adminFetch(`/api/admin/gallery/${item.id}`, { method: "DELETE" });
      setToast({ type: "success", message: "Foto dihapus dari galeri." });
      await loadGallery();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menghapus item.",
      });
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Galeri Wisata & Pustaka Foto"
        subtitle="Unggah foto langsung dari komputer/HP Anda ke database Supabase tanpa perlu menyalin URL, lalu tampilkan ke halaman Galeri Publik."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover"
          >
            <AdminIcon name="add_photo_alternate" className="w-[18px] h-[18px]" />
            Tambah Foto Galeri
          </button>
        }
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      {loading ? (
        <p className="text-sm text-muted py-8 text-center">Memuat foto galeri...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-card bg-paper-2 border border-rule overflow-hidden flex flex-col"
            >
              <div className="aspect-[16/10] bg-paper-3 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image_url}
                  alt={item.caption}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-paper/90 text-ink border border-rule">
                  {item.category}
                </span>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-ink">{item.caption}</h3>
                  {item.slug ? (
                    <p className="text-xs text-accent mt-1">
                      Tautan paket: {item.slug}
                    </p>
                  ) : null}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-rule">
                  <span className="text-xs text-muted">
                    {item.is_active ? "Tampil di web" : "Disembunyikan"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="px-2.5 py-1 rounded bg-paper border border-rule text-xs font-semibold text-ink hover:border-accent"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="px-2.5 py-1 rounded border border-rule text-xs text-muted hover:text-error hover:border-error"
                    >
                      Hapus
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
        title={editingId ? "Edit Foto Galeri" : "Tambah Foto ke Galeri Publik"}
        subtitle="Upload foto langsung dari perangkat atau pilih aset Sumatera Explore."
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <MediaPickerField
            label="Foto Galeri"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            folder="gallery"
          />

          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Keterangan / Caption Foto
            </label>
            <input
              type="text"
              required
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Contoh: Sunset dari Bukit Holbung Samosir"
              className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Kategori
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              >
                <option value="Danau Toba">Danau Toba</option>
                <option value="Budaya">Budaya</option>
                <option value="Alam">Alam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Slug Paket Terkait (Opsional)
              </label>
              <input
                type="text"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="danau-toba-3d2n"
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink font-mono"
              />
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-ink-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            Tampilkan foto ini di halaman Galeri Publik
          </label>

          <div className="pt-3 border-t border-rule flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-card border border-rule text-sm text-ink-2"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-card bg-accent text-accent-ink text-sm font-bold hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Foto"}
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
