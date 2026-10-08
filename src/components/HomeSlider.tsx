"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface SlideProps {
    image_url: string;
    image_webp?: string;
    alt?: string;
    cta_link: string;
    cta_text: string;
}

export default function HomeSlider({ slides = [] }: { slides?: SlideProps[] }) {
    const [active, setActive] = useState(0);
    const total = slides.length;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [touchStartX, setTouchStartX] = useState(0);

    const defaultSlides = [
        {
            image_url: '/images/sumut/toba_hero.webp',
            image_webp: '/images/sumut/toba_hero.webp',
            alt: 'Sumatera Explore - Danau Toba',
            cta_text: 'Book Now!',
            cta_link: '/tour/packages',
        },
        {
            image_url: '/images/sumut/sumatra_panorama.webp',
            image_webp: '/images/sumut/sumatra_panorama.webp',
            alt: 'Sumatera Explore - Wisata Toba',
            cta_text: 'Book Now!',
            cta_link: '/tour/packages',
        }
    ];

    const activeSlides = slides.length > 0 ? slides : defaultSlides;
    const activeTotal = activeSlides.length;

    const next = () => setActive((prev) => (prev + 1) % activeTotal);
    const prev = () => setActive((prev) => (prev - 1 + activeTotal) % activeTotal);

    const goTo = (i: number) => {
        setActive(i);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(next, 5500);
    };

    useEffect(() => {
        if (activeTotal > 1) {
            timerRef.current = setInterval(next, 5500);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [activeTotal]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.changedTouches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const dx = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(dx) > 50) {
            if (dx > 0) next();
            else prev();
        }
    };

    return (
        <section 
            className="relative w-full overflow-hidden bg-black h-[calc(100vh-115px)] min-h-[480px] max-h-[880px] max-md:h-[65svh] max-md:min-h-[360px] max-md:max-h-[650px]"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {activeSlides.map((slide, idx) => (
                <div 
                    key={idx}
                    className="absolute inset-0 w-full h-full transition-opacity duration-900 ease-in-out"
                    style={{
                        opacity: active === idx ? 1 : 0,
                        zIndex: active === idx ? 12 : 5
                    }}
                >
                    <picture>
                        {slide.image_webp && <source srcSet={slide.image_webp} type="image/webp" />}
                        <img 
                            src={slide.image_url} 
                            alt={slide.alt || 'Sumatera Explore'}
                            loading={idx === 0 ? 'eager' : 'lazy'}
                            fetchPriority={idx === 0 ? 'high' : 'auto'}
                            className="w-full h-full object-cover object-center block"
                        />
                    </picture>
                    <div className="absolute inset-0 z-[2] bg-gradient-to-b from-black/10 via-black/20 to-black/70"></div>
                    <div className="absolute bottom-[78px] max-md:bottom-[132px] left-0 right-0 flex justify-center z-[35]">
                        <Link href={slide.cta_link} className="inline-flex items-center gap-2 bg-gradient-to-br from-[#E67E22] to-[#D35400] text-white font-extrabold px-14 py-4 max-md:px-9 max-md:py-3 max-md:text-[12px] rounded-full tracking-[0.15em] uppercase text-[14px] shadow-[0_10px_30px_rgba(230,126,34,0.5)] hover:shadow-[0_15px_40px_rgba(230,126,34,0.7)] hover:-translate-y-0.5 hover:scale-105 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] animate-[pulse-glow_3s_infinite]">
                            {slide.cta_text}
                        </Link>
                    </div>
                </div>
            ))}

            {activeTotal > 1 && (
                <>
                    <button onClick={prev} aria-label="Slide sebelumnya" className="absolute left-4 top-1/2 -translate-y-1/2 z-[40] w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center border-[1.5px] border-white/25 cursor-pointer backdrop-blur-md transition-all hover:bg-[#E67E22]/80 hover:scale-110 -mt-[30px] hidden sm:flex">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <button onClick={next} aria-label="Slide berikutnya" className="absolute right-4 top-1/2 -translate-y-1/2 z-[40] w-11 h-11 rounded-full bg-black/40 text-white flex items-center justify-center border-[1.5px] border-white/25 cursor-pointer backdrop-blur-md transition-all hover:bg-[#E67E22]/80 hover:scale-110 -mt-[30px] hidden sm:flex">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>

                    <div className="absolute bottom-[70px] max-md:bottom-[82px] left-1/2 -translate-x-1/2 z-[40] flex gap-2 items-center">
                        {activeSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => goTo(idx)}
                                aria-label={`Slide ${idx + 1}`}
                                className={`h-1.5 rounded-full border-none cursor-pointer transition-all duration-350 ${active === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/45'}`}
                            ></button>
                        ))}
                    </div>
                </>
            )}

            <div className="absolute bottom-0 left-0 right-0 z-[30] bg-white/5 backdrop-blur-md border-t border-white/15 flex items-stretch justify-center max-sm:flex-wrap">
                <div className="flex items-center gap-2.5 px-6 max-sm:px-2.5 py-3 max-sm:py-2.5 text-white flex-1 justify-center border-r border-white/10 max-sm:border-r-0 max-sm:border-b max-sm:flex-[0_0_50%] max-sm:max-w-[50%] max-sm:justify-start">
                    <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 rounded-full bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[0_4px_10px_rgba(230,126,34,0.3)] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" className="max-sm:w-4 max-sm:h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-[11px] max-sm:text-[10px] uppercase tracking-[0.08em] max-sm:tracking-[0.04em] leading-tight text-shadow-sm">Booking Mudah</p>
                        <p className="text-[10px] max-sm:text-[9px] text-white/70 leading-tight truncate">Tanpa Ribet</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 px-6 max-sm:px-2.5 py-3 max-sm:py-2.5 text-white flex-1 justify-center border-r border-white/10 max-sm:border-r-0 max-sm:border-b max-sm:flex-[0_0_50%] max-sm:max-w-[50%] max-sm:justify-start">
                    <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 rounded-full bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[0_4px_10px_rgba(230,126,34,0.3)] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" className="max-sm:w-4 max-sm:h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-[11px] max-sm:text-[10px] uppercase tracking-[0.08em] max-sm:tracking-[0.04em] leading-tight text-shadow-sm">Proses Cepat</p>
                        <p className="text-[10px] max-sm:text-[9px] text-white/70 leading-tight truncate">CS 24/7 Fast Respon</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 px-6 max-sm:px-2.5 py-3 max-sm:py-2.5 text-white flex-1 justify-center border-r border-white/10 max-sm:border-r-0 max-sm:border-b-0 max-sm:flex-[0_0_50%] max-sm:max-w-[50%] max-sm:justify-start">
                    <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 rounded-full bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[0_4px_10px_rgba(230,126,34,0.3)] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" className="max-sm:w-4 max-sm:h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-[11px] max-sm:text-[10px] uppercase tracking-[0.08em] max-sm:tracking-[0.04em] leading-tight text-shadow-sm">Banyak Pilihan</p>
                        <p className="text-[10px] max-sm:text-[9px] text-white/70 leading-tight truncate">Paket Fleksibel</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 px-6 max-sm:px-2.5 py-3 max-sm:py-2.5 text-white flex-1 justify-center max-sm:border-r-0 max-sm:border-b-0 max-sm:flex-[0_0_50%] max-sm:max-w-[50%] max-sm:justify-start">
                    <div className="w-9 h-9 max-sm:w-7 max-sm:h-7 rounded-full bg-gradient-to-br from-[#E67E22] to-[#D35400] shadow-[0_4px_10px_rgba(230,126,34,0.3)] flex items-center justify-center shrink-0">
                        <svg width="18" height="18" className="max-sm:w-4 max-sm:h-4" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <div className="min-w-0">
                        <p className="font-extrabold text-[11px] max-sm:text-[10px] uppercase tracking-[0.08em] max-sm:tracking-[0.04em] leading-tight text-shadow-sm">Harga Terbaik</p>
                        <p className="text-[10px] max-sm:text-[9px] text-white/70 leading-tight truncate">Terjangkau &amp; Premium</p>
                    </div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes pulse-glow {
                    0%   { box-shadow: 0 10px 30px rgba(230,126,34,0.5), 0 0 0 0 rgba(230,126,34,0.4); }
                    50%  { box-shadow: 0 10px 30px rgba(230,126,34,0.5), 0 0 0 15px rgba(230,126,34,0); }
                    100% { box-shadow: 0 10px 30px rgba(230,126,34,0.5), 0 0 0 0 rgba(230,126,34,0); }
                }
            `}</style>
        </section>
    );
}
