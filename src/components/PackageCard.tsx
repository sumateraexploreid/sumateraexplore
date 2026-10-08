"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface PackageProps {
    id: string | number;
    slug: string;
    name: string;
    translated_name?: string;
    locationTag?: string;
    duration?: string;
    price: number;
    childPrice?: number | null;
    isFeatured?: boolean;
    image_url: string;
    pricingDetails?: any;
    includes?: string[];
    excludes?: string[];
    itinerary?: any[];
}

export default function PackageCard({ pkg, locationName = 'Sumatera Utara' }: { pkg: PackageProps, locationName?: string }) {
    const displayLocation = pkg.locationTag || locationName;
    const name = pkg.translated_name || pkg.name || 'Paket Tour';
    const image = pkg.image_url || '/images/home/tour.webp';
    const slug = pkg.slug || pkg.id.toString();
    
    const [paxAdults, setPaxAdults] = useState(2);
    const [paxChildren, setPaxChildren] = useState(0);
    const [isWishlist, setIsWishlist] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    
    // Simplistic pax calc (assumes flat rate for now, can be expanded to tiers)
    const basePrice = pkg.price || 0;
    const childPrice = pkg.childPrice !== null && pkg.childPrice !== undefined ? pkg.childPrice : basePrice * 0.75;
    const totalPrice = (paxAdults * basePrice) + (paxChildren * childPrice);
    
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-xl transition-all duration-300 h-full">
            <Link href={`/tour/${slug}`} className="flex flex-col flex-grow">
                <div className="relative aspect-[4/3] overflow-hidden shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                        decoding="async"
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                        {pkg.isFeatured && (
                            <span className="inline-flex items-center gap-1 bg-toba-orange text-white text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
                                🔥 Terpopuler
                            </span>
                        )}
                    </div>
                    {pkg.duration && (
                        <div className="absolute top-3 right-3 z-10">
                            <span className="bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-medium px-2.5 py-1 rounded-full">
                                {pkg.duration}
                            </span>
                        </div>
                    )}

                    <button type="button"
                            onClick={(e) => { e.preventDefault(); setIsWishlist(!isWishlist); }}
                            aria-label="Simpan paket ke favorit"
                            className={`absolute bottom-3 right-3 z-20 w-8 h-8 rounded-full shadow-md backdrop-blur-sm flex items-center justify-center transition active:scale-90 select-none cursor-pointer ${isWishlist ? 'text-red-500 bg-white' : 'bg-white/90 hover:bg-white text-slate-600'}`}>
                        <span className="material-symbols-outlined text-[17px]" style={{fontVariationSettings: "'FILL' 1"}}>favorite</span>
                    </button>
                </div>

                <div className="flex flex-col flex-grow px-5 pt-4 pb-3">
                    <p className="flex items-center gap-1 text-slate-400 text-[10.5px] font-medium uppercase tracking-widest mb-2 truncate">
                        <svg className="w-3 h-3 shrink-0 text-toba-green" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                        <span>{displayLocation}</span>
                    </p>
                    <h3 className="text-slate-900 font-semibold text-[15px] leading-snug line-clamp-2 flex-grow group-hover:text-toba-green transition-colors duration-200">
                        {name}
                    </h3>
                </div>
            </Link>

            {/* Package Details Accordion */}
            <div className="border-t border-slate-100">
                <button onClick={() => setDetailsOpen(!detailsOpen)} className="w-full px-5 py-3 flex justify-between items-center text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                    <span>Ringkasan Paket</span>
                    <span className={`material-symbols-outlined text-[18px] transition-transform ${detailsOpen ? 'rotate-180' : ''}`}>expand_more</span>
                </button>
                {detailsOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-500 space-y-2 bg-slate-50">
                        {(pkg.includes && pkg.includes.length > 0) ? (
                            <ul className="list-disc pl-4 space-y-1">
                                {pkg.includes.slice(0, 3).map((inc, i) => (
                                    <li key={i}>{inc}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>Tidak ada rincian tambahan.</p>
                        )}
                        <Link href={`/tour/${slug}`} className="text-toba-green font-medium underline mt-2 inline-block">Lihat selengkapnya</Link>
                    </div>
                )}
            </div>

            {/* Pax Calc */}
            <div className="bg-slate-50 px-5 py-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs text-slate-500 font-medium">Estimasi Harga</span>
                    <span className="text-lg font-bold text-slate-900">{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex gap-2 mb-4">
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg flex items-center justify-between p-1.5">
                        <button onClick={() => setPaxAdults(Math.max(1, paxAdults - 1))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">-</button>
                        <span className="text-xs font-semibold">{paxAdults} Dws</span>
                        <button onClick={() => setPaxAdults(paxAdults + 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">+</button>
                    </div>
                    <div className="flex-1 bg-white border border-slate-200 rounded-lg flex items-center justify-between p-1.5">
                        <button onClick={() => setPaxChildren(Math.max(0, paxChildren - 1))} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">-</button>
                        <span className="text-xs font-semibold">{paxChildren} Ank</span>
                        <button onClick={() => setPaxChildren(paxChildren + 1)} className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">+</button>
                    </div>
                </div>
                <Link href={`/tour/book/${slug}?adults=${paxAdults}&children=${paxChildren}`} className="block w-full text-center py-2.5 rounded-xl bg-toba-green text-white text-xs font-bold uppercase tracking-wide hover:bg-green-700 transition-colors">
                    Pesan Sekarang
                </Link>
            </div>
        </div>
    );
}
