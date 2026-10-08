"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

export default function Navbar() {
    const pathname = usePathname();
    const isHome = pathname === '/';
    const isPkg = pathname?.startsWith('/tour/packages') || pathname?.startsWith('/tour/package/');

    const [scrolled, setScrolled] = useState(false);
    const [openLangTop, setOpenLangTop] = useState(false);
    const [openLangMobile, setOpenLangMobile] = useState(false);
    const [openPkgDropdown, setOpenPkgDropdown] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 24);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const officeAddress = 'Jl. Trimurti 109, Berastagi, Kabupaten Karo';
    const contact = {
        phone: '+62 821 6688 9988',
        whatsapp: '6282166889988'
    };
    
    const socials = {
        facebook: 'https://facebook.com/sumateraexplore',
        instagram: 'https://instagram.com/sumateraexplore',
    };

    const activeLocale = 'id';
    const locales: Record<string, string> = {
        my: '🇲🇾 MYR (Melayu)',
        id: '🇮🇩 IDR (Indonesia)',
        en: '🇸🇬 SGD (English)',
    };
    const localeShort: Record<string, string> = { my: '🇲🇾 MYR', id: '🇮🇩 IDR', en: '🇸🇬 SGD' };

    const navLinks = [
        { label: 'Tentang Kami', url: '/about', active: pathname === '/about' },
        { label: 'Blog', url: '/tour/blog', active: pathname?.startsWith('/tour/blog') },
        { label: 'Lacak Booking', url: '/track-booking', active: pathname?.startsWith('/track-booking') },
    ];

    const mobileNav = [
        { label: 'Home', url: '/', active: isHome },
        { label: 'Paket Wisata Toba', url: '/tour/packages', active: isPkg },
        ...navLinks
    ];

    // Dummy categories for now
    const navPackages = [
        { slug: 'danau-toba-3-hari-2-malam', translated_name: 'Danau Toba 3 Hari 2 Malam', duration: '3 Hari 2 Malam' },
        { slug: 'danau-toba-4-hari-3-malam', translated_name: 'Danau Toba 4 Hari 3 Malam', duration: '4 Hari 3 Malam' },
    ];

    return (
        <header className="relative w-full font-sans z-[100]">
            {/* Topbar (Minimalist Dark) */}
            <div className="hidden sm:block bg-slate-900 text-slate-300">
                <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center gap-6 py-2.5 text-[11.5px] tracking-wide">
                    <div className="flex items-center gap-4 min-w-0">
                        {/* Lokasi Kantor */}
                        <div className="flex items-center gap-2 min-w-0 opacity-90 hover:opacity-100 hover:text-white transition-all">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span className="truncate">{ officeAddress }</span>
                        </div>
                        <span className="w-px h-3 bg-slate-700 hidden md:block" aria-hidden="true"></span>
                        {/* Kontak Telepon */}
                        <a href={`tel:+${contact.whatsapp}`} className="hidden md:flex items-center gap-1.5 opacity-90 hover:opacity-100 hover:text-white transition-all text-green-400 font-semibold shrink-0">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            <span>{ contact.phone }</span>
                        </a>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-3">
                            {Object.entries(socials).map(([name, url]) => (
                                <a key={name} href={url} target="_blank" rel="noopener noreferrer"
                                   className="text-slate-400 hover:text-white transition-colors duration-200">
                                    <Icon name={name} className="w-3.5 h-3.5" />
                                </a>
                            ))}
                        </div>
                        <span className="w-px h-3 bg-slate-700" aria-hidden="true"></span>

                        {/* Topbar Language Dropdown */}
                        <div className="relative z-[130]">
                            <button onClick={() => setOpenLangTop(!openLangTop)} type="button"
                                    aria-expanded={openLangTop} aria-haspopup="true"
                                    className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 font-semibold uppercase tracking-wider">
                                <span>{ localeShort[activeLocale] }</span>
                                <svg className={`w-3 h-3 transition-transform duration-200 ${openLangTop ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 9l-7 7-7-7"/></svg>
                            </button>
                            {openLangTop && (
                                <>
                                    <div className="fixed inset-0 z-[190]" onClick={() => setOpenLangTop(false)}></div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white text-slate-700 rounded-lg shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 py-1 text-xs font-medium overflow-hidden z-[200]">
                                        {Object.entries(locales).map(([code, label]) => (
                                            <Link key={code} href={`/`} onClick={() => setOpenLangTop(false)}
                                               className={`flex items-center justify-between gap-2 px-4 py-2.5 transition-colors hover:bg-slate-50 ${activeLocale === code ? 'text-toba-green font-semibold bg-slate-50' : 'text-slate-600'}`}>
                                                <span>{ label }</span>
                                                {activeLocale === code && (
                                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Nav Putih */}
            <nav className={`sticky top-0 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300 z-[120] ${scrolled ? 'shadow-md' : ''}`}>
                <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className={`flex justify-between items-center gap-4 transition-all duration-300 ${scrolled ? 'py-2.5' : 'py-3 md:py-3.5'}`}>
                        {/* Logo */}
                        <Link href="/" className="group flex items-baseline gap-1 shrink-0 mr-4 focus-visible:outline-none rounded">
                            <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none transition-colors duration-300 group-hover:text-toba-green">Sumatera Explore</span>
                        </Link>

                        {/* Nav Links Desktop */}
                        <div className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-slate-500">
                            <Link href="/" aria-current={isHome ? "page" : undefined}
                               className={`group relative py-1 transition-colors duration-300 ${isHome ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'}`}>
                                Home
                                <span className={`absolute left-1/2 -bottom-1 h-[2px] rounded-full bg-slate-900 transition-all duration-300 ease-out -translate-x-1/2 ${isHome ? 'w-4' : 'w-0 group-hover:w-4'}`}></span>
                            </Link>

                            {/* Dropdown Paket */}
                            <div onMouseEnter={() => setOpenPkgDropdown(true)} onMouseLeave={() => setOpenPkgDropdown(false)} className="relative">
                                <Link href="/tour/packages" aria-current={isPkg ? "page" : undefined}
                                   aria-expanded={openPkgDropdown}
                                   className={`group relative flex items-center gap-1.5 py-1 transition-colors duration-300 ${isPkg ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'}`}>
                                    <span>Paket Wisata Toba</span>
                                    <svg className={`w-3.5 h-3.5 transition-transform duration-300 text-slate-400 group-hover:text-slate-900 ${openPkgDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                                    <span className={`absolute left-1/2 -bottom-1 h-[2px] rounded-full bg-slate-900 transition-all duration-300 ease-out -translate-x-1/2 ${isPkg ? 'w-4' : 'w-0 group-hover:w-4'}`}></span>
                                </Link>
                                
                                {openPkgDropdown && (
                                    <div className="absolute left-0 top-full pt-4 w-72 z-[200]">
                                        <div className="bg-white rounded-xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-100 p-2 overflow-hidden">
                                            <Link href="/tour/packages" className="block px-4 py-2.5 text-[13px] font-semibold text-slate-800 rounded-lg hover:bg-slate-50 transition-colors">Semua Paket Tour</Link>
                                            <div className="my-2 border-t border-slate-100"></div>
                                            <div className="max-h-[60vh] overflow-y-auto space-y-0.5">
                                                {navPackages.map((navPkg, index) => (
                                                    <Link key={index} href={`/tour/package/${navPkg.slug}`}
                                                       className="block px-4 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group/item">
                                                        <span className="block text-[13px] font-medium text-slate-700 group-hover/item:text-slate-900">{ navPkg.translated_name }</span>
                                                        <span className="block mt-0.5 text-[11px] text-slate-400">{ navPkg.duration }</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {navLinks.map((link, index) => (
                                <Link key={index} href={link.url} aria-current={link.active ? "page" : undefined}
                                   className={`group relative py-1 transition-colors duration-300 ${link.active ? 'text-slate-900 font-semibold' : 'hover:text-slate-900'}`}>
                                    { link.label }
                                    <span className={`absolute left-1/2 -bottom-1 h-[2px] rounded-full bg-slate-900 transition-all duration-300 ease-out -translate-x-1/2 ${link.active ? 'w-4' : 'w-0 group-hover:w-4'}`}></span>
                                </Link>
                            ))}
                        </div>

                        <div className="hidden lg:flex items-center gap-3 shrink-0 ml-6">
                            <Link href="/tour/packages"
                               className="relative p-2 rounded-full text-slate-600 hover:text-red-500 hover:bg-slate-50 transition"
                               title="Paket Tersimpan"
                               aria-label="Paket Tersimpan">
                                <span className="material-symbols-outlined text-[22px]" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                            </Link>

                            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
                               className="group inline-flex items-center gap-2.5 border border-toba-green text-toba-green hover:bg-toba-green hover:text-white px-6 py-2.5 rounded-full font-medium text-[13.5px] tracking-wide transition-all duration-300">
                                <span>Hubungi Kami</span>
                                <Icon name="whatsapp" className="w-3 h-3 transition-transform duration-300 group-hover:scale-110" />
                            </a>
                        </div>

                        {/* Mobile Actions */}
                        <div className="lg:hidden flex items-center gap-2 shrink-0">
                            <Link href="/tour/packages"
                               className="relative w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:text-red-500 flex items-center justify-center border border-slate-200 active:scale-95 transition-all"
                               title="Paket Tersimpan" aria-label="Paket Tersimpan">
                                <span className="material-symbols-outlined text-[16px]" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                            </Link>

                            <a href={`tel:+${contact.whatsapp}`}
                               className="w-8 h-8 rounded-full bg-green-50 text-green-700 flex items-center justify-center border border-green-200 active:scale-95 transition-all"
                               title="Telepon Langsung" aria-label="Telepon Kami">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                            </a>

                            {/* Mobile Language Dropdown */}
                            <div className="sm:hidden relative">
                                <button onClick={() => setOpenLangMobile(!openLangMobile)} type="button"
                                        aria-expanded={openLangMobile} aria-haspopup="true"
                                        aria-label="Pilih bahasa & mata uang"
                                        className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 active:scale-95 transition-all">
                                    <span>{ localeShort[activeLocale] }</span>
                                    <svg className={`w-2.5 h-2.5 text-slate-400 transition-transform duration-200 ${openLangMobile ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 9l-7 7-7-7"/></svg>
                                </button>
                                {openLangMobile && (
                                    <>
                                        <div className="fixed inset-0 z-[190]" onClick={() => setOpenLangMobile(false)}></div>
                                        <div className="absolute right-0 mt-2 w-48 bg-white text-slate-700 rounded-xl shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 py-1 text-[13px] font-medium overflow-hidden z-[200]">
                                            {Object.entries(locales).map(([code, label]) => (
                                                <Link key={code} href={`/`} onClick={() => setOpenLangMobile(false)}
                                                   className={`flex items-center justify-between gap-2 px-4 py-3 transition-colors hover:bg-slate-50 ${activeLocale === code ? 'text-toba-green font-semibold bg-slate-50' : 'text-slate-600'}`}>
                                                    <span>{ label }</span>
                                                    {activeLocale === code && (
                                                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                                                    )}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer"
                               aria-label="Hubungi Kami"
                               className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center active:scale-95 transition-transform">
                                <Icon name="whatsapp" className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Strip menu mobile */}
                <div className="lg:hidden border-t border-slate-100 overflow-x-auto no-scrollbar overscroll-x-contain">
                    <ul className="flex items-stretch whitespace-nowrap px-4 sm:px-6 gap-7 sm:gap-9 justify-start sm:justify-center">
                        {mobileNav.map((link, index) => (
                            <li key={index}>
                                <Link href={link.url} aria-current={link.active ? "page" : undefined}
                                   className={`relative flex items-center py-3 text-[10.5px] font-bold uppercase tracking-[0.14em] transition-colors ${link.active ? 'text-toba-green' : 'text-slate-500 hover:text-slate-900'}`}>
                                    { link.label }
                                    {link.active && (
                                        <span className="absolute inset-x-0 bottom-0 h-[2px] rounded-full bg-toba-green"></span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}
