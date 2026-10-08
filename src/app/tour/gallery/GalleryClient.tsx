"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface ImageProps {
    id: number;
    image_url: string;
    caption: string;
    category: string;
    type?: string;
    slug?: string;
}

export default function GalleryClient({ images }: { images: ImageProps[] }) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
    const [lightbox, setLightbox] = useState({ open: false, index: 0, zoom: 1 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const params = new URLSearchParams(window.location.search);
        const cat = params.get('kategori');
        if (cat && categories.includes(cat)) setActiveCategory(cat);
        setSearchQuery(params.get('q') || '');
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const params = new URLSearchParams();
        if (activeCategory !== 'Semua') params.set('kategori', activeCategory);
        if (searchQuery.trim() !== '') params.set('q', searchQuery.trim());
        const query = params.toString();
        window.history.replaceState({}, '', query ? window.location.pathname + '?' + query : window.location.pathname);
    }, [activeCategory, searchQuery]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!lightbox.open) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightbox]);

    const categories = ['Semua', ...Array.from(new Set(images.map(img => img.category).filter(Boolean)))];

    const filteredImages = images.filter(img => {
        const cat = activeCategory === 'Semua' || img.category === activeCategory;
        const q = searchQuery.trim().toLowerCase();
        const searchMatch = !q || (img.caption && img.caption.toLowerCase().includes(q)) || (img.category && img.category.toLowerCase().includes(q));
        return cat && searchMatch;
    });

    const openLightbox = (id: number) => {
        const index = filteredImages.findIndex(x => x.id === id);
        if (index === -1) return;
        setLightbox({ open: true, index, zoom: 1 });
        document.body.classList.add('overflow-hidden');
    };

    const closeLightbox = () => {
        setLightbox({ ...lightbox, open: false, zoom: 1 });
        document.body.classList.remove('overflow-hidden');
    };

    const zoomIn = () => setLightbox(prev => ({ ...prev, zoom: Math.min(3, Math.round((prev.zoom + 0.5) * 10) / 10) }));
    const zoomOut = () => setLightbox(prev => ({ ...prev, zoom: Math.max(1, Math.round((prev.zoom - 0.5) * 10) / 10) }));
    const resetZoom = () => setLightbox(prev => ({ ...prev, zoom: 1 }));
    const prev = () => {
        setLightbox(prev => ({
            ...prev,
            zoom: 1,
            index: (prev.index - 1 + filteredImages.length) % filteredImages.length
        }));
    };
    const next = () => {
        setLightbox(prev => ({
            ...prev,
            zoom: 1,
            index: (prev.index + 1) % filteredImages.length
        }));
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-14 font-sans text-slate-900">
            {/* Cinematic Premium Hero Section */}
            <div className="relative h-[60dvh] flex items-center overflow-hidden bg-slate-900">
                <img src="/images/sumut/sumatra_panorama.webp" alt="Gallery Hero" className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 transition-transform duration-[20s]" fetchPriority="high" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pt-10">
                    <div className="max-w-4xl animate-fade-in-up">
                        <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-4">
                            <Link href="/" className="hover:text-white transition">Beranda</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">Galeri</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-toba-green/20 backdrop-blur-md border border-toba-green/30 text-toba-green text-[10px] font-black uppercase tracking-[0.25em] rounded-full">
                                Visual Storytelling
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6">
                            Galeri <br />
                            <span className="text-toba-green">Momen Indah</span>
                        </h1>
                        <p className="text-slate-200 text-sm md:text-lg font-light max-w-2xl leading-relaxed">
                            Setiap jepretan adalah cerita yang menanti untuk dijelajahi. Lihat keindahan Sumatera Utara melalui mata para petualang kami.
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Filter & Search Bar */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 -mt-16 relative z-30">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-slate-200 animate-fade-in-up duration-1000">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Filters */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-2.5">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition duration-300 whitespace-nowrap cursor-pointer hover:-translate-y-0.5 ${activeCategory === cat ? 'bg-slate-900 text-white shadow-lg border-slate-900' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        
                        {/* Search Box */}
                        <div className="relative group w-full lg:w-80">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-toba-green transition-colors pointer-events-none flex items-center">
                                <span className="material-symbols-outlined text-xl">search</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Cari foto atau momen..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-toba-green/40 focus:border-toba-green font-sans text-slate-900 placeholder:text-slate-400 text-sm outline-none transition"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Masonry Gallery Grid */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 mt-8 md:mt-10">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Koleksi <span className="text-toba-green">Visual</span></h2>
                        <p className="text-slate-500 font-light text-xs mt-1">
                            Menampilkan <span className="text-toba-green font-bold">{filteredImages.length}</span> mahakarya alam Sumatera Utara
                        </p>
                    </div>
                </div>

                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 md:gap-8 space-y-5 md:space-y-8">
                    {images.map(img => {
                        const isVisible = (activeCategory === 'Semua' || img.category === activeCategory) &&
                            (!searchQuery || (img.caption && img.caption.toLowerCase().includes(searchQuery.toLowerCase())) || (img.category && img.category.toLowerCase().includes(searchQuery.toLowerCase())));
                        
                        if (!isVisible) return null;

                        return (
                            <div
                                key={img.id}
                                className="break-inside-avoid relative rounded-3xl overflow-hidden group cursor-pointer shadow-lg transition duration-[0.6s] border border-slate-200 hover:border-toba-green/40 hover:-translate-y-1 bg-white"
                                onClick={() => openLightbox(img.id)}
                            >
                                <img
                                    src={img.image_url}
                                    alt={img.caption}
                                    className="w-full object-cover transform group-hover:scale-[1.03] transition-transform duration-[2s] ease-out"
                                    loading="lazy"
                                    decoding="async"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 flex flex-col justify-end p-6">
                                    <div className="transform translate-y-4 group-hover:translate-y-0 transition duration-[0.4s]">
                                        {img.category && (
                                            <span className="inline-block px-3 py-1 bg-toba-green text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-3 shadow-sm">{img.category}</span>
                                        )}
                                        {img.caption && (
                                            <p className="text-white text-base font-bold leading-tight tracking-tight mb-2">{img.caption}</p>
                                        )}
                                        <div className="flex items-center gap-1 text-toba-green text-[9px] font-black uppercase tracking-widest">
                                            <span className="material-symbols-outlined text-sm">visibility</span>
                                            Lihat Detail
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-6 right-6 scale-0 group-hover:scale-100 transition duration-300 delay-75">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-lg">
                                        <span className="material-symbols-outlined text-lg">fullscreen</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredImages.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl animate-fade-in-up duration-700 mt-8">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                            <span className="material-symbols-outlined text-3xl font-light">image_not_supported</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Koleksi Belum Ditemukan</h3>
                        <p className="text-slate-500 text-xs font-light max-w-xs mx-auto mb-8 leading-relaxed">Kami belum menemukan foto yang sesuai dengan filter atau kata kunci Anda. Cobalah kategori lain atau kata kunci yang lebih umum.</p>
                        <button onClick={() => { setActiveCategory('Semua'); setSearchQuery(''); }}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer">
                            Reset Galeri
                        </button>
                    </div>
                )}
            </div>

            {/* Lightbox Overlay */}
            {lightbox.open && (
                <div 
                    className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6 md:p-12 transition-opacity duration-300"
                    onClick={closeLightbox}
                >
                    <div className="absolute top-[max(1.5rem,env(safe-area-inset-top))] right-6 flex items-center gap-2 z-[210]">
                        <div className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-1 gap-1 border border-white/10">
                            <button type="button" onClick={(e) => { e.stopPropagation(); zoomOut(); }} disabled={lightbox.zoom <= 1}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95">
                                <span className="material-symbols-outlined text-lg">zoom_out</span>
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                                    className="px-2 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold text-white hover:bg-white/20 transition active:scale-95">
                                <span>{Math.round(lightbox.zoom * 100)}%</span>
                            </button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); zoomIn(); }} disabled={lightbox.zoom >= 3}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition active:scale-95">
                                <span className="material-symbols-outlined text-lg">zoom_in</span>
                            </button>
                        </div>
                        <button onClick={closeLightbox}
                            className="w-11 h-11 bg-white/10 hover:bg-red-600 hover:text-white rounded-xl flex items-center justify-center text-white transition border border-white/10 group cursor-pointer active:scale-95">
                            <span className="material-symbols-outlined text-2xl group-hover:rotate-90 transition-transform duration-500">close</span>
                        </button>
                    </div>

                    <div className="absolute top-6 left-6 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-xl text-white text-[10px] font-black uppercase tracking-widest z-[210] hidden md:block">
                        FOTO <span className="text-toba-green text-base font-bold">{lightbox.index + 1}</span> DARI <span className="text-base font-bold opacity-40">{filteredImages.length}</span>
                    </div>

                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-3 md:px-12 pointer-events-none z-[210]">
                        <button onClick={(e) => { e.stopPropagation(); prev(); }}
                            className="w-11 h-11 md:w-14 md:h-14 bg-white/5 hover:bg-toba-green hover:text-white backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition pointer-events-auto border border-white/10 shadow-lg group cursor-pointer">
                            <span className="material-symbols-outlined text-2xl group-hover:-translate-x-0.5 transition-transform">chevron_left</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); next(); }}
                            className="w-11 h-11 md:w-14 md:h-14 bg-white/5 hover:bg-toba-green hover:text-white backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition pointer-events-auto border border-white/10 shadow-lg group cursor-pointer">
                            <span className="material-symbols-outlined text-2xl group-hover:translate-x-0.5 transition-transform">chevron_right</span>
                        </button>
                    </div>

                    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center p-6 md:p-14">
                            <img
                                src={filteredImages[lightbox.index].image_url}
                                className="max-w-full max-h-[70vh] object-contain rounded-3xl shadow-2xl border border-white/10 transition-transform duration-200"
                                style={{ transform: `scale(${lightbox.zoom})`, cursor: lightbox.zoom > 1 ? 'zoom-out' : 'zoom-in' }}
                                onClick={(e) => { e.stopPropagation(); lightbox.zoom > 1 ? resetZoom() : zoomIn(); }}
                            />
                            <div className="mt-8 text-center max-w-2xl animate-fade-in-up duration-500">
                                <div className="flex items-center justify-center gap-3 mb-3">
                                    <span className="px-4 py-1.5 bg-toba-green text-white text-[9px] font-black uppercase tracking-wider rounded-lg shadow-sm">{filteredImages[lightbox.index].category}</span>
                                </div>
                                <h4 className="text-white text-xl md:text-3xl font-normal tracking-tight leading-tight">{filteredImages[lightbox.index].caption}</h4>
                                
                                {(filteredImages[lightbox.index].type === 'package' || filteredImages[lightbox.index].type === 'blog') && (
                                    <div className="mt-6">
                                        <Link href={filteredImages[lightbox.index].type === 'package' ? `/tour/${filteredImages[lightbox.index].slug}` : `/tour/blog/${filteredImages[lightbox.index].slug}`} 
                                           className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-toba-green hover:text-white transition shadow-md">
                                            <span className="material-symbols-outlined text-sm">open_in_new</span>
                                            {filteredImages[lightbox.index].type === 'package' ? 'Lihat Paket Wisata' : 'Baca Artikel Selengkapnya'}
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
