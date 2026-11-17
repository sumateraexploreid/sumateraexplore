"use client";

import React, { useState, useEffect, useSyncExternalStore, useRef, useCallback } from 'react';
import Link from 'next/link';

const subscribeLocation = (callback: () => void) => {
  window.addEventListener('popstate', callback);
  return () => window.removeEventListener('popstate', callback);
};

interface ImageProps {
  id: number;
  image_url: string;
  caption: string;
  category: string;
  type?: string;
  slug?: string;
}

const ITEMS_PER_PAGE = 12;

export default function GalleryClient({ images }: { images: ImageProps[] }) {
  const categories = ['Semua', ...Array.from(new Set(images.map((img) => img.category).filter(Boolean)))];

  const searchStr = useSyncExternalStore(
    subscribeLocation,
    () => window.location.search,
    () => ''
  );
  const [categoryOverride, setCategoryOverride] = useState<string | null>(null);
  const [queryOverride, setQueryOverride] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lightbox, setLightbox] = useState({ open: false, index: 0, zoom: 1 });
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageRefsRef = useRef<Map<number, HTMLImageElement>>(new Map());

  const initialParams = new URLSearchParams(searchStr);
  const urlCategory = initialParams.get('kategori');
  const urlPage = parseInt(initialParams.get('halaman') || '1', 10);
  const activeCategory =
    categoryOverride ?? (urlCategory && categories.includes(urlCategory) ? urlCategory : 'Semua');
  const searchQuery = queryOverride ?? (initialParams.get('q') || '');

  // Sync URL with category, query, and page
  const syncUrl = useCallback((nextCategory: string, nextQuery: string, nextPage: number) => {
    const params = new URLSearchParams();
    if (nextCategory !== 'Semua') params.set('kategori', nextCategory);
    if (nextQuery.trim() !== '') params.set('q', nextQuery.trim());
    if (nextPage > 1) params.set('halaman', nextPage.toString());
    const query = params.toString();
    window.history.replaceState(
      {},
      '',
      query ? `${window.location.pathname}?${query}` : window.location.pathname
    );
  }, []);

  // Reset to page 1 when category or query changes
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
      syncUrl(activeCategory, searchQuery, 1);
    }
  }, [activeCategory, searchQuery, currentPage, syncUrl]);

  // Initialize page from URL on mount
  useEffect(() => {
    if (urlPage > 1) {
      setCurrentPage(urlPage);
    }
  }, [urlPage]);

  const handleCategoryChange = (cat: string) => {
    setCategoryOverride(cat);
    syncUrl(cat, searchQuery, 1);
  };

  const handleQueryChange = (q: string) => {
    setQueryOverride(q);
    syncUrl(activeCategory, q, 1);
  };

  const filteredImages = images.filter((img) => {
    const cat = activeCategory === 'Semua' || img.category === activeCategory;
    const q = searchQuery.trim().toLowerCase();
    const searchMatch =
      !q ||
      (img.caption && img.caption.toLowerCase().includes(q)) ||
      (img.category && img.category.toLowerCase().includes(q));
    return cat && searchMatch;
  });

  const filteredCount = filteredImages.length;
  const totalPages = Math.ceil(filteredCount / ITEMS_PER_PAGE);
  const currentPageImages = filteredImages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openLightbox = (id: number) => {
    const index = currentPageImages.findIndex((x) => x.id === id);
    if (index === -1) return;
    setLightbox({ open: true, index, zoom: 1 });
  };

  const closeLightbox = () => {
    setLightbox((prevState) => ({ ...prevState, open: false, zoom: 1 }));
  };

  const prev = () => {
    if (currentPageImages.length === 0) return;
    setLightbox((prevState) => ({
      ...prevState,
      index: (prevState.index - 1 + currentPageImages.length) % currentPageImages.length,
      zoom: 1,
    }));
  };

  const next = () => {
    if (currentPageImages.length === 0) return;
    setLightbox((prevState) => ({
      ...prevState,
      index: (prevState.index + 1) % currentPageImages.length,
      zoom: 1,
    }));
  };

  const zoomIn = () => {
    setLightbox((prevState) => ({
      ...prevState,
      zoom: Math.min(2.5, Number((prevState.zoom + 0.5).toFixed(1))),
    }));
  };

  const zoomOut = () => {
    setLightbox((prevState) => ({
      ...prevState,
      zoom: Math.max(1, Number((prevState.zoom - 0.5).toFixed(1))),
    }));
  };

  const resetZoom = () => {
    setLightbox((prevState) => ({ ...prevState, zoom: 1 }));
  };

  useEffect(() => {
    if (!lightbox.open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightbox((prevState) => ({ ...prevState, open: false, zoom: 1 }));
      } else if (e.key === 'ArrowLeft' && currentPageImages.length > 0) {
        setLightbox((prevState) => ({
          ...prevState,
          index: (prevState.index - 1 + currentPageImages.length) % currentPageImages.length,
          zoom: 1,
        }));
      } else if (e.key === 'ArrowRight' && currentPageImages.length > 0) {
        setLightbox((prevState) => ({
          ...prevState,
          index: (prevState.index + 1) % currentPageImages.length,
          zoom: 1,
        }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox.open, currentPageImages.length]);

  // IntersectionObserver for lazy loading images
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const id = parseInt(img.dataset.id || '0', 10);
            if (id) {
              setLoadedImages((prev) => new Set([...prev, id]));
            }
            observerRef.current?.unobserve(img);
          }
        });
      },
      {
        rootMargin: '100px',
        threshold: 0.01,
      }
    );

    // Observe all current page images
    currentPageImages.forEach((img) => {
      const imgEl = imageRefsRef.current.get(img.id);
      if (imgEl) {
        observerRef.current?.observe(imgEl);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [currentPageImages]);

  const handleImageRef = (id: number) => (el: HTMLImageElement | null) => {
    if (el) {
      imageRefsRef.current.set(id, el);
      observerRef.current?.observe(el);
    } else {
      imageRefsRef.current.delete(id);
    }
  };

  const activeItem = currentPageImages[lightbox.index];

  return (
    <main>
      <section className="se-subhero">
        <div className="se-subhero-inner">
          <div>
            <nav aria-label="Breadcrumb" className="se-breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Galeri</span>
            </nav>
            <h1>Galeri perjalanan</h1>
          </div>
          <p>
            Dokumentasi foto dan video tamu dari Danau Toba, Samosir, Paropo, serta Berastagi.
          </p>
        </div>
      </section>

      <section className="se-section">
        <div className="flex flex-col gap-5 pb-8 mb-8 border-b border-rule lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter kategori galeri">
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
            <label htmlFor="gallery-search" className="sr-only">
              Cari foto galeri
            </label>
            <input
              id="gallery-search"
              type="search"
              value={searchQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Cari lokasi atau momen…"
              className="se-input"
            />
          </div>
        </div>

        {filteredImages.length === 0 ? (
          <div className="rounded-card border border-rule bg-paper-2 p-10 text-center">
            <p className="font-display text-xl text-ink mb-2">Foto tidak ditemukan</p>
            <p className="text-sm text-ink-2 mb-6">
              Coba ubah kata kunci pencarian atau pilih kategori lain.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategoryOverride('Semua');
                setQueryOverride('');
                syncUrl('Semua', '', 1);
              }}
              className="se-btn se-btn--quiet"
            >
              Reset Galeri
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentPageImages.map((img) => (
                <figure
                  key={img.id}
                  className="flex flex-col border-b border-rule pb-5"
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(img.id)}
                    className="block w-full aspect-[4/3] overflow-hidden rounded-card bg-paper-2 text-left focus-visible:outline-2 focus-visible:outline-focus"
                    aria-label={`Lihat foto penuh: ${img.caption || img.category}`}
                  >
                    <img
                      ref={handleImageRef(img.id)}
                      data-id={img.id}
                      src={loadedImages.has(img.id) ? img.image_url : undefined}
                      data-src={!loadedImages.has(img.id) ? img.image_url : undefined}
                      alt={img.caption || img.category}
                      className={`h-full w-full object-cover transition-opacity duration-300 ${
                        loadedImages.has(img.id) ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                      decoding="async"
                      onLoad={() => setLoadedImages((prev) => new Set([...prev, img.id]))}
                    />
                  </button>
                  <figcaption className="flex flex-1 flex-col justify-between gap-2 pt-4">
                    <div>
                      <p className="font-display text-lg leading-snug text-ink">
                        {img.caption || 'Dokumentasi perjalanan Sumatera Explore'}
                      </p>
                      <p className="mt-1 text-sm text-muted">{img.category}</p>
                    </div>
                    {img.slug && (
                      <div>
                        <Link
                          href={img.type === 'blog' ? `/tour/blog/${img.slug}` : `/tour/${img.slug}`}
                          className="inline-flex min-h-[44px] items-center text-sm font-semibold text-accent underline underline-offset-4 hover:text-ink"
                        >
                          {img.type === 'blog' ? 'Baca artikel terkait' : 'Lihat paket rute ini'}
                        </Link>
                      </div>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav
                className="flex flex-wrap items-center justify-center gap-2 mt-8"
                aria-label="Navigasi halaman galeri"
              >
                <button
                  type="button"
                  onClick={() => {
                    const nextPage = Math.max(1, currentPage - 1);
                    setCurrentPage(nextPage);
                    syncUrl(activeCategory, searchQuery, nextPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className="se-btn se-btn--quiet"
                  aria-label="Halaman sebelumnya"
                  aria-disabled={currentPage === 1}
                >
                  Sebelumnya
                </button>
                <div className="flex items-center gap-1" role="group" aria-label="Pilih halaman">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => {
                        setCurrentPage(page);
                        syncUrl(activeCategory, searchQuery, page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`se-btn ${currentPage === page ? 'se-btn--primary' : 'se-btn--quiet'} min-w-[44px]`}
                      aria-label={`Halaman ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextPage = Math.min(totalPages, currentPage + 1);
                    setCurrentPage(nextPage);
                    syncUrl(activeCategory, searchQuery, nextPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className="se-btn se-btn--quiet"
                  aria-label="Halaman berikutnya"
                  aria-disabled={currentPage === totalPages}
                >
                  Berikutnya
                </button>
              </nav>
            )}

            <p className="text-center text-sm text-muted mt-6">
              Menampilkan {((currentPage - 1) * ITEMS_PER_PAGE) + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredCount)} dari {filteredCount} foto
            </p>
          </>
        )}
      </section>

      {lightbox.open && activeItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan foto galeri"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-forest-deep p-4 md:p-8 text-forest-ink"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-forest-rule pb-4">
            <div className="text-sm text-forest-muted">
              <span className="num font-semibold text-forest-ink">
                {lightbox.index + 1} / {currentPageImages.length}
              </span>{' '}
              ({activeItem.category})
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={zoomOut}
                disabled={lightbox.zoom <= 1}
                className="min-h-[44px] min-w-[44px] rounded-card border border-forest-rule px-3 text-sm font-semibold text-forest-ink hover:bg-forest disabled:opacity-40"
                aria-label="Perkecil foto"
              >
                -
              </button>
              <button
                type="button"
                onClick={resetZoom}
                className="num min-h-[44px] rounded-card border border-forest-rule px-3 text-sm font-semibold text-forest-ink hover:bg-forest"
                aria-label="Reset pembesaran"
              >
                {Math.round(lightbox.zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={lightbox.zoom >= 2.5}
                className="min-h-[44px] min-w-[44px] rounded-card border border-forest-rule px-3 text-sm font-semibold text-forest-ink hover:bg-forest disabled:opacity-40"
                aria-label="Perbesar foto"
              >
                +
              </button>
              <button
                type="button"
                onClick={closeLightbox}
                className="min-h-[44px] rounded-card border border-forest-rule px-4 text-sm font-semibold text-forest-ink hover:bg-accent hover:border-accent"
                aria-label="Tutup tampilan foto"
              >
                Tutup
              </button>
            </div>
          </div>

          <div className="relative my-4 flex flex-1 items-center justify-center overflow-auto">
            <img
              src={activeItem.image_url}
              alt={activeItem.caption || activeItem.category}
              style={{ transform: `scale(${lightbox.zoom})` }}
              className="max-h-[70dvh] w-auto max-w-full object-contain rounded-card"
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-forest-rule pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="font-display text-lg text-forest-ink">{activeItem.caption}</p>
              {activeItem.slug && (
                <Link
                  href={
                    activeItem.type === 'blog'
                      ? `/tour/blog/${activeItem.slug}`
                      : `/tour/${activeItem.slug}`
                  }
                  onClick={closeLightbox}
                  className="mt-1 inline-flex min-h-[44px] items-center text-sm font-semibold text-forest-ink underline underline-offset-4 hover:text-forest-muted"
                >
                  {activeItem.type === 'blog' ? 'Buka jurnal terkait' : 'Lihat detail paket'}
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                className="min-h-[44px] rounded-card border border-forest-rule px-4 text-sm font-semibold text-forest-ink hover:bg-forest"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                onClick={next}
                className="min-h-[44px] rounded-card border border-forest-rule px-4 text-sm font-semibold text-forest-ink hover:bg-forest"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}