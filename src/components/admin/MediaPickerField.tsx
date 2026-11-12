"use client";

import React, { useEffect, useRef, useState } from "react";
import { adminFetch } from "@/lib/admin-client";
import { ModalDialog } from "@/components/admin/AdminUi";
import { AdminIcon } from "@/components/admin/AdminIcon";

interface MediaAssetItem {
  id: string;
  url: string;
  filename: string;
  folder: string;
  source: "uploaded" | "static";
  altText?: string;
}

export function MediaPickerField({
  label,
  value,
  onChange,
  folder = "gallery",
}: {
  label: string;
  value: string;
  onChange: (nextUrl: string) => void;
  folder?: "packages" | "blog" | "gallery" | "fleet" | "legal";
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);
  const [tab, setTab] = useState<"all" | "uploaded" | "static">("all");

  useEffect(() => {
    if (!libraryOpen) return;
    let active = true;
    adminFetch<{
      uploaded: MediaAssetItem[];
      staticAssets: MediaAssetItem[];
    }>("/api/admin/media")
      .then((data) => {
        if (active) setAssets([...data.uploaded, ...data.staticAssets]);
      })
      .catch((err) => {
        if (active) {
          setUploadError(
            err instanceof Error ? err.message : "Gagal memuat galeri aset.",
          );
        }
      })
      .finally(() => {
        if (active) setLoadingLib(false);
      });
    return () => {
      active = false;
    };
  }, [libraryOpen]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      fd.append("altText", file.name);
      const uploaded = await adminFetch<MediaAssetItem>("/api/admin/media", {
        method: "POST",
        body: fd,
      });
      onChange(uploaded.url);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Gagal mengunggah gambar.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  const visibleAssets = assets.filter((a) =>
    tab === "all" ? true : a.source === tab,
  );

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">
        {label}
      </label>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-card bg-paper-2 border border-rule">
        <div className="w-24 h-16 rounded-card overflow-hidden bg-paper-3 border border-rule shrink-0 flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <AdminIcon name="image" className="w-5 h-5 text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-ink-2 truncate mb-2">
            {value ? `Terpilih: ${value}` : "Belum ada foto dipilih"}
          </p>
          <div className="flex flex-wrap gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/webp,image/jpeg,image/png,image/avif"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-accent text-accent-ink text-xs font-bold hover:bg-accent-hover disabled:opacity-50 transition-colors"
            >
              <AdminIcon name="upload" className="w-4 h-4" />
              {uploading ? "Mengunggah..." : "Upload Foto"}
            </button>

            <button
              type="button"
              onClick={() => {
                setLoadingLib(true);
                setLibraryOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-card bg-paper border border-rule text-ink text-xs font-semibold hover:border-accent hover:text-accent transition-colors"
            >
              <AdminIcon name="photo_library" className="w-4 h-4" />
              Pilih dari Koleksi Web
            </button>
          </div>
          {uploadError ? (
            <p className="text-xs text-error mt-1.5">{uploadError}</p>
          ) : null}
        </div>
      </div>

      <ModalDialog
        open={libraryOpen}
        title="Pilih Foto dari Koleksi Media"
        subtitle="Pilih aset Sumatera Explore yang sudah tersedia atau unggah gambar baru dari perangkat Anda."
        onClose={() => setLibraryOpen(false)}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-paper-2 p-1 rounded-card border border-rule">
            {(
              [
                ["all", "Semua Foto"],
                ["uploaded", "Hasil Upload"],
                ["static", "Aset Bawaan Web"],
              ] as const
            ).map(([key, text]) => (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors ${
                  tab === key
                    ? "bg-accent text-accent-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {text}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-card bg-accent text-accent-ink text-xs font-bold hover:bg-accent-hover transition-colors"
          >
            <AdminIcon name="add_photo_alternate" className="w-4 h-4" />
            {uploading ? "Mengunggah..." : "Upload Foto Baru"}
          </button>
        </div>

        {loadingLib ? (
          <p className="text-sm text-muted py-10 text-center">Memuat koleksi gambar...</p>
        ) : visibleAssets.length === 0 ? (
          <p className="text-sm text-muted py-10 text-center">
            Belum ada foto pada kategori ini. Klik Upload Foto Baru untuk menambahkan.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {visibleAssets.map((item) => {
              const selected = value === item.url;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onChange(item.url);
                    setLibraryOpen(false);
                  }}
                  className={`group text-left rounded-card border overflow-hidden transition-all ${
                    selected
                      ? "border-accent ring-2 ring-accent/40 bg-paper-3"
                      : "border-rule bg-paper-2 hover:border-accent"
                  }`}
                >
                  <div className="aspect-[4/3] bg-paper-3 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.filename}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium text-ink truncate">
                      {item.filename}
                    </p>
                    <p className="text-[11px] text-muted uppercase">{item.folder}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </ModalDialog>
    </div>
  );
}
