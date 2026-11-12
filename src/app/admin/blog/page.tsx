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

interface BlogSection {
  heading: string;
  paragraphs: string[];
}

interface BlogRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  read_time: string;
  related_package_slug: string;
  tags: string[];
  sections: BlogSection[];
  status: string;
  created_at: string;
}

const EMPTY_BLOG = {
  slug: "",
  title: "",
  excerpt: "",
  category: "Rute",
  image_url: "/images/sumut/sumatra_panorama.webp",
  read_time: "5 menit baca",
  related_package_slug: "danau-toba-3d2n",
  tagsText: "Danau Toba, Rute Halal, Medan",
  status: "published",
  sections: [{ heading: "1. Pendahuluan Rute", paragraphs: [""] }] as BlogSection[],
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_BLOG);
  const [saving, setSaving] = useState(false);

  const loadBlogs = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ pageSize: "50" });
      if (q.trim()) qs.set("q", q.trim());
      const res = await adminFetch<ListResult<BlogRow>>(
        `/api/admin/blogs?${qs.toString()}`,
      );
      setPosts(res.items);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat artikel.",
      });
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    let active = true;
    const qs = new URLSearchParams({ pageSize: "50" });
    if (q.trim()) qs.set("q", q.trim());
    adminFetch<ListResult<BlogRow>>(`/api/admin/blogs?${qs.toString()}`)
      .then((res) => {
        if (active) setPosts(res.items);
      })
      .catch((err) => {
        if (active) {
          setToast({
            type: "error",
            message: err instanceof Error ? err.message : "Gagal memuat artikel.",
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

  function openCreate() {
    setEditingId(null);
    setForm(EMPTY_BLOG);
    setModalOpen(true);
  }

  function openEdit(post: BlogRow) {
    setEditingId(post.id);
    setForm({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      category: post.category,
      image_url: post.image_url,
      read_time: post.read_time,
      related_package_slug: post.related_package_slug,
      tagsText: (post.tags || []).join(", "),
      status: post.status,
      sections: post.sections?.length
        ? post.sections
        : [{ heading: "1. Isi Artikel", paragraphs: [""] }],
    });
    setModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      category: form.category,
      image_url: form.image_url,
      read_time: form.read_time,
      related_package_slug: form.related_package_slug,
      tags: form.tagsText
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      sections: form.sections,
      status: form.status,
    };

    try {
      if (editingId) {
        await adminFetch(`/api/admin/blogs/${editingId}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });
        setToast({ type: "success", message: "Artikel diperbarui & dipublikasikan." });
      } else {
        await adminFetch("/api/admin/blogs", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setToast({ type: "success", message: "Artikel baru berhasil diterbitkan." });
      }
      setModalOpen(false);
      await loadBlogs();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan artikel.",
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post: BlogRow) {
    if (!window.confirm(`Hapus artikel "${post.title}"?`)) return;
    try {
      await adminFetch(`/api/admin/blogs/${post.id}`, { method: "DELETE" });
      setToast({ type: "success", message: "Artikel dihapus." });
      await loadBlogs();
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menghapus artikel.",
      });
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Jurnal Rute, Ferry & Kuliner Halal"
        subtitle="Kelola artikel panduan wisata Sumatera Utara yang tertaut langsung ke katalog paket wisata."
        actions={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-card bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover"
          >
            <AdminIcon name="post_add" className="w-[18px] h-[18px]" />
            Tulis Artikel Baru
          </button>
        }
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      <div className="mb-5">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari judul atau slug artikel..."
          className="w-full sm:w-80 px-3.5 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent"
        />
      </div>

      {loading ? (
        <p className="text-sm text-muted py-8 text-center">Memuat jurnal…</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-4 rounded-card bg-paper-2 border border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-20 h-14 rounded-md overflow-hidden bg-paper-3 shrink-0 border border-rule">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusPill status={post.status} />
                    <span className="text-xs text-accent font-semibold">
                      {post.category}
                    </span>
                    <span className="text-xs text-muted">{post.read_time}</span>
                  </div>
                  <h3 className="font-display text-base text-ink">{post.title}</h3>
                  <p className="text-xs text-muted line-clamp-1 mt-0.5">{post.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="px-3 py-1.5 rounded-md bg-accent text-accent-ink text-xs font-bold hover:bg-accent-hover"
                >
                  Edit Artikel
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post)}
                  className="px-3 py-1.5 rounded-md border border-rule text-xs text-muted hover:text-error hover:border-error"
                >
                  Hapus
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <ModalDialog
        open={modalOpen}
        title={editingId ? "Edit Artikel Jurnal" : "Tulis Artikel Jurnal Baru"}
        subtitle="Artikel otomatis tampil di halaman /tour/blog lengkap dengan tautan paket terkait."
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-4xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Judul Artikel
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Slug URL
              </label>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="panduan-kuliner-halal-toba"
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-2 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                >
                  <option value="Rute">Rute</option>
                  <option value="Destinasi">Destinasi</option>
                  <option value="Kuliner">Kuliner</option>
                  <option value="Tips Liburan">Tips Liburan</option>
                  <option value="Panduan Tamu">Panduan Tamu</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full px-2 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
                >
                  <option value="published">Terbit</option>
                  <option value="draft">Draf</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Slug Paket Terkait
              </label>
              <input
                type="text"
                value={form.related_package_slug}
                onChange={(e) =>
                  setForm({ ...form, related_package_slug: e.target.value })
                }
                className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Estimasi Waktu Baca & Tag (pisah koma)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={form.read_time}
                  onChange={(e) => setForm({ ...form, read_time: e.target.value })}
                  className="px-2.5 py-2 rounded-card bg-paper-2 border border-rule text-xs text-ink"
                />
                <input
                  type="text"
                  value={form.tagsText}
                  onChange={(e) => setForm({ ...form, tagsText: e.target.value })}
                  className="px-2.5 py-2 rounded-card bg-paper-2 border border-rule text-xs text-ink"
                />
              </div>
            </div>
          </div>

          <MediaPickerField
            label="Foto Sampul Artikel"
            value={form.image_url}
            onChange={(url) => setForm({ ...form, image_url: url })}
            folder="blog"
          />

          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Ringkasan / Excerpt
            </label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-3 py-2 rounded-card bg-paper-2 border border-rule text-sm text-ink"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-muted">
                Bagian Isi Artikel
              </p>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    sections: [
                      ...form.sections,
                      { heading: `${form.sections.length + 1}. Subjudul Baru`, paragraphs: [""] },
                    ],
                  })
                }
                className="px-3 py-1 rounded-card border border-accent text-xs font-semibold text-accent"
              >
                + Tambah Bagian
              </button>
            </div>

            {form.sections.map((sec, sIdx) => (
              <div
                key={sIdx}
                className="p-3.5 rounded-card bg-paper-2 border border-rule space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={sec.heading}
                    onChange={(e) => {
                      const next = [...form.sections];
                      next[sIdx] = { ...sec, heading: e.target.value };
                      setForm({ ...form, sections: next });
                    }}
                    className="flex-1 px-3 py-1.5 rounded bg-paper border border-rule text-sm font-semibold text-ink"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        sections: form.sections.filter((_, i) => i !== sIdx),
                      })
                    }
                    className="text-xs text-error"
                  >
                    Hapus
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={sec.paragraphs.join("\n\n")}
                  onChange={(e) => {
                    const next = [...form.sections];
                    next[sIdx] = {
                      ...sec,
                      paragraphs: e.target.value.split(/\n{2,}/).map((p) => p.trim()),
                    };
                    setForm({ ...form, sections: next });
                  }}
                  placeholder="Pisahkan paragraf dengan Enter 2x"
                  className="w-full px-3 py-2 rounded bg-paper border border-rule text-xs text-ink"
                />
              </div>
            ))}
          </div>

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
              {saving ? "Menyimpan..." : "Simpan Artikel"}
            </button>
          </div>
        </form>
      </ModalDialog>
    </div>
  );
}
