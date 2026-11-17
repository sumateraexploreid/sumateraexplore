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
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
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

  // Related posts: same category, excluding current post, max 3
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const encodeUrl = `${BASE_URL}/tour/blog/${post.slug}`;

  // BlogPosting schema (more specific than Article)
  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
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
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/images/logo.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": encodeUrl,
    },
    articleSection: post.category,
    keywords: post.tags.join(", "),
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

  // Share utilities (BlogClient pattern)
  const shareText = `${post.title} - ${encodeUrl}`;
  const encodedShareText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(encodeUrl);

  return (
    <main className="se-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
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

            <div className="mt-8 pt-6 border-t border-rule flex flex-wrap items-center gap-4">
              <Link href="/tour/blog" className="se-btn se-btn--quiet">
                Kembali ke Jurnal
              </Link>
              {/* Share buttons - BlogClient pattern: WA, FB, Copy */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted">Bagikan:</span>
                <a
                  href={`https://wa.me/?text=${encodedShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="se-btn se-btn--wa"
                  aria-label="Bagikan ke WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.466-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.454.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.625.712.227 1.36.194 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378 9.86 9.86 0 0 1-.372-.365 11.29 11.29 0 0 1-.497-.571c-.324-.372-.498-.811-.524-1.016-.025-.198-.049-.397-.049-.595s-.025-.397-.049-.595c-.025-.223-.2-1.281.174-2.018.148-.273.372-.571.595-.819.223-.248.497-.497.72-.745.223-.248.397-.447.57-.595.173-.148.272-.198.547-.298.524-.223.998-.719 1.272-1.213.447-.497.547-.795.67-.994.099-.198.148-.272.372-.372.397-.149.842-.198 1.413-.223.422-.025.943-.049 1.314-.049.372 0 .894.049 1.242.198.347.148.645.422.868.72.223.297.324.669.324 1.093s-.074.795-.272 1.043c-.198.248-.546.619-.942 1.114-.397.497-1.29 1.819-1.29 2.452 0 1.066-.074 1.997-.198 2.572-.124.571-.572 2.27-1.444 2.545-.872.273-2.097.422-3.649.422-1.114 0-2.019-.173-2.69-.347a8.42 8.42 0 0 1-.894-.625 8.59 8.59 0 0 1-1.26-.894c-.422-.372-.67-.718-.745-.942-.074-.223-.123-.471-.123-.693 0-.248.049-.52.123-.744a7.4 7.4 0 0 1 .372-.942 16.12 16.12 0 0 0 1.042-1.437 9.5 9.5 0 0 0 .625-1.413c.148-.447.198-.894.148-1.314-.05-.447-.223-.943-.524-1.39-.397-.447-1.068-.769-1.893-.769-.571 0-1.115.173-1.61.497-.397.272-.695.644-.843 1.043-.148.397-.173.942-.123 1.367.025.273.198.619.447.868.498.497 1.29 1.19 1.588 1.413.248.248.471.497.694.694.324.324.52.571.571.745.05.148.05.297 0 .422-.05.124-.198.297-.57.571-.397.272-1.114.497-2.019.497-1.588 0-3.02-.67-3.893-1.61-.894-.894-1.463-2.19-1.588-3.035-.124-.895.05-1.965.497-2.735.448-.769 1.413-2.117 2.112-2.69.694-.571 1.588-.62 2.571-.32.993.298 1.836 1.093 2.479 2.043.645.948.868 2.144.893 3.06-.025.994-.373 1.814-1.142 2.452-.794.618-1.814.942-3.11 1.067-1.296.124-2.592.074-3.617-.025-1.017-.1-1.865-.472-2.518-1.242-.645-.794-1.017-1.936-1.043-3.324-.025-1.414.297-2.604 1.042-3.423.745-.819 1.915-1.19 3.439-1.19.993 0 1.813.173 2.517.52.745.324 1.29.794 1.713 1.438.422.645.571 1.413.571 2.23 0 .744-.124 1.367-.372 1.865-.248.497-.644 1.067-1.19 1.662-.546.595-1.463 1.437-2.69 2.26-1.213.819-2.852 1.39-4.518 1.614-.025 0-.049-.025-.074-.025H3.99c-.273 0-.52.099-.718.298-.198.199-.297.447-.297.744 0 .298.099.547.297.745.198.198.446.297.718.297h.003c2.868-.223 5.535-.62 8.064-1.37 2.612-.794 4.577-1.814 5.848-3.086 1.213-1.213 1.761-2.571 1.761-4.113 0-1.165-.347-2.117-1.043-2.788-.695-.67-1.61-1.043-2.71-1.043-.472 0-.993.075-1.463.224-.472.148-.794.422-1.017.769-.223.347-.297.795-.297 1.314 0 .794.148 1.463.447 1.96.297.497.744.843 1.29 1.042.547.198 1.313.198 2.186.148.645-.05 1.19-.324 1.588-.644.398-.323.645-.77.72-1.29.075-.497.05-1.093-.074-1.562-.123-.472-.422-.843-.843-1.093-.423-.248-.893-.297-1.49-.198-.595.099-1.067.397-1.44.893-.373.497-.571 1.115-.571 1.836 0 .645.148 1.142.447 1.514.297.372.744.571 1.314.571.595 0 1.067-.173 1.44-.52.397-.347.571-.843.571-1.39 0-.718-.323-1.29-.916-1.737-.595-.447-1.39-.67-2.403-.67-.498 0-.993.05-1.463.148-.472.099-.894.272-1.263.52-.372.248-.595.595-.67.994-.074.397-.05.819.025 1.213.075.398.297.72.644.967.347.248.818.372 1.413.372.595 0 1.068-.174 1.44-.52.372-.347.571-.843.571-1.39 0-.645-.324-1.213-.968-1.713-.644-.497-1.513-.745-2.612-.745-.745 0-1.463.223-2.136.67-.67.447-1.142 1.142-1.413 2.043-.272.895-.297 1.914-.173 2.981.123.993.472 1.813 1.093 2.479.62.67 1.49 1.115 2.612 1.29 1.115.174 2.279-.123 3.392-.819 1.093-.695 1.865-1.689 2.29-2.868.423-1.19.372-2.354-.025-3.324z"/>
                  </svg>
                  <span className="sr-only">WhatsApp</span>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedShareText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="se-btn se-btn--primary"
                  aria-label="Bagikan ke Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </a>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(shareText);
                      alert("Tautin disalin ke papan klip!");
                    } catch {
                      alert("Gagal menyalin tautan.");
                    }
                  }}
                  className="se-btn se-btn--quiet"
                  aria-label="Salin tautan"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="sr-only">Salin tautan</span>
                </button>
              </div>
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
            <h2 className="font-display font-bold text-2xl text-ink mb-8">Panduan rute lainnya ({post.category})</h2>
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
