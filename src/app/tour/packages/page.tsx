import React from "react";
import Link from "next/link";
import PackageCard from "@/components/PackageCard";
import { getLocale } from "@/i18n";
import { currencyFor, getManualRates } from "@/lib/currency";
import { getLivePackages } from "@/lib/cms";
import { BUSINESS_IDENTITY } from "@/data/business";

export const metadata = {
  title: "Paket Wisata & Pricelist Danau Toba - Sumatera Explore",
  description:
    "Pilihan paket private trip Danau Toba 2D1N hingga 5D4N, Berastagi Highland, dan Medan Heritage lengkap pricelist 1 sampai 10 orang.",
};

export default async function PackagesPage() {
  const locale = await getLocale();
  const currency = currencyFor(locale) as "MYR" | "IDR" | "SGD";
  const rates = await getManualRates();
  const idrPerUnit =
    currency === "MYR" ? rates.myr : currency === "SGD" ? rates.sgd : 1;

  const livePackages = await getLivePackages();
  const catalogPackages = livePackages.map((pkg) => ({
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    duration: pkg.duration,
    locationTag: pkg.locationTag,
    price: pkg.priceMyr * rates.myr,
    image_url: pkg.image_url,
    isFeatured: pkg.isFeatured,
    includes: pkg.includes.slice(0, 3),
  }));

  return (
    <main className="se-page min-h-screen">
      <section className="se-subhero" aria-labelledby="packages-page-title">
        <div className="se-subhero-inner">
          <div>
            <nav className="se-breadcrumb" aria-label="Navigasi halaman">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Paket wisata</span>
            </nav>
            <h1 id="packages-page-title">Paket Wisata &amp; Pricelist Resmi</h1>
          </div>
          <p>
            Pilih durasi 1 sampai 5 hari lengkap kalkulator 1 sampai 20 peserta.
          </p>
        </div>
      </section>

      <section className="se-section" aria-labelledby="catalog-title">
        <div className="flex flex-wrap items-baseline justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-rule">
          <h2 id="catalog-title" className="text-2xl font-display font-bold text-ink">
            Daftar rute tersedia
          </h2>
          <p className="num text-sm text-muted">
            Menampilkan {catalogPackages.length} paket private trip
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-stretch">
          {catalogPackages.map((pkg, index) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              priority={index === 0}
              currency={currency}
              idrPerUnit={idrPerUnit}
            />
          ))}
        </div>
      </section>

      <section className="bg-forest text-forest-ink border-t border-rule">
        <div className="se-section flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-forest-ink">
              Rombongan lebih dari 20 orang atau request rute khusus?
            </h2>
            <p className="mt-2 text-sm sm:text-base text-forest-muted max-w-xl">
              Kirimkan tanggal tiba di Kualanamu (KNO) beserta jumlah peserta. Kami sesuaikan hotel dan armada SUV, Hiace, ELF, atau Medium Bus.
            </p>
          </div>
          <a
            href={`https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}?text=${encodeURIComponent("Halo Sumatera Explore, saya ingin tanya paket rombongan atau rute khusus Danau Toba.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-btn se-btn--wa w-full sm:w-auto shrink-0"
          >
            Konsultasi via WhatsApp
          </a>
        </div>
      </section>
    </main>
  );
}
