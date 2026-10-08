"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    image_url: string;
    createdAt: string;
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
    const [activeCategory, setActiveCategory] = useState('Semua');
    const [searchQuery, setSearchQuery] = useState('');
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

    const categories = ['Semua', ...Array.from(new Set(posts.map(p => p.category).filter(Boolean)))];

    const filteredPosts = posts.filter(p => {
        const cat = activeCategory === 'Semua' || p.category === activeCategory;
        const q = searchQuery.trim().toLowerCase();
        const searchMatch = !q || (p.title && p.title.toLowerCase().includes(q)) || (p.excerpt && p.excerpt.toLowerCase().includes(q));
        return cat && searchMatch;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const featured = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const restPosts = filteredPosts.slice(1);

    return (
        <div className="bg-slate-50 min-h-screen pb-14 font-sans text-slate-900 selection:bg-toba-green/20 selection:text-toba-green">
            {/* Cinematic Premium Hero Section */}
            <div className="relative h-[60dvh] flex items-center overflow-hidden bg-slate-900">
                <img src="/images/sumut/sumatra_panorama.webp" alt="Blog Hero" className="absolute inset-0 w-full h-full object-cover opacity-45 scale-105 transition-transform duration-[20s]" fetchPriority="high" decoding="async" />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent"></div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pt-10">
                    <div className="max-w-4xl">
                        <div className="text-white/80 text-[10px] uppercase tracking-widest font-bold mb-4">
                            <Link href="/" className="hover:text-white transition">Beranda</Link>
                            <span className="mx-2">/</span>
                            <span className="text-white">Blog</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-4 animate-fade-in-down">
                            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-toba-green/20 backdrop-blur-md border border-toba-green/30 text-toba-green text-[10px] font-black uppercase tracking-[0.25em] rounded-full">
                                JOURNAL & STORIES
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight leading-[1.05] mb-6 animate-fade-in-up">
                            Inspirasi & <br />
                            <span className="text-toba-green">Eksplorasi Toba</span>
                        </h1>
                        <p className="text-slate-200 text-sm md:text-lg font-light max-w-2xl leading-relaxed animate-fade-in-up delay-100">
                            Temukan tips, panduan mendalam, dan cerita inspiratif dari setiap sudut Sumatera Utara untuk menemani rencana petualangan Anda.
                        </p>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="max-w-7xl mx-auto px-5 md:px-8 -mt-16 relative z-30">
                <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-6 border border-slate-200 animate-fade-in-up duration-1000 delay-300">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Category Filters */}
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
                                placeholder="Cari topik atau artikel..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-toba-green/40 focus:border-toba-green font-sans text-slate-900 placeholder:text-slate-400 text-sm outline-none transition"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-5 md:px-8 mt-8 md:mt-10">
                {/* Featured Post */}
                {featured && (
                    <article className="group relative bg-slate-900 rounded-3xl md:rounded-[2.5rem] overflow-hidden shadow-2xl transition duration-700 mb-6 md:mb-10 min-h-[420px] md:min-h-[550px] flex flex-col justify-end border border-slate-200/20">
                        <img src={featured.image_url} alt={featured.title}
                            fetchPriority="high" decoding="async"
                            className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-[2s] ease-out" />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 to-transparent"></div>

                        <div className="relative z-10 p-8 md:p-16 max-w-3xl animate-fade-in-up duration-1000">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white mb-6">
                                {featured.category && (
                                    <span className="px-4 py-1.5 bg-toba-green text-white rounded-full text-[9px]">{featured.category}</span>
                                )}
                                <span className="text-slate-200/80 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                    <time dateTime={featured.createdAt.split('T')[0]}>{formatDate(featured.createdAt)}</time>
                                </span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-5 md:mb-6 group-hover:text-toba-green transition-colors leading-[1.1] tracking-tight">{featured.title}</h2>
                            <p className="text-slate-200 text-sm md:text-base font-light mb-8 line-clamp-2 leading-relaxed opacity-90">{featured.excerpt}</p>

                            <Link href={`/tour/blog/${featured.slug}`} className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-toba-green hover:text-white transition duration-300 shadow-md hover:-translate-y-0.5 group/btn">
                                <span>Baca Cerita Lengkap</span>
                                <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover/btn:translate-x-1">arrow_forward</span>
                            </Link>
                        </div>
                    </article>
                )}

                {/* Blog Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {restPosts.map((post, i) => (
                        <article key={post.id}
                                 className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-200 hover:border-toba-green/30 transition duration-500 hover:-translate-y-1.5 animate-fade-in-up duration-1000"
                                 style={{ animationDelay: `${i * 100}ms` }}>
                            <Link href={`/tour/blog/${post.slug}`} className="block relative overflow-hidden h-64">
                                <img src={post.image_url} alt={post.title}
                                    loading="lazy" decoding="async"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s] ease-out" />
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-slate-900/0 transition-colors"></div>
                                {post.category && (
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/95 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">{post.category}</span>
                                    </div>
                                )}
                            </Link>

                            <div className="flex-1 flex flex-col p-8">
                                <div className="flex items-center gap-1.5 text-toba-green text-[9px] font-black uppercase tracking-widest mb-3">
                                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                                    <time dateTime={post.createdAt.split('T')[0]}>{formatDate(post.createdAt)}</time>
                                </div>
                                <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-toba-green transition-colors leading-tight line-clamp-2 tracking-tight">{post.title}</h2>
                                <p className="text-slate-500 text-xs leading-relaxed mb-6 line-clamp-3 font-light flex-grow">{post.excerpt}</p>

                                <div className="pt-6 border-t border-slate-100 mt-auto">
                                    <Link href={`/tour/blog/${post.slug}`} className="inline-flex items-center gap-2 text-slate-900 font-black text-[10px] uppercase tracking-widest group/link hover:text-toba-green transition-colors">
                                        <span>Baca Selengkapnya</span>
                                        <span className="material-symbols-outlined text-sm transition-transform duration-300 group-hover/link:translate-x-1">arrow_forward</span>
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-[2.5rem] border border-slate-200 shadow-xl animate-fade-in-up duration-700">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                            <span className="material-symbols-outlined text-3xl font-light">menu_book</span>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">Artikel Belum Tersedia</h3>
                        <p className="text-slate-500 text-xs font-light max-w-xs mx-auto mb-8 leading-relaxed">Kami sedang menyusun cerita perjalanan menarik untuk Anda. Silakan coba kategori lain atau reset pencarian.</p>
                        <button onClick={() => { setActiveCategory('Semua'); setSearchQuery(''); }}
                            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition duration-300 shadow-md hover:-translate-y-0.5 cursor-pointer">
                            Reset Jurnal
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
