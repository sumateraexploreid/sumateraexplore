"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { adminFetch } from "@/lib/admin-client";
import { AdminPageHeader, ModalDialog, ToastBanner } from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { AdminErrorBoundary } from "@/components/admin/ErrorBoundary";

interface MediaItem {
  id: string;
  dbId?: number;
  url: string;
  filename: string;
  folder: string;
  source: "db" | "static";
  mimeType?: string;
  byteSize?: number;
  altText?: string;
  created_at?: string;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
    try {
      const res = await adminFetch<{ items: MediaItem[] }>("/api/admin/media");
      setItems(res.items || []);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal memuat daftar media.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;
    let failMsg = "";

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          failMsg = `File "${file.name}" melebihi batas 5 MB.`;
          continue;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("altText", file.name.replace(/\.[^/.]+$/, ""));
        formData.append("folder", "uploads");

        const res = await fetch("/api/admin/media", {
          method: "POST",
          credentials: "same-origin",
          body: formData,
        });

        const json = await res.json();
        if (res.ok && json.ok) {
          successCount++;
        } else {
          failMsg = json.error || "Gagal mengunggah beberapa file.";
        }
      }

      if (successCount > 0) {
        setToast({
          type: "success",
          message: `${successCount} foto berhasil diunggah ke pustaka media.`,
        });
        await loadMedia();
      } else if (failMsg) {
        setToast({ type: "error", message: failMsg });
      }
    } catch {
      setToast({ type: "error", message: "Terjadi kesalahan saat mengunggah foto." });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(item: MediaItem) {
    if (!item.dbId) return;
    if (!confirm(`Hapus permanen foto "${item.filename}" dari database?`)) return;

    setDeletingId(item.dbId);
    try {
      await adminFetch(`/api/admin/media?id=${item.dbId}`, {
        method: "DELETE",
      });
      setToast({ type: "success", message: `Foto "${item.filename}" berhasil dihapus.` });
      setItems((prev) => prev.filter((x) => x.id !== item.id));
      if (previewItem?.id === item.id) setPreviewItem(null);
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menghapus media.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setToast({ type: "success", message: "URL foto disalin ke clipboard!" });
    } catch {
      setToast({ type: "error", message: "Gagal menyalin URL." });
    }
  };

  const folders = Array.from(new Set(items.map((i) => i.folder))).filter(Boolean);

  const filteredItems = items.filter((item) => {
    if (filterFolder !== "all" && item.folder !== filterFolder) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.filename.toLowerCase().includes(q) ||
        (item.altText && item.altText.toLowerCase().includes(q)) ||
        item.folder.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <AdminErrorBoundary>
      <div>
        <AdminPageHeader
          title="Pustaka Media & Galeri Foto"
          subtitle="Kelola seluruh aset gambar destinasi, foto armada, bukti legalitas AHU, logo resmi, dan unggahan foto baru untuk paket wisata."
          actions={
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                <AdminIcon name="upload" className="w-[18px] h-[18px]" />
                {uploading ? "Mengunggah…" : "Upload Foto Baru"}
              </button>
            </div>
          }
        />

        <ToastBanner toast={toast} onClose={() => setToast(null)} />

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 bg-paper-2 p-3 rounded-card border border-rule">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterFolder("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filterFolder === "all"
                  ? "bg-forest text-forest-ink shadow-xs"
                  : "bg-paper text-ink hover:bg-paper-3"
              }`}
            >
              Semua ({items.length})
            </button>
            {folders.map((f) => {
              const count = items.filter((i) => i.folder === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilterFolder(f)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors capitalize ${
                    filterFolder === f
                      ? "bg-forest text-forest-ink shadow-xs"
                      : "bg-paper text-ink hover:bg-paper-3"
                  }`}
                >
                  {f === "sumut" ? "Destinasi Sumut" : f} ({count})
                </button>
              );
            })}
          </div>

          <div className="w-full sm:w-64">
            <input
              type="search"
              placeholder="Cari nama foto / folder…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-md bg-paper border border-rule text-xs text-ink placeholder:text-muted focus:outline-none focus:border-accent"
            />
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <p className="text-sm text-muted py-12 text-center">Memuat pustaka foto…</p>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center bg-paper-2 border border-rule rounded-card">
            <AdminIcon name="image" className="w-12 h-12 text-muted mx-auto mb-3" />
            <p className="text-sm font-semibold text-ink">Tidak ada foto yang cocok.</p>
            <p className="text-xs text-muted mt-1">Coba ganti filter atau unggah foto baru dari tombol di atas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group relative bg-paper-2 border border-rule rounded-card overflow-hidden flex flex-col justify-between hover:border-accent transition-colors"
              >
                <div
                  className="aspect-square w-full bg-paper relative cursor-pointer overflow-hidden"
                  onClick={() => setPreviewItem(item)}
                >
                  <Image
                    src={item.url}
                    alt={item.altText || item.filename}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    unoptimized={item.url.startsWith("/api/media")}
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-ink/75 text-white backdrop-blur-xs">
                    {item.folder}
                  </span>
                </div>

                <div className="p-2 border-t border-rule bg-paper-2">
                  <p className="text-xs font-semibold text-ink truncate" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-muted truncate mt-0.5 font-mono">
                    {item.byteSize ? `${Math.round(item.byteSize / 1024)} KB` : item.source}
                  </p>

                  <div className="mt-2 flex items-center justify-between gap-1 pt-1.5 border-t border-rule/50">
                    <button
                      type="button"
                      onClick={() => copyUrl(item.url)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-ink-2 hover:text-accent transition-colors"
                      title="Salin URL"
                    >
                      <AdminIcon name="content_copy" className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreviewItem(item)}
                      className="text-[11px] font-semibold text-muted hover:text-ink transition-colors"
                      title="Lihat Penuh"
                    >
                      <AdminIcon name="visibility" className="w-3.5 h-3.5" />
                    </button>

                    {item.source === "db" && item.dbId ? (
                      <button
                        type="button"
                        disabled={deletingId === item.dbId}
                        onClick={() => handleDelete(item)}
                        className="text-[11px] text-error hover:text-error/80 transition-colors disabled:opacity-50"
                        title="Hapus Foto"
                      >
                        <AdminIcon name="delete" className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Preview Modal */}
        {previewItem ? (
          <ModalDialog
            open={Boolean(previewItem)}
            title={`Detail Foto: ${previewItem.filename}`}
            onClose={() => setPreviewItem(null)}
          >
            <div className="space-y-4">
              <div className="relative aspect-video w-full rounded-md overflow-hidden bg-paper border border-rule">
                <Image
                  src={previewItem.url}
                  alt={previewItem.altText || previewItem.filename}
                  fill
                  className="object-contain"
                  unoptimized={previewItem.url.startsWith("/api/media")}
                />
              </div>

              <div className="p-3 bg-paper rounded-md border border-rule space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Nama File:</span>
                  <span className="font-semibold text-ink font-mono">{previewItem.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Folder / Kategori:</span>
                  <span className="font-semibold text-ink capitalize">{previewItem.folder}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Sumber:</span>
                  <span className="font-semibold text-ink">
                    {previewItem.source === "db" ? "Database Upload" : "Static File (public/images)"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-rule">
                  <span className="text-muted">URL Aset:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-[11px] bg-paper-2 px-2 py-0.5 rounded border border-rule text-accent">
                      {previewItem.url}
                    </code>
                    <button
                      type="button"
                      onClick={() => copyUrl(previewItem.url)}
                      className="px-2 py-1 rounded bg-accent text-accent-ink font-bold text-[11px] hover:bg-accent-hover"
                    >
                      Salin URL
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                {previewItem.source === "db" && previewItem.dbId ? (
                  <button
                    type="button"
                    onClick={() => handleDelete(previewItem)}
                    className="px-4 py-2 rounded-md bg-error/15 text-error border border-error/40 font-semibold text-xs hover:bg-error/25"
                  >
                    Hapus Foto Ini
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 rounded-md border border-rule text-xs font-semibold text-ink hover:bg-paper-2"
                >
                  Tutup
                </button>
              </div>
            </div>
          </ModalDialog>
        ) : null}
      </div>
    </AdminErrorBoundary>
  );
}
