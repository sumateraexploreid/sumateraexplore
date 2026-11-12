"use client";

import React, { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-client";
import { AdminPageHeader, ToastBanner } from "@/components/admin/AdminUi";
import { MediaPickerField } from "@/components/admin/MediaPickerField";

interface BusinessData {
  brandName: string;
  legalName: string;
  legalForm: string;
  decreeNumber: string;
  decreeIssuer: string;
  decreeDate: string;
  ownerName: string;
  address: string;
  shortAddress: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  siteUrl: string;
  kbli: string[];
}

interface SocialItem {
  key: "instagram" | "tiktok" | "threads";
  label: string;
  handle: string;
  url: string;
  note: string;
}

interface FleetItem {
  slug: string;
  name: string;
  capacity: string;
  image: string;
  alt: string;
  note: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface LegalItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

export default function AdminBusinessPage() {
  const [tab, setTab] = useState<
    "identity" | "channels" | "fleet" | "faqs" | "legal" | "integrations"
  >("identity");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(
    null,
  );

  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [socialChannels, setSocialChannels] = useState<SocialItem[]>([]);
  const [fleet, setFleet] = useState<FleetItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [documentationGear, setDocumentationGear] = useState<string[]>([]);
  const [operatorNotes, setOperatorNotes] = useState<string[]>([]);
  const [legalDocuments, setLegalDocuments] = useState<LegalItem[]>([]);
  const [integrations, setIntegrations] = useState({
    waAutoGreeting: "",
    gaMeasurementId: "",
    metaPixelId: "",
    supabaseProjectRef: "",
    notifyEmail: "",
  });

  useEffect(() => {
    interface SettingsSnapshot {
      business?: BusinessData;
      channels?: { socialChannels?: SocialItem[] };
      fleet?: { options?: FleetItem[] };
      faqs?: { items?: FaqItem[] };
      operations?: {
        documentationGear?: string[];
        operatorNotes?: string[];
        legalDocuments?: LegalItem[];
      };
      integrations?: {
        waAutoGreeting: string;
        gaMeasurementId: string;
        metaPixelId: string;
        supabaseProjectRef: string;
        notifyEmail: string;
      };
    }
    adminFetch<SettingsSnapshot>("/api/admin/settings")
      .then((all) => {
        if (all.business) setBusiness(all.business);
        if (all.channels?.socialChannels) setSocialChannels(all.channels.socialChannels);
        if (all.fleet?.options) setFleet(all.fleet.options);
        if (all.faqs?.items) setFaqs(all.faqs.items);
        if (all.operations) {
          setDocumentationGear(all.operations.documentationGear || []);
          setOperatorNotes(all.operations.operatorNotes || []);
          setLegalDocuments(all.operations.legalDocuments || []);
        }
        if (all.integrations) setIntegrations(all.integrations);
      })
      .catch((err) =>
        setToast({
          type: "error",
          message: err instanceof Error ? err.message : "Gagal memuat konfigurasi.",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  async function saveSection(key: string, value: unknown, successMsg: string) {
    setSaving(true);
    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ key, value }),
      });
      setToast({ type: "success", message: successMsg });
    } catch (err) {
      setToast({
        type: "error",
        message: err instanceof Error ? err.message : "Gagal menyimpan pengaturan.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading || !business) {
    return <p className="text-sm text-muted py-8">Memuat konfigurasi website…</p>;
  }

  return (
    <div>
      <AdminPageHeader
        title="Bisnis, Legal AHU, Medsos & Integrasi Web"
        subtitle="Kelola seluruh profil PT SUJAI TOBA SUMATERA, nomor WhatsApp, kanal IG/TikTok/Threads, armada, dokumentasi iPhone/Drone, FAQ, bukti SK AHU, dan integrasi analitik."
      />

      <ToastBanner toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-rule pb-3">
        {(
          [
            ["identity", "Identitas PT & WhatsApp"],
            ["channels", "Instagram, TikTok & Threads"],
            ["fleet", "Armada & Dokumentasi 4K"],
            ["faqs", "FAQ Tamu"],
            ["legal", "Bukti SK Legal AHU"],
            ["integrations", "Integrasi & Tracking"],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={`px-3.5 py-2 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
              tab === k
                ? "bg-accent text-accent-ink"
                : "bg-paper-2 text-ink-2 hover:text-ink"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "identity" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void saveSection(
              "business",
              business,
              "Identitas PT & WhatsApp resmi berhasil diperbarui.",
            );
          }}
          className="max-w-3xl bg-paper-2 border border-rule rounded-card p-6 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nama Merek
              </label>
              <input
                type="text"
                value={business.brandName}
                onChange={(e) =>
                  setBusiness({ ...business, brandName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nama Badan Hukum (PT Perorangan)
              </label>
              <input
                type="text"
                value={business.legalName}
                onChange={(e) =>
                  setBusiness({ ...business, legalName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nomor SK AHU
              </label>
              <input
                type="text"
                value={business.decreeNumber}
                onChange={(e) =>
                  setBusiness({ ...business, decreeNumber: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Pemilik / Direktur
              </label>
              <input
                type="text"
                value={business.ownerName}
                onChange={(e) =>
                  setBusiness({ ...business, ownerName: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Nomor WhatsApp (Format Internasional tanpa +)
              </label>
              <input
                type="text"
                value={business.whatsappNumber}
                onChange={(e) =>
                  setBusiness({ ...business, whatsappNumber: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Tampilan Nomor WA di UI
              </label>
              <input
                type="text"
                value={business.whatsappDisplay}
                onChange={(e) =>
                  setBusiness({ ...business, whatsappDisplay: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Email Booking Resmi
              </label>
              <input
                type="email"
                value={business.email}
                onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Alamat Singkat
              </label>
              <input
                type="text"
                value={business.shortAddress}
                onChange={(e) =>
                  setBusiness({ ...business, shortAddress: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Alamat Operasional Lengkap
            </label>
            <textarea
              rows={2}
              value={business.address}
              onChange={(e) => setBusiness({ ...business, address: e.target.value })}
              className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan…" : "Simpan Identitas Bisnis"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "channels" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void saveSection(
              "channels",
              { socialChannels },
              "Kanal media sosial resmi berhasil disimpan.",
            );
          }}
          className="max-w-3xl space-y-4"
        >
          {socialChannels.map((ch, idx) => (
            <div
              key={ch.key}
              className="bg-paper-2 border border-rule rounded-card p-5 space-y-3"
            >
              <h3 className="font-display text-base text-accent">{ch.label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Handle
                  </label>
                  <input
                    type="text"
                    value={ch.handle}
                    onChange={(e) => {
                      const next = [...socialChannels];
                      next[idx] = { ...ch, handle: e.target.value };
                      setSocialChannels(next);
                    }}
                    className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-2 mb-1">
                    Tautan Profil
                  </label>
                  <input
                    type="text"
                    value={ch.url}
                    onChange={(e) => {
                      const next = [...socialChannels];
                      next[idx] = { ...ch, url: e.target.value };
                      setSocialChannels(next);
                    }}
                    className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Catatan Konten Kanal
                </label>
                <input
                  type="text"
                  value={ch.note}
                  onChange={(e) => {
                    const next = [...socialChannels];
                    next[idx] = { ...ch, note: e.target.value };
                    setSocialChannels(next);
                  }}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan…" : "Simpan Kanal Medsos"}
            </button>
          </div>
        </form>
      ) : null}

      {tab === "fleet" ? (
        <div className="max-w-4xl space-y-6">
          <div className="space-y-4">
            <h3 className="font-display text-lg text-ink">Armada Resmi (SUV & Van)</h3>
            {fleet.map((f, idx) => (
              <div
                key={f.slug}
                className="bg-paper-2 border border-rule rounded-card p-5 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1">
                      Nama Armada
                    </label>
                      <input
                        type="text"
                        value={f.name}
                        onChange={(e) => {
                          const next = [...fleet];
                          next[idx] = { ...f, name: e.target.value };
                          setFleet(next);
                        }}
                        className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-ink-2 mb-1">
                        Kapasitas
                      </label>
                      <input
                        type="text"
                        value={f.capacity}
                        onChange={(e) => {
                          const next = [...fleet];
                          next[idx] = { ...f, capacity: e.target.value };
                          setFleet(next);
                        }}
                        className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                      />
                    </div>
                  </div>
                  <MediaPickerField
                    label={`Foto Armada ${f.name}`}
                    value={f.image}
                    onChange={(url) => {
                      const next = [...fleet];
                      next[idx] = { ...f, image: url };
                      setFleet(next);
                    }}
                    folder="fleet"
                  />
                  <div>
                    <label className="block text-xs font-semibold text-ink-2 mb-1">
                      Catatan Kenyamanan Rute
                    </label>
                    <input
                      type="text"
                      value={f.note}
                      onChange={(e) => {
                        const next = [...fleet];
                        next[idx] = { ...f, note: e.target.value };
                        setFleet(next);
                      }}
                      className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void saveSection(
                      "fleet",
                      { options: fleet },
                      "Daftar armada berhasil diperbarui.",
                    )
                  }
                  className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
                >
                  Simpan Daftar Armada
                </button>
              </div>
            </div>

            <div className="bg-paper-2 border border-rule rounded-card p-5 space-y-4">
              <h3 className="font-display text-lg text-ink">
                Dokumentasi iPhone 4K, Opsional Drone & Ketentuan Operator Halal
              </h3>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Poin Dokumentasi & Bonus (1 per baris)
                </label>
                <textarea
                  rows={5}
                  value={documentationGear.join("\n")}
                  onChange={(e) =>
                    setDocumentationGear(
                      e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-xs text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Catatan Ketentuan Operator & Supir Muslim Halal (1 per baris)
                </label>
                <textarea
                  rows={6}
                  value={operatorNotes.join("\n")}
                  onChange={(e) =>
                    setOperatorNotes(
                      e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    )
                  }
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-xs text-ink"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void saveSection(
                      "operations",
                      { documentationGear, operatorNotes, legalDocuments },
                      "Ketentuan dokumentasi iPhone/Drone & SOP halal disimpan.",
                    )
                  }
                  className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm whitespace-nowrap hover:bg-accent-hover disabled:opacity-50"
                >
                  Simpan SOP Halal
                </button>
              </div>
          </div>
        </div>
      ) : null}

      {tab === "faqs" ? (
        <div className="max-w-3xl space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setFaqs([...faqs, { q: "Pertanyaan baru?", a: "" }])}
              className="px-3.5 py-2 rounded-md border border-accent text-xs font-semibold text-accent"
            >
              + Tambah Pertanyaan FAQ
            </button>
          </div>
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-paper-2 border border-rule rounded-card p-4 space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={faq.q}
                  onChange={(e) => {
                    const next = [...faqs];
                    next[idx] = { ...faq, q: e.target.value };
                    setFaqs(next);
                  }}
                  className="flex-1 px-3 py-1.5 rounded bg-paper border border-rule text-sm font-semibold text-ink"
                />
                <button
                  type="button"
                  onClick={() => setFaqs(faqs.filter((_, i) => i !== idx))}
                  className="text-xs text-error"
                >
                  Hapus
                </button>
              </div>
              <textarea
                rows={3}
                value={faq.a}
                onChange={(e) => {
                  const next = [...faqs];
                  next[idx] = { ...faq, a: e.target.value };
                  setFaqs(next);
                }}
                className="w-full px-3 py-2 rounded bg-paper border border-rule text-xs text-ink"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void saveSection(
                  "faqs",
                  { items: faqs },
                  "FAQ Tamu berhasil disimpan ke Beranda & Pusat Bantuan.",
                )
              }
              className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              Simpan FAQ Tamu
            </button>
          </div>
        </div>
      ) : null}

      {tab === "legal" ? (
        <div className="max-w-3xl space-y-4">
          {legalDocuments.map((doc, idx) => (
            <div
              key={doc.id}
              className="bg-paper-2 border border-rule rounded-card p-5 space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Judul Dokumen Legal
                </label>
                <input
                  type="text"
                  value={doc.title}
                  onChange={(e) => {
                    const next = [...legalDocuments];
                    next[idx] = { ...doc, title: e.target.value };
                    setLegalDocuments(next);
                  }}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink-2 mb-1">
                  Nomor / Keterangan
                </label>
                <input
                  type="text"
                  value={doc.subtitle}
                  onChange={(e) => {
                    const next = [...legalDocuments];
                    next[idx] = { ...doc, subtitle: e.target.value };
                    setLegalDocuments(next);
                  }}
                  className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
                />
              </div>
              <MediaPickerField
                label={`Scan / Gambar ${doc.title}`}
                value={doc.image}
                onChange={(url) => {
                  const next = [...legalDocuments];
                  next[idx] = { ...doc, image: url };
                  setLegalDocuments(next);
                }}
                folder="legal"
              />
            </div>
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void saveSection(
                  "operations",
                  { documentationGear, operatorNotes, legalDocuments },
                  "Dokumen bukti legalitas PT berhasil diperbarui.",
                )
              }
              className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              Simpan Dokumen Legalitas
            </button>
          </div>
        </div>
      ) : null}

      {tab === "integrations" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void saveSection(
              "integrations",
              integrations,
              "Konfigurasi integrasi WhatsApp & Analitik disimpan.",
            );
          }}
          className="max-w-3xl bg-paper-2 border border-rule rounded-card p-6 space-y-4"
        >
          <div className="p-4 rounded-md bg-paper border border-rule text-xs space-y-1">
            <p className="font-bold text-ink">Status Koneksi Infrastruktur Web</p>
            <p className="text-ink-2">
              Supabase PostgreSQL Project:{" "}
              <span className="font-mono text-accent">
                {integrations.supabaseProjectRef || "anqebirxzaydpnmqllnr"}
              </span>{" "}
              • Sinkronisasi: Real-time Cache Revalidation + Public Booking Lead Intake (
              <span className="font-mono">/api/bookings</span>)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-2 mb-1">
              Template Salam Otomatis WhatsApp Booking
            </label>
            <textarea
              rows={2}
              value={integrations.waAutoGreeting}
              onChange={(e) =>
                setIntegrations({ ...integrations, waAutoGreeting: e.target.value })
              }
              className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Google Analytics 4 ID (Opsional)
              </label>
              <input
                type="text"
                value={integrations.gaMeasurementId}
                onChange={(e) =>
                  setIntegrations({ ...integrations, gaMeasurementId: e.target.value })
                }
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Meta / TikTok Pixel ID (Opsional)
              </label>
              <input
                type="text"
                value={integrations.metaPixelId}
                onChange={(e) =>
                  setIntegrations({ ...integrations, metaPixelId: e.target.value })
                }
                placeholder="123456789012345"
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ink-2 mb-1">
                Email Notifikasi Internal
              </label>
              <input
                type="email"
                value={integrations.notifyEmail}
                onChange={(e) =>
                  setIntegrations({ ...integrations, notifyEmail: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-paper border border-rule text-sm text-ink"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-md bg-accent text-accent-ink font-bold text-sm hover:bg-accent-hover disabled:opacity-50"
            >
              {saving ? "Menyimpan…" : "Simpan Pengaturan Integrasi"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
