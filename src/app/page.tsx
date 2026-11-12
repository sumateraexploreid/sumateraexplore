import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/Icon";
import FaqAccordion from "@/components/FaqAccordion";
import LegalDocumentProof from "@/components/LegalDocumentProof";
import { getLocale } from "@/i18n";
import { formatPrice } from "@/lib/currency";
import { getLivePackages, getLiveSiteBundle } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Sumatera Explore | Trip Privat Danau Toba, Samosir & Berastagi",
  description:
    "Trip privat Danau Toba 2D1N hingga 5D4N, Berastagi Highland, dan Medan Heritage oleh SUJAI TOBA SUMATERA. Pricelist 1-20 orang, armada SUV & Hiace, supir Muslim, makanan halal, gratis dokumentasi iPhone 4K.",
};

const places = [
  {
    number: "01",
    name: "Danau Toba & Parapat",
    image: "/images/sumut/toba_landscape.webp",
    alt: "Bentang Danau Toba dari perbukitan Parapat dan Silalahi",
    note: "Menyusuri tepian Parapat, Air Terjun Situmurun, Bukit Holbung, hingga jalur Lingkar Danau Toba yang tenang.",
  },
  {
    number: "02",
    name: "Pulau Samosir",
    image: "/images/sumut/batak_house.webp",
    alt: "Rumah adat Batak tradisional di Pulau Samosir",
    note: "Menyeberang ke Huta Siallagan, Kampung Ulos Hutaraja, Pantai Pasir Putih Parbaba, dan Bukit Sibeabea.",
  },
  {
    number: "03",
    name: "Berastagi Highland",
    image: "/images/sumut/berastagi.webp",
    alt: "Lanskap dataran tinggi sejuk Berastagi dengan pemandangan gunung",
    note: "Air Terjun Sipiso-piso, Pasar Buah Berastagi, Taman Alam Lumbini, Bukit Gundaling, dan Pemandian Air Panas Sidebuk-debuk.",
  },
];

const directoryLinks = [
  {
    title: "Pricelist Lengkap 1-20 Pax",
    note: "Innova/SUV (1-6 pax) & Hiace/ELF (6-20 pax)",
    href: "/tour/packages",
  },
  {
    title: "Galeri Perjalanan Tamu",
    note: "Dokumentasi Danau Toba & Berastagi",
    href: "/tour/gallery",
  },
  {
    title: "Jurnal Rute & Kuliner Halal",
    note: "Panduan rute darat & makanan halal",
    href: "/tour/blog",
  },
  {
    title: "Cara Pembayaran & Deposit",
    note: "Wise, MYR, SGD, IDR & pelunasan trip",
    href: "/payment",
  },
  {
    title: "Legalitas & Tim Berastagi",
    note: "SUJAI TOBA SUMATERA (AHU-A122244)",
    href: "/about",
  },
];

