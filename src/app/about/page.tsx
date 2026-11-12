import React from "react";
import Link from "next/link";
import Icon from "@/components/Icon";
import LegalDocumentProof from "@/components/LegalDocumentProof";
import { getLiveSiteBundle } from "@/lib/cms";

export const metadata = {
  title: "Tentang & Legalitas Resmi - Sumatera Explore",
  description:
    "Profil resmi Sumatera Explore di bawah badan hukum Perseroan Perorangan SUJAI TOBA SUMATERA (AHU-A122244.AH.01.30.Tahun 2026) di Berastagi, Sumatera Utara.",
};

export default async function AboutPage() {
  const bundle = await getLiveSiteBundle();
  const BUSINESS_IDENTITY = bundle.business;
  const FLEET_OPTIONS = bundle.fleet;
  const LEGAL_DOCUMENTS = bundle.legalDocuments;
  const SOCIAL_CHANNELS = bundle.socialChannels;
  const DOCUMENTATION_GEAR = bundle.documentationGear;
  const OPERATOR_NOTES = bundle.operatorNotes;
  return (
    <main className="se-page min-h-dvh">
      <section className="se-subhero" aria-labelledby="about-title">
        <div className="se-subhero-inner">
          <div>
            <nav aria-label="Breadcrumb" className="se-breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Tentang &amp; legalitas</span>
            </nav>
            <h1 id="about-title">Operator resmi di Berastagi &amp; Danau Toba</h1>
          </div>
          <p>
            Beroperasi resmi di bawah {BUSINESS_IDENTITY.legalName} dengan tim dan armada sendiri.
          </p>
        </div>
      </section>

      <section className="se-section" aria-labelledby="legalitas-title">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-card bg-paper-2 border border-rule">
              <img
                src="/images/sumut/sumatra_panorama.webp"
                alt="Panorama dataran tinggi Karo menuju Danau Toba Sumatera Utara"
                className="aspect-[4/5] w-full object-cover"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 id="legalitas-title" className="font-display text-3xl leading-tight text-ink sm:text-4xl">
                Legalitas resmi {BUSINESS_IDENTITY.legalName}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-2">
                {BUSINESS_IDENTITY.brandName} dikelola langsung oleh {BUSINESS_IDENTITY.ownerName} di Berastagi, Kabupaten Karo, tanpa perantara pihak ketiga. Kejelasan badan hukum dan kantor operasional memastikan setiap tamu Indonesia, Malaysia, dan Singapura bertransaksi secara aman.
              </p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2 border-y border-rule py-6">
              <div>
                <dt className="text-xs text-muted">Badan Hukum</dt>
                <dd className="mt-1 font-semibold text-ink">
                  {BUSINESS_IDENTITY.legalForm} {BUSINESS_IDENTITY.legalName}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Nomor Pengesahan AHU</dt>
                <dd className="mt-1 font-semibold text-accent num">
                  {BUSINESS_IDENTITY.decreeNumber}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Instansi &amp; Tanggal</dt>
                <dd className="mt-1 text-sm text-ink-2">
                  {BUSINESS_IDENTITY.decreeIssuer} ({BUSINESS_IDENTITY.decreeDate})
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Kantor Operasional</dt>
                <dd className="mt-1 text-sm text-ink-2">
                  {BUSINESS_IDENTITY.address}
                </dd>
              </div>
            </dl>

            <div className="space-y-3">
              <h3 className="font-display text-xl text-ink">Bidang Usaha Terdaftar (KBLI)</h3>
              <ul className="space-y-2 text-sm text-ink-2">
                {BUSINESS_IDENTITY.kbli.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 border-t border-rule pt-6">
              <div>
                <h3 className="font-display text-xl text-ink">Bukti Dokumen Pengesahan PT</h3>
                <p className="mt-1 text-xs text-muted">
                  Ketuk gambar untuk memperbesar dokumen SK Kementerian Hukum RI dan ringkasan pendirian perseroan.
                </p>
              </div>
              <LegalDocumentProof documents={LEGAL_DOCUMENTS} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-rule bg-paper-2" aria-labelledby="fleet-title">
        <div className="se-section space-y-10">
          <div className="max-w-2xl">
            <h2 id="fleet-title" className="font-display text-3xl text-ink">
              Armada operasional &amp; perlengkapan dokumentasi
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-2">
              Kendaraan dan perangkat dokumentasi dikelola langsung oleh tim Berastagi dari penjemputan Bandara Kualanamu (KNO) hingga pengantaran pulang.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {FLEET_OPTIONS.map((fleet) => (
              <article key={fleet.slug} className="border-t border-rule pt-5 space-y-4">
                <div className="aspect-[16/10] overflow-hidden rounded-card bg-paper border border-rule">
                  <img
                    src={fleet.image}
                    alt={fleet.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-display text-xl text-ink">{fleet.name}</h3>
                  <p className="mt-1 text-xs font-semibold text-accent">{fleet.capacity}</p>
                  <p className="mt-2 text-sm text-ink-2 leading-relaxed">{fleet.note}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-2 border-t border-rule pt-8">
            <div className="space-y-3">
              <h3 className="font-display text-xl text-ink">Perangkat Dokumentasi Tim</h3>
              <ul className="space-y-2 text-sm text-ink-2">
                {DOCUMENTATION_GEAR.map((gear) => (
                  <li key={gear}>{gear}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-display text-xl text-ink">Ketentuan Operasional Transparan</h3>
              <ul className="space-y-2 text-sm text-ink-2 leading-relaxed">
                {OPERATOR_NOTES.slice(0, 4).map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="se-section space-y-8" aria-labelledby="social-title">
        <div className="max-w-2xl">
          <h2 id="social-title" className="font-display text-3xl text-ink">
            Lihat aktivitas trip nyata di kanal resmi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            Ikuti dokumentasi keberangkatan dan kondisi cuaca terbaru di Instagram, TikTok, dan Threads resmi Sumatera Explore.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {SOCIAL_CHANNELS.map((channel) => (
            <a
              key={channel.key}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-rule rounded-card p-6 bg-paper-2 hover:border-accent transition-colors duration-200 flex flex-col justify-between gap-4 no-underline"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 text-ink">
                  <Icon name={channel.key} className="w-5 h-5 text-accent shrink-0" />
                  <span className="font-display text-lg font-semibold">{channel.label}</span>
                </div>
                <p className="text-xs font-semibold text-accent">{channel.handle}</p>
                <p className="text-sm text-ink-2 leading-relaxed">{channel.note}</p>
              </div>
              <span className="text-xs font-semibold text-ink">Buka profil</span>
            </a>
          ))}
        </div>

        <div className="border-t border-rule pt-8 flex flex-wrap gap-3">
          <Link href="/tour/packages" className="se-btn se-btn--primary">
            Pilih Paket Wisata
          </Link>
          <a
            href={`https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-btn se-btn--wa"
          >
            <Icon name="whatsapp" className="w-4 h-4 text-success" />
            <span>Chat WhatsApp ({BUSINESS_IDENTITY.whatsappDisplay})</span>
          </a>
        </div>
      </section>
    </main>
  );
}
