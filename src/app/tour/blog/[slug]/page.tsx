import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLiveBlogPost, getLiveBlogs, getLivePackageBySlug, getLiveSiteBundle } from "@/lib/cms";
import { getLocale } from "@/i18n";
import { formatPrice } from "@/lib/currency";

const BASE_URL = "https://sumateraexplore.my.id";

export async function generateStaticParams() {
  const posts = await getLiveBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getLiveBlogPost(slug);
  if (!post) return { title: "Artikel Tidak Ditemukan - Sumatera Explore" };

  return {
    title: `${post.title} - Sumatera Explore`,
    description: post.excerpt,
    alternates: {
      canonical: `${BASE_URL}/tour/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      images: [`${BASE_URL}${post.image_url}`],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getLiveBlogPost(slug);

  if (!post) {
    notFound();
  }

  const locale = await getLocale();
  const [relatedPkg, allPosts, bundle] = await Promise.all([
    getLivePackageBySlug(post.relatedPackageSlug),
    getLiveBlogs(),
    getLiveSiteBundle(),
  ]);
  const BUSINESS_IDENTITY = bundle.business;
  const formattedPkgPrice = relatedPkg
    ? await formatPrice(relatedPkg.priceMyr, locale)
    : null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const relatedPosts = allPosts.filter((p) => p.id !== post.id).slice(0, 3);
  const encodeUrl = `${BASE_URL}/tour/blog/${post.slug}`;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [`${BASE_URL}${post.image_url}`],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: "Sumatera Explore",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Sumatera Explore",
      url: BASE_URL,
    },
    mainEntityOfPage: encodeUrl,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Jurnal", item: `${BASE_URL}/tour/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: encodeUrl },
    ],
  };

  return (
    <main className="se-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <section className="se-subhero">
        <div className="se-subhero-inner">
          <div>
            <nav aria-label="Breadcrumb" className="se-breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <Link href="/tour/blog">Jurnal</Link>
              <span aria-hidden="true">/</span>
              <span>{post.category}</span>
            </nav>
            <h1>{post.title}</h1>
          </div>
          <p>
            {post.category}, <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>,{" "}
            {post.readTime} oleh Tim Sumatera Explore
          </p>
        </div>
      </section>

      <section className="se-section">
        <div className="overflow-hidden rounded-card bg-paper-2 mb-10 border border-rule">
          <img
            src={post.image_url}
            alt={post.title}
            fetchPriority="high"
            decoding="async"
            className="aspect-[16/9] max-h-[520px] w-full object-cover"
          />
        </div>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          <article className="lg:col-span-8">
            <p className="font-display text-xl leading-relaxed text-ink mb-8 pb-6 border-b border-rule">
              {post.excerpt}
            </p>

            <div className="space-y-8">
              {post.sections.map((section) => (
                <section key={section.heading} className="space-y-3">
                  <h2 className="font-display font-bold text-2xl text-ink">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph, pIdx) => (
                    <p key={pIdx} className="text-base leading-relaxed text-ink-2">
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            {post.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-rule flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex min-h-[36px] items-center rounded-card border border-rule bg-paper-2 px-3 text-sm text-ink-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-rule flex flex-wrap items-center justify-between gap-4">
              <Link href="/tour/blog" className="se-btn se-btn--quiet">
                Kembali ke Jurnal
              </Link>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${post.title} ${encodeUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="se-btn se-btn--primary"
              >
                Bagikan via WhatsApp
              </a>
            </div>
          </article>

          <aside className="lg:col-span-4 space-y-6">
            {relatedPkg && (
              <div className="rounded-card bg-paper-2 border border-rule p-6 space-y-4">
                <span className="text-xs font-semibold text-accent block">
                  Rekomendasi Paket Rute Ini
                </span>
                <h2 className="font-display font-bold text-xl text-ink">
                  {relatedPkg.name}
                </h2>
                <p className="text-sm text-ink-2 leading-relaxed">
                  {relatedPkg.duration} di {relatedPkg.locationTag}. Sudah termasuk armada SUV atau Van Hiace, hotel, sarapan, serta gratis dokumentasi iPhone 4K (drone opsional).
                </p>
                {formattedPkgPrice && (
                  <p className="num text-lg font-extrabold text-accent">
                    Mulai {formattedPkgPrice} /orang
                  </p>
                )}
                <Link
                  href={`/tour/${relatedPkg.slug}`}
                  className="se-btn se-btn--primary w-full"
                >
                  Lihat itinerary &amp; pricelist
                </Link>
              </div>
            )}

            <div className="rounded-card bg-forest p-6 border border-forest-rule text-forest-ink space-y-3">
              <h2 className="font-display font-bold text-xl text-forest-ink">
                Tanya Jadwal Privat
              </h2>
              <p className="text-sm leading-relaxed text-forest-muted">
                Butuh penjemputan dari Bandara Kualanamu menuju Berastagi, Paropo, atau Samosir? Tim Berastagi siap bantu hitungkan tarif grup Anda.
              </p>
              <a
                href={`https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}?text=${encodeURIComponent(
                  `Halo Sumatera Explore, saya membaca panduan "${post.title}" dan ingin menanyakan paket yang sesuai.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="se-btn se-btn--wa w-full"
              >
                Chat WhatsApp Tim Kami
              </a>
            </div>

            <div className="border-t border-rule pt-6">
              <h2 className="font-display font-bold text-lg text-ink mb-3">Tautan cepat</h2>
              <ul className="divide-y divide-rule text-sm">
                <li>
                  <Link
                    href="/tour/packages"
                    className="flex min-h-[44px] items-center text-ink-2 hover:text-accent"
                  >
                    Semua paket &amp; pricelist 1 sampai 20 pax
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tour/gallery"
                    className="flex min-h-[44px] items-center text-ink-2 hover:text-accent"
                  >
                    Galeri foto &amp; video perjalanan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment"
                    className="flex min-h-[44px] items-center text-ink-2 hover:text-accent"
                  >
                    Cara pembayaran &amp; kurs MYR/SGD/IDR
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="flex min-h-[44px] items-center text-ink-2 hover:text-accent"
                  >
                    Tentang Sumatera Explore Berastagi
                  </Link>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-rule">
            <h2 className="font-display font-bold text-2xl text-ink mb-8">Panduan rute lainnya</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {relatedPosts.map((rel) => (
                <article
                  key={rel.id}
                  className="flex flex-col border-b border-rule pb-6"
                >
                  <Link href={`/tour/blog/${rel.slug}`} className="block overflow-hidden rounded-card bg-paper-2">
                    <img
                      src={rel.image_url}
                      alt={rel.title}
                      className="aspect-[16/10] w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="pt-4">
                    <h3 className="font-display font-bold text-lg leading-snug text-ink">
                      <Link
                        href={`/tour/blog/${rel.slug}`}
                        className="hover:text-accent transition-colors"
                      >
                        {rel.title}
                      </Link>
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {rel.category}, <time dateTime={rel.createdAt}>{formatDate(rel.createdAt)}</time>
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