export default async function Home() {
  const [locale, TOUR_PACKAGES, bundle] = await Promise.all([
    getLocale(),
    getLivePackages(),
    getLiveSiteBundle(),
  ]);

  const BUSINESS_IDENTITY = bundle.business;
  const FLEET_OPTIONS = bundle.fleet;
  const GUEST_FAQS = bundle.faqs;
  const LEGAL_DOCUMENTS = bundle.legalDocuments;
  const SOCIAL_CHANNELS = bundle.socialChannels;
  const DOCUMENTATION_GEAR = bundle.documentationGear;
  const OPERATOR_NOTES = bundle.operatorNotes;

  const whatsappLink = (message: string) =>
    `https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}?text=${encodeURIComponent(message)}`;

  const durationPackages = TOUR_PACKAGES.slice(0, 4);
  const pricedPackages = await Promise.all(
    TOUR_PACKAGES.map(async (pkg) => {
      const fourPaxTier = pkg.tiers.find((t) => t.pax === 4);
      return {
        ...pkg,
        formattedStartPrice: await formatPrice(pkg.priceMyr, locale),
        formattedFourPaxPrice: fourPaxTier
          ? await formatPrice(fourPaxTier.priceMyr, locale)
          : null,
      };
    })
  );

  const heroTiles = pricedPackages.filter((pkg) =>
    durationPackages.some((d) => d.slug === pkg.slug)
  );

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: BUSINESS_IDENTITY.brandName,
    legalName: `${BUSINESS_IDENTITY.legalForm} ${BUSINESS_IDENTITY.legalName}`,
    url: BUSINESS_IDENTITY.siteUrl,
    telephone: `+${BUSINESS_IDENTITY.whatsappNumber}`,
    email: BUSINESS_IDENTITY.email,
    identifier: BUSINESS_IDENTITY.decreeNumber,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Trimurti No. 109, Tambak Lau Mulgab I",
      addressLocality: "Berastagi",
      addressRegion: "Sumatera Utara",
      postalCode: "22152",
      addressCountry: "ID",
    },
    sameAs: SOCIAL_CHANNELS.map((c) => c.url),
  };

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GUEST_FAQS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <main className="se-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <section className="se-ugc-stage" aria-labelledby="home-title">
        <div className="se-ugc-backdrop" aria-hidden="true">
          <Image
            src="/images/sumut/toba_hero.webp"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <div className="se-ugc-inner">
          <div className="se-ugc-identity">
            <div className="se-ugc-mark-row">
              <div className="se-ugc-badge-img">
                <Image
                  src="/images/sumut/toba_landscape.webp"
                  alt="Danau Toba"
                  width={44}
                  height={44}
                />
              </div>
              <div>
                <p className="se-ugc-operator-name">Operator Resmi · {BUSINESS_IDENTITY.legalName}</p>
                <p className="se-ugc-operator-sub">Private Trip Medan, Berastagi, Danau Toba &amp; Samosir</p>
              </div>
            </div>

            <h1 id="home-title">Pilih Durasi Trip Danau Toba</h1>
            <p className="se-ugc-lede">
              Supir Muslim, makan halal, DP via WhatsApp, dokumentasi iPhone 4K (drone opsional).
            </p>
          </div>

          <nav className="se-ugc-tiles" aria-label="Pilihan durasi paket wisata">
            {heroTiles.map((item) => (
              <Link
                key={item.slug}
                href={`/tour/${item.slug}`}
                className="se-ugc-tile"
              >
                <div className="se-ugc-tile-top">
                  <strong className="se-ugc-tile-days">{item.shortLabel}</strong>
                  <span className="num se-ugc-tile-price">
                    {item.formattedStartPrice}
                  </span>
                </div>
                <span className="se-ugc-tile-area">{item.locationTag}</span>
              </Link>
            ))}
          </nav>

          <div className="se-action-stack">
            <div className="se-action-primary-row">
              <a
                className="se-btn se-btn--wa w-full"
                href={whatsappLink(
                  "Halo Sumatera Explore, saya ingin cek jadwal dan pricelist private trip Danau Toba."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="whatsapp" className="w-4 h-4 text-success shrink-0" />
                <span>Chat WhatsApp ({BUSINESS_IDENTITY.whatsappDisplay})</span>
              </a>
              <Link href="/tour/packages" className="se-btn se-btn--primary w-full">
                Semua Paket &amp; Pricelist 1-20 Pax
              </Link>
            </div>

            <div className="se-action-dir-grid">
              {directoryLinks.slice(1, 5).map((item) => (
                <Link key={item.href} href={item.href} className="se-action-bar">
                  <div className="min-w-0">
                    <span className="font-semibold block text-ink text-xs sm:text-sm leading-snug">
                      {item.title}
                    </span>
                    <span className="se-action-bar-sub block mt-0.5">
                      {item.note}
                    </span>
                  </div>
                  <span className="se-action-bar-go hidden sm:inline text-xs font-semibold text-accent shrink-0" aria-hidden="true">
                    Buka
                  </span>
                </Link>
              ))}
            </div>

            <div className="pt-1">
              <a href="#destinasi" className="se-text-link">
                Rute, dokumentasi iPhone &amp; opsi drone
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="se-packages-band" id="paket" aria-labelledby="packages-title">
        <div className="se-packages-inner">
          <div className="se-section-head">
            <h2 id="packages-title">Pricelist &amp; Itinerary Resmi (Harga Weekday)</h2>
            <p className="se-section-note">
              Tarif per orang sesuai ukuran grup (1-6 pax Innova/SUV, 6-10 pax Van Hiace, 15 pax ELF, 20 pax 2 Van). Supir Muslim lokal dan restoran dijamin halal.
            </p>
          </div>

          <div className="se-package-grid">
            {pricedPackages.map((pkg) => (
              <article className="se-package-card" key={pkg.slug}>
                <Link href={`/tour/${pkg.slug}`} className="se-package-image-wrap block">
                  <Image
                    src={pkg.image_url}
                    alt={pkg.name}
                    fill
                    sizes="(max-width: 960px) 100vw, 30vw"
                    loading="lazy"
                  />
                </Link>
                <div className="se-package-content">
                  <h3>{pkg.name}</h3>
                  <p className="se-package-meta">
                    {pkg.duration} di {pkg.locationTag}
                  </p>
                  <p className="se-package-includes">
                    {pkg.hotels.join(" · ")} | {pkg.includes.slice(0, 2).join(", ")}
                  </p>
                  <div className="se-package-bottom">
                    <div>
                      <span className="se-package-price-label">Harga Weekday mulai dari</span>
                      <strong className="num se-package-price-val">
                        {pkg.formattedStartPrice}
                      </strong>
                      {pkg.formattedFourPaxPrice && (
                        <span className="block text-xs text-muted mt-0.5 num">
                          Grup 4 pax (SUV): {pkg.formattedFourPaxPrice}/org
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/tour/${pkg.slug}`}
                      aria-label={`Lihat itinerary ${pkg.name}`}
                      className="se-text-link whitespace-nowrap"
                    >
                      Lihat itinerary
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="se-places" id="destinasi" aria-labelledby="places-title">
        <div className="se-section-head">
          <h2 id="places-title">Rute Lapangan &amp; Perlengkapan Dokumentasi</h2>
          <p className="se-section-note">
            Medan, Berastagi, Parapat, hingga Pulau Samosir ditemani tim pengemudi lokal sekaligus dokumentasi perjalanan Anda.
          </p>
        </div>

        <div className="se-place-list">
          <article className="se-place is-featured">
            <div className="se-place-image-wrap">
              <Image
                src={places[0].image}
                alt={places[0].alt}
                fill
                sizes="(max-width: 960px) 100vw, 55vw"
                loading="lazy"
              />
            </div>
            <div className="se-place-info">
              <h3>{places[0].name}</h3>
              <p>{places[0].note}</p>
            </div>
          </article>

          <div className="se-place-side">
            {places.slice(1).map((place) => (
              <article className="se-place is-compact" key={place.number}>
                <div className="se-place-image-wrap">
                  <Image
                    src={place.image}
                    alt={place.alt}
                    fill
                    sizes="128px"
                    loading="lazy"
                  />
                </div>
                <div className="se-place-info">
                  <h3>{place.name}</h3>
                  <p>{place.note}</p>
                </div>
              </article>
            ))}

            <div className="pt-2 space-y-2 border-t border-rule">
              <h3 className="text-base font-semibold text-ink">
                Gratis Dokumentasi iPhone 4K (Siap Posting)
              </h3>
              <ul className="space-y-1 text-sm text-ink-2">
                {DOCUMENTATION_GEAR.map((gear) => (
                  <li key={gear}>{gear}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2 space-y-2 border-t border-rule">
              <h3 className="text-base font-semibold text-ink">
                Ketentuan Jelas Tanpa Biaya Tersembunyi
              </h3>
              <ul className="space-y-1 text-sm text-ink-2">
                {OPERATOR_NOTES.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="se-section border-t border-rule" id="armada" aria-labelledby="fleet-legal-title">
        <div className="se-section-head">
          <h2 id="fleet-legal-title">Armada Resmi &amp; Legalitas Operator</h2>
          <p className="se-section-note">
            Penjemputan langsung Bandara Kualanamu (KNO) oleh badan hukum resmi {BUSINESS_IDENTITY.legalName}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FLEET_OPTIONS.map((fleet) => (
            <article key={fleet.slug} className="space-y-3 border-b border-rule pb-6">
              <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-paper-2">
                <Image
                  src={fleet.image}
                  alt={fleet.alt}
                  fill
                  sizes="(max-width: 960px) 100vw, 45vw"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-display text-ink">{fleet.name}</h3>
              <p className="text-xs font-semibold text-accent">{fleet.capacity}</p>
              <p className="text-sm text-ink-2 leading-relaxed">{fleet.note}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-rule">
          <div className="lg:col-span-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-display text-xl text-ink">
                Badan Hukum Resmi ({BUSINESS_IDENTITY.legalName})
              </h3>
              <p className="text-sm text-ink-2 leading-relaxed">
                SK {BUSINESS_IDENTITY.decreeIssuer} Nomor{" "}
                <strong className="text-ink num">{BUSINESS_IDENTITY.decreeNumber}</strong>.
                Kantor di {BUSINESS_IDENTITY.shortAddress}.
              </p>
              <div className="pt-1">
                <Link href="/about" className="se-text-link whitespace-nowrap">
                  Lihat profil &amp; KBLI resmi
                </Link>
              </div>
            </div>

            <LegalDocumentProof documents={LEGAL_DOCUMENTS} compact />
          </div>

          <div className="lg:col-span-6 space-y-3">
            <h3 className="font-display text-xl text-ink">Aktivitas Lapangan</h3>
            <p className="text-sm text-ink-2">
              Dokumentasi perjalanan tamu terbaru tersedia di kanal resmi kami:
            </p>
            <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-2 sm:gap-3">
              {SOCIAL_CHANNELS.map((channel) => (
                <a
                  key={channel.key}
                  href={channel.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="se-btn se-btn--quiet px-2.5 sm:px-5 text-xs sm:text-sm whitespace-nowrap"
                >
                  <Icon name={channel.key} className="w-4 h-4 text-accent shrink-0" />
                  <span>{channel.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="se-section border-t border-rule" id="faq" aria-labelledby="faq-title">
        <div className="se-section-head">
          <h2 id="faq-title">Pertanyaan Umum Tamu</h2>
          <p className="se-section-note">
            Hal yang sering ditanyakan tamu Malaysia, Singapura, dan domestik sebelum keberangkatan.
          </p>
        </div>

        <div className="max-w-3xl">
          <FaqAccordion faqs={GUEST_FAQS} />
        </div>
      </section>

      <section className="se-hub-band" aria-labelledby="hub-title">
        <div className="se-hub-inner">
          <div className="se-hub-copy">
            <h2 id="hub-title">Siap Atur Tanggal Perjalanan?</h2>
            <p>
              Kirimkan tanggal tiba di Kualanamu (KNO) serta jumlah dewasa dan anak. Tim kami langsung menghitungkan rincian sesuai armada SUV atau Van Hiace.
            </p>
            <div className="se-hub-actions">
              <a
                className="se-btn se-btn--wa"
                href={whatsappLink(
                  "Halo Sumatera Explore, saya ingin konsultasi tanggal keberangkatan dan rincian paket Danau Toba."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Hubungi Tim via WhatsApp
              </a>
            </div>
          </div>

          <div className="se-hub-rows">
            {directoryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="se-hub-row">
                <div>
                  <strong>{item.title}</strong>
                  <span className="block">{item.note}</span>
                </div>
                <span aria-hidden="true">Buka</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
