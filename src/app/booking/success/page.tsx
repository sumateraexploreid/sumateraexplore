"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { AdminIcon } from "@/components/admin/AdminIcon";
import { getLocale } from "@/i18n";
import { BUSINESS_IDENTITY } from "@/data/business";

interface SuccessPageData {
  bookingCode?: string;
  packageName?: string;
  estimatedTotal?: string;
  currency?: string;
  guestName?: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  brandName: string;
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const pkg = searchParams.get("pkg");
  const total = searchParams.get("total");
  const curr = searchParams.get("curr");
  const name = searchParams.get("name");

  const [bundle, setBundle] = useState<{ business: { whatsappNumber?: string; whatsappDisplay?: string; brandName?: string; email?: string; shortAddress?: string }; socialChannels: unknown[] } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load live settings from API (avoids importing server-only cms.ts on the client)
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json?.ok && json?.data) {
          setBundle({
            business: json.data.business ?? BUSINESS_IDENTITY,
            socialChannels: json.data.channels?.socialChannels ?? [],
          });
        }
      })
      .catch(() => {
        setBundle({
          business: BUSINESS_IDENTITY,
          socialChannels: [],
        });
      });
  }, []);

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  };

  const whatsappLink = (msg: string) =>
    `https://wa.me/${bundle?.business?.whatsappNumber || "6289502472594"}?text=${encodeURIComponent(msg)}`;

  if (!code) {
    return (
      <main className="se-page min-h-dvh flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-paper-2 border border-rule rounded-card p-8 text-center">
          <AdminIcon name="error" className="w-16 h-16 text-error mx-auto mb-4" />
          <h1 className="font-display text-xl text-ink mb-2">Kode Booking Tidak Ditemukan</h1>
          <p className="text-sm text-ink-2 mb-6">
            Halaman ini diakses tanpa kode booking yang valid. Silakan kembali ke beranda atau hubungi kami via WhatsApp.
          </p>
          <Link href="/" className="se-btn se-btn--primary w-full">
            Kembali ke Beranda
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="se-page min-h-dvh">
      <section className="se-subhero" aria-labelledby="success-title">
        <div className="se-subhero-inner">
          <div>
            <nav className="se-breadcrumb" aria-label="Navigasi halaman">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Konfirmasi Inquiry</span>
            </nav>
            <h1 id="success-title">Inquiry Anda Telah Tercatat</h1>
            <p className="mt-3 sm:mt-4 text-sm text-muted">
              Terima kasih {name ? `, ${name}` : ""}! Tim kami akan menghubungi Anda via WhatsApp segera.
            </p>
          </div>
          <div className="bg-paper-2/80 border border-rule rounded-card p-4 sm:p-6 min-w-[280px]">
            <p className="font-mono text-lg font-bold text-accent text-center mb-2">{code}</p>
            <p className="text-xs text-muted text-center">Kode Booking / Referensi</p>
          </div>
        </div>
      </section>

      <section className="se-section">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-paper-2 border border-rule rounded-card p-6">
              <h2 className="font-display text-lg text-ink mb-4 flex items-center gap-2">
                <AdminIcon name="check_circle" className="w-5 h-5 text-success" />
                Apa yang Terjadi Selanjutnya?
              </h2>
              <ol className="space-y-3 text-sm text-ink-2">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success/15 text-success text-xs font-bold flex items-center justify-center">1</span>
                  <span>Admin kami menerima notifikasi inquiry baru Anda (<strong>{pkg || "Paket Wisata"}</strong>).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success/15 text-success text-xs font-bold flex items-center justify-center">2</span>
                  <span>Tim akan membalas via WhatsApp dalam <strong>15-30 menit</strong> (jam kerja) untuk konfirmasi jadwal, ketersediaan, dan rincian DP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success/15 text-success text-xs font-bold flex items-center justify-center">3</span>
                  <span>Setelah sepakat, kami kirim <strong>Kwitansi Resmi</strong> (gambar PNG/PDF) ke WhatsApp Anda beserta nomor rekening/QRIS untuk DP.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-success/15 text-success text-xs font-bold flex items-center justify-center">4</span>
                  <span>Trip Anda terjadwal! Supir Muslim + dokumentasi iPhone 4K siap menjemput di Bandara Kualanamu (KNO).</span>
                </li>
              </ol>
            </div>

            <div className="bg-paper-2 border border-rule rounded-card p-6">
              <h2 className="font-display text-lg text-ink mb-4 flex items-center gap-2">
                <AdminIcon name="info" className="w-5 h-5 text-accent" />
                Detail Inquiry Anda
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <dt className="text-muted">Kode Booking</dt>
                <dd className="font-mono font-bold text-accent">{code}</dd>
                <dt className="text-muted">Paket</dt>
                <dd className="text-ink">{pkg || "Belum dipilih"}</dd>
                <dt className="text-muted">Estimasi Total</dt>
                <dd className="font-bold text-ink num">
                  {total ? `${curr || "MYR"} ${Number(total).toLocaleString("en-US")}` : "Menunggu konfirmasi admin"}
                </dd>
                <dt className="text-muted">Nama Pemesan</dt>
                <dd className="text-ink">{name || "Tamu Website"}</dd>
                <dt className="text-muted">Status</dt>
                <dd className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-accent/15 text-accent border border-accent/30">
                  Lead Baru (Menunggu Respon Admin)
                </dd>
              </dl>
            </div>

            <div className="bg-paper-2 border border-rule rounded-card p-6">
              <h2 className="font-display text-lg text-ink mb-4 flex items-center gap-2">
                <AdminIcon name="content_copy" className="w-5 h-5 text-accent" />
                Salin & Bagikan ke Keluarga
              </h2>
              <p className="text-sm text-ink-2 mb-4">
                Tempel kode ini ke grup keluarga/WA untuk referensi cepat:
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-paper border border-rule text-sm font-semibold text-ink hover:border-accent transition-colors"
                >
                  <AdminIcon name={copied ? "check" : "content_copy"} className="w-4 h-4" />
                  {copied ? "Tersalin!" : "Salin Kode Booking"}
                </button>
                <a
                  href={whatsappLink(
                    `Halo Sumatera Explore, saya ({name || "Tamu"}) ingin lanjutkan booking ${code} untuk ${pkg || "paket wisata"}. Estimasi: ${total ? `${curr || "MYR"} ${Number(total).toLocaleString("en-US")}` : "konfirmasi admin"}. Mohon info DP & jadwal.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md bg-wa text-wa-ink font-semibold text-sm whitespace-nowrap hover:bg-wa-hover transition-colors"
                >
                  <AdminIcon name="whatsapp" className="w-4 h-4" />
                  Lanjut Chat WhatsApp
                </a>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-paper-2 border border-rule rounded-card p-6 space-y-4 lg:sticky lg:top-24">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/10 border border-rule flex items-center justify-center">
                  <Image
                    src="/images/logo/logo-badge.png"
                    alt={bundle?.business?.brandName || "Sumatera Explore"}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <p className="font-display text-lg text-ink">{bundle?.business?.brandName || "Sumatera Explore"}</p>
                <p className="text-xs text-muted mt-1">PT SUJAI TOBA SUMATERA</p>
              </div>

              <div className="pt-4 border-t border-rule space-y-3">
                <a
                  href={whatsappLink("Halo Sumatera Explore, saya ingin konfirmasi jadwal trip saya.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="se-btn se-btn--wa w-full"
                >
                  <AdminIcon name="whatsapp" className="w-4 h-4 shrink-0" />
                  Hubungi Admin via WhatsApp
                </a>
                <Link href="/tour/packages" className="se-btn se-btn--quiet w-full">
                  Lihat Paket Lainnya
                </Link>
              </div>

              <div className="pt-4 border-t border-rule">
                <p className="text-xs text-muted text-center mb-2">Kontak Resmi</p>
                <div className="space-y-1.5 text-sm text-ink-2 text-center">
                  <p className="font-semibold">{bundle?.business?.whatsappDisplay || "+62 895 0247 2594"}</p>
                  <p>{bundle?.business?.email || "booking@sumateraexplore.my.id"}</p>
                  <p>{bundle?.business?.shortAddress || "Jl. Trimurti 109, Berastagi, Karo, Sumatera Utara"}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-rule">
                <p className="text-xs text-muted text-center mb-2">Ikuti Kami</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {bundle?.socialChannels?.map((ch: any) => (
                    <a
                      key={ch.key}
                      href={ch.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="se-btn se-btn--quiet px-3 py-1.5 text-xs whitespace-nowrap"
                    >
                      <AdminIcon name={ch.key} className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span>{ch.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}