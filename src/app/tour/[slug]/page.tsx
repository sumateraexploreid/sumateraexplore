import React from "react";
import PackageDetailClient from "./PackageDetailClient";
import { notFound } from "next/navigation";
import { getLocale } from "@/i18n";
import { currencyFor, getManualRates } from "@/lib/currency";
import {
  getLivePackageBySlug,
  getLivePackages,
  getLiveSiteBundle,
} from "@/lib/cms";

const BASE_URL = "https://sumateraexplore.my.id";

const SLUG_ALIASES: Record<string, string> = {
  "danau-toba-3-hari-2-malam": "danau-toba-3d2n",
  "samosir-4-hari-3-malam": "danau-toba-4d3n",
  "samosir-toba-5-hari": "danau-toba-5d4n",
  "medan-city-tour": "medan-city-tour-1d",
};

async function resolvePackage(slug: string) {
  const mappedSlug = SLUG_ALIASES[slug] || slug;
  return getLivePackageBySlug(mappedSlug);
}

export async function generateStaticParams() {
  const packages = await getLivePackages();
  return packages.map((pkg) => ({ slug: pkg.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await resolvePackage(slug);
  if (!pkg) return { title: "Paket Tidak Ditemukan - Sumatera Explore" };

  const canonicalUrl = `${BASE_URL}/tour/${pkg.slug}`;
  return {
    title: `${pkg.name} | Pricelist 1-10 Pax - Sumatera Explore`,
    description: pkg.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pkg.name,
      description: pkg.description,
      url: canonicalUrl,
      images: [`${BASE_URL}${pkg.image_url}`],
    },
  };
}

export default async function PackageDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pkg = await resolvePackage(slug);

  if (!pkg) {
    notFound();
  }

  const [locale, rates, bundle] = await Promise.all([
    getLocale(),
    getManualRates(),
    getLiveSiteBundle(),
  ]);
  const currency = currencyFor(locale) as "MYR" | "IDR" | "SGD";
  const idrPerUnit =
    currency === "MYR" ? rates.myr : currency === "SGD" ? rates.sgd : 1;

  const pkgUrl = `${BASE_URL}/tour/${pkg.slug}`;
  const tripLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.description,
    touristType: "Private Group Tour",
    image: `${BASE_URL}${pkg.image_url}`,
    provider: {
      "@type": "TravelAgency",
      name: bundle.business.brandName,
      url: bundle.business.siteUrl,
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "MYR",
      price: pkg.priceMyr,
      url: pkgUrl,
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Paket Wisata", item: `${BASE_URL}/tour/packages` },
      { "@type": "ListItem", position: 3, name: pkg.name, item: pkgUrl },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PackageDetailClient
        pkg={pkg}
        currency={currency}
        idrPerUnit={idrPerUnit}
        myrToIdr={rates.myr}
        whatsappNumber={bundle.business.whatsappNumber}
        whatsappDisplay={bundle.business.whatsappDisplay}
      />
    </>
  );
}
