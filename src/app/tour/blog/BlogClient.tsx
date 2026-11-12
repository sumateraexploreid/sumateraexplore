"use client";

import React, { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';

const subscribeLocation = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
};

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image_url: string;
  createdAt: string;
  readTime?: string;
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const categories = ['Semua', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];

  const searchStr = useSyncExternalStore(
    subscribeLocation,
    () => window.location.search,
    () => ''
  );
  const [categoryOverride, setCategoryOverride] = useState<string | null>(null);
  const [queryOverride, setQueryOverride] = useState<string | null>(null);

  const initialParams = new URLSearchParams(searchStr);
  const urlCategory = initialParams.get('kategori');
  const activeCategory =
    categoryOverride ?? (urlCategory && categories.includes(urlCategory) ? urlCategory : 'Semua');
  const searchQuery = queryOverride ?? (initialParams.get('q') || '');

  const syncUrl = (nextCategory: string, nextQuery: string) => {
    const params = new URLSearchParams();
    if (nextCategory !== 'Semua') params.set('kategori', nextCategory);
    if (nextQuery.trim() !== '') params.set('q', nextQuery.trim());
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname
    );
  };

  const handleCategoryChange = (cat: string) => {
    setCategoryOverride(cat);
    syncUrl(cat, searchQuery);
  };

  const handleQueryChange = (q: string) => {
    setQueryOverride(q);
    syncUrl(activeCategory, q);
  };

  const filteredPosts = posts.filter((p) => {
    const cat = activeCategory === 'Semua' || p.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch =
      !q ||
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(q));
    return cat && searchMatch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const featured = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const restPosts = filteredPosts.slice(1);

  return (
    <main>
      <section className="se-subhero">
        <div className="se-subhero-inner">
          <div>
            <nav aria-label="Breadcrumb" className="se-breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Jurnal</span>
            </nav>
            <h1>Jurnal &amp; panduan</h1>
          </div>
          <p>Catatan rute darat, waktu terbaik ke Samosir, dan kuliner Sumatera Utara.</p>
        </div>
      </section>

      <section className="se-section">
        <div className="flex flex-col gap-5 pb-8 mb-10 border-b border-rule lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori jurnal">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={`se-chip ${activeCategory === cat ? 'is-active' : ''}`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="w-full lg:w-80">
            <label htmlFor="blog-search" className="sr-only">
              Cari artikel jurnal
            </label>
            <input
              id="blog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Cari destinasi atau panduan..."
              className="se-input"
            />
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-card border border-rule bg-paper-2 p-10 text-center">
            <p className="font-display text-xl text-ink mb-2">Artikel belum tersedia</p>
            <p className="text-sm text-ink-2 mb-6">
              Coba kata kunci lain atau tampilkan kembali seluruh kategori jurnal.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryOverride('Semua');
                setQueryOverride('');
                syncUrl('Semua', '');
              }}
              className="se-btn se-btn--quiet"
            >
              Reset Jurnal
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {featured && (
              <article className="grid gap-8 border-b border-rule pb-12 lg:grid-cols-12 lg:items-center">
                <Link
                  href={`/tour/blog/${featured.slug}`}
                  className="block lg:col-span-7 overflow-hidden rounded-card bg-paper-2"
                >
                  <img
                    src={featured.image_url}
                    alt={featured.title}
                    className="aspect-[16/10] w-full object-cover"
                    fetchPriority="high"
                    decoding="async"
                  />
                </Link>

                <div className="lg:col-span-5">
                  <h2 className="font-display text-2xl leading-tight text-ink sm:text-3xl">
                    <Link
                      href={`/tour/blog/${featured.slug}`}
                      className="hover:text-accent transition-colors"
                    >
                      {featured.title}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm text-muted">
                    {featured.category}, <time dateTime={featured.createdAt}>{formatDate(featured.createdAt)}</time>
                    {featured.readTime ? `, ${featured.readTime}` : ""}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-ink-2">
                    {featured.excerpt}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={`/tour/blog/${featured.slug}`}
                      className="se-btn se-btn--quiet"
                    >
                      Baca artikel
                    </Link>
                  </div>
                </div>
              </article>
            )}

            {restPosts.length > 0 && (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {restPosts.map((post) => (
                  <article
                    key={post.id}
                    className="flex flex-col border-b border-rule pb-6"
                  >
                    <Link
                      href={`/tour/blog/${post.slug}`}
                      className="block overflow-hidden rounded-card bg-paper-2"
                    >
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="aspect-[16/10] w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col justify-between pt-4">
                      <div>
                        <h3 className="font-display text-xl leading-snug text-ink">
                          <Link
                            href={`/tour/blog/${post.slug}`}
                            className="hover:text-accent transition-colors"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="mt-2 text-sm text-muted">
                          {post.category},{" "}
                          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                          {post.readTime ? `, ${post.readTime}` : ""}
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-ink-2 line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="mt-5">
                        <Link
                          href={`/tour/blog/${post.slug}`}
                          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-accent underline underline-offset-4 hover:text-ink"
                        >
                          Selengkapnya
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
