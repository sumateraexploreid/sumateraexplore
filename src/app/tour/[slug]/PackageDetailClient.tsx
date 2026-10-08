"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface PackageDetail {
    id: string | number;
    slug: string;
    name: string;
    duration: string;
    locationTag: string;
    price: number;
    image_url: string;
    includes: string[];
    excludes: string[];
    itinerary: { day: number; title: string; description: string }[];
    description: string;
}

export default function PackageDetailClient({ pkg }: { pkg: PackageDetail }) {
    const [activeTab, setActiveTab] = useState('itinerary');
    const [paxAdults, setPaxAdults] = useState(2);
    const [paxChildren, setPaxChildren] = useState(0);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
    };

    const totalPrice = (paxAdults * pkg.price) + (paxChildren * (pkg.price * 0.75)); // 75% child price

    return (
        <div className="bg-slate-50 min-h-screen pb-24 md:pb-12 font-sans text-slate-900">
            {/* Hero Section */}
            <div className="relative h-[50dvh] min-h-[400px] flex flex-col justify-end overflow-hidden">
                <img src={pkg.image_url} alt={pkg.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute top-4 left-4 z-10 text-white/80 text-[10px] uppercase tracking-widest font-bold">
                    <Link href="/" className="hover:text-white transition">Beranda</Link>
                    <span className="mx-2">/</span>
                    <Link href="/tour/packages" className="hover:text-white transition">Paket Wisata</Link>
                    <span className="mx-2">/</span>
                    <span className="text-white">{pkg.name}</span>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pb-8 md:pb-12">
                    <div className="animate-fade-in-up duration-1000">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-toba-green px-3 py-1.5 rounded-full uppercase tracking-widest">
                                <span className="material-symbols-outlined text-[14px]">map</span>
                                {pkg.locationTag}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full uppercase tracking-widest">
                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                {pkg.duration}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-4">
                            {pkg.name}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-5 md:px-8 mt-6 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-6 md:space-y-8">
                    
                    {/* Description Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Tentang Paket Ini</h2>
                        <p className="text-slate-600 font-normal leading-relaxed text-sm md:text-base">
                            {pkg.description}
                        </p>
                    </div>

                    {/* Tabs Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
                            <button onClick={() => setActiveTab('itinerary')} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === 'itinerary' ? 'text-toba-green border-b-2 border-toba-green bg-green-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                                Itinerary
                            </button>
                            <button onClick={() => setActiveTab('includes')} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === 'includes' ? 'text-toba-green border-b-2 border-toba-green bg-green-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                                Termasuk
                            </button>
                            <button onClick={() => setActiveTab('excludes')} className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-colors ${activeTab === 'excludes' ? 'text-toba-green border-b-2 border-toba-green bg-green-50/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}>
                                Tidak Termasuk
                            </button>
                        </div>
                        
                        <div className="p-6 md:p-8">
                            {activeTab === 'itinerary' && (
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {pkg.itinerary.map((day, i) => (
                                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-toba-green text-white font-bold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                                {day.day}
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl border border-slate-100 shadow-sm group-hover:border-green-200 transition-colors">
                                                <h3 className="font-bold text-slate-900 mb-2">{day.title}</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed">{day.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'includes' && (
                                <ul className="space-y-3">
                                    {pkg.includes.map((inc, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-toba-green shrink-0 mt-0.5 text-xl">check_circle</span>
                                            <span className="text-slate-600 text-sm">{inc}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {activeTab === 'excludes' && (
                                <ul className="space-y-3">
                                    {pkg.excludes.map((exc, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-red-500 shrink-0 mt-0.5 text-xl">cancel</span>
                                            <span className="text-slate-600 text-sm">{exc}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar / Booking Form */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 sticky top-24">
                        <div className="mb-6 pb-6 border-b border-slate-100">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest block mb-1">Harga Mulai Dari</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl md:text-4xl font-extrabold text-toba-green tracking-tight">{formatCurrency(pkg.price)}</span>
                                <span className="text-slate-500 text-sm font-normal">/orang</span>
                            </div>
                        </div>

                        <div className="space-y-5 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Dewasa</label>
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                                    <button onClick={() => setPaxAdults(Math.max(1, paxAdults - 1))} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition">-</button>
                                    <span className="font-bold text-slate-900">{paxAdults}</span>
                                    <button onClick={() => setPaxAdults(paxAdults + 1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition">+</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Anak-anak</label>
                                <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-1.5">
                                    <button onClick={() => setPaxChildren(Math.max(0, paxChildren - 1))} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition">-</button>
                                    <span className="font-bold text-slate-900">{paxChildren}</span>
                                    <button onClick={() => setPaxChildren(paxChildren + 1)} className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-slate-700 font-bold hover:bg-slate-100 transition">+</button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6 pt-6 border-t border-slate-100 flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-900">Total Harga</span>
                            <span className="text-xl font-extrabold text-slate-900">{formatCurrency(totalPrice)}</span>
                        </div>

                        <Link href={`https://wa.me/6282166889988?text=Halo,%20saya%20berminat%20dengan%20paket%20${pkg.name}%20untuk%20${paxAdults}%20Dewasa%20dan%20${paxChildren}%20Anak.`}
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex w-full items-center justify-center gap-2 bg-toba-green text-white py-4 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-green-700 transition shadow-md hover:-translate-y-0.5">
                            <span className="material-symbols-outlined text-[18px]">whatsapp</span>
                            Pesan Sekarang via WA
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
