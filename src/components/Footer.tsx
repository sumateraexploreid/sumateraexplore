import React from 'react';
import Link from 'next/link';
import Icon from './Icon';

export default function Footer() {
    const brandName = 'Sumatera Explore';
    const siteSettings = {
        general: {
            site_name: brandName,
            site_footer_desc: 'Penyedia layanan perjalanan wisata di Sumatera Utara. Fokus kami sederhana: perjalanan yang rapi, nyaman, dan mudah dipesan.',
            office_address: 'Jl. Trimurti 109, Berastagi, Kabupaten Karo',
            social_instagram: 'sumateraexplore',
            social_facebook: 'https://facebook.com/sumateraexplore',
            social_youtube: 'https://youtube.com/sumateraexplore',
            social_tiktok: 'https://tiktok.com/@sumateraexplore',
            site_copyright: 'Sumatera Explore'
        }
    };
    
    const contact = {
        whatsapp1: '6282166889988',
        whatsapp1Display: '+62 821 6688 9988',
        whatsapp2: '6282166889989',
        whatsapp2Display: '+62 821 6688 9989',
        email: 'hello@sumateraexplore.com'
    };

    const logoDark = null; // Will use text logo if null

    return (
        <footer className="bg-slate-950 pt-8 md:pt-10 pb-6 px-5 md:px-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-6 md:mb-8">

                    {/* Brand Column */}
                    <div className="space-y-6 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center">
                            {logoDark ? (
                                <img 
                                    src={logoDark} 
                                    alt={brandName}
                                    className="h-8 w-auto object-contain brightness-0 invert opacity-90"
                                />
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 bg-toba-green rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
                                    <span className="text-lg font-bold font-headline-md text-on-primary tracking-tight uppercase">
                                        Sumatera <span className="text-green-400">Explore</span>
                                    </span>
                                </div>
                            )}
                        </div>

                        <p className="text-slate-400 font-body-md text-xs leading-relaxed">
                            {siteSettings.general.site_footer_desc}
                        </p>

                        {/* Social links */}
                        <div className="flex items-center space-x-3">
                            {siteSettings.general.social_instagram && (
                                <a href={`https://instagram.com/${siteSettings.general.social_instagram.replace('@', '')}`} 
                                   target="_blank" rel="noopener noreferrer"
                                   className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition">
                                    <Icon name="instagram" className="w-4 h-4" />
                                </a>
                            )}
                            {siteSettings.general.social_facebook && (
                                <a href={siteSettings.general.social_facebook} 
                                   target="_blank" rel="noopener noreferrer"
                                   className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition">
                                    <Icon name="facebook" className="w-4 h-4" />
                                </a>
                            )}
                            {siteSettings.general.social_youtube && (
                                <a href={siteSettings.general.social_youtube} 
                                   target="_blank" rel="noopener noreferrer"
                                   className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition">
                                    <Icon name="youtube" className="w-4 h-4" />
                                </a>
                            )}
                            {siteSettings.general.social_tiktok && (
                                <a href={siteSettings.general.social_tiktok}
                                   target="_blank" rel="noopener noreferrer"
                                   className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white hover:border-white/20 transition">
                                    <Icon name="tiktok" className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-label-caps text-[10px] uppercase tracking-[0.2em] mb-6">Layanan Kami</h4>
                        <ul className="space-y-3">
                            <li><Link href="/" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Beranda</Link></li>
                            <li><Link href="/tour/packages" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Semua Destinasi</Link></li>
                            <li><Link href="/tour/gallery" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Galeri Foto</Link></li>
                            <li><Link href="/tour/blog" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Blog Perjalanan</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-white font-label-caps text-[10px] uppercase tracking-[0.2em] mb-6">Bantuan</h4>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Tentang Kami</Link></li>
                            <li><Link href="/payment" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Cara Pembayaran</Link></li>
                            <li><Link href="/track-booking" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Lacak Pesanan</Link></li>
                            <li><Link href="/terms" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Syarat & Ketentuan</Link></li>
                            <li><Link href="/privacy" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Kebijakan Privasi</Link></li>
                            <li><Link href="/tour/blog" className="text-slate-400 hover:text-white font-body-md text-xs transition-colors inline-block">Pusat Artikel</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-label-caps text-[10px] uppercase tracking-[0.2em] mb-6">Alamat & Kontak</h4>
                        <div className="space-y-4 text-slate-400 font-body-md text-xs">
                            <div className="flex items-start space-x-3">
                                <span className="material-symbols-outlined text-secondary text-[18px] mt-0.5 shrink-0">location_on</span>
                                <p>{siteSettings.general.office_address}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Icon name="whatsapp" className="w-4 h-4 text-secondary shrink-0" />
                                <a href={`https://wa.me/${contact.whatsapp1}`} target="_blank" rel="noopener noreferrer"
                                   className="hover:text-secondary transition-colors">
                                    {contact.whatsapp1Display}
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Icon name="whatsapp" className="w-4 h-4 text-secondary shrink-0" />
                                <a href={`https://wa.me/${contact.whatsapp2}`} target="_blank" rel="noopener noreferrer"
                                   className="hover:text-secondary transition-colors">
                                    {contact.whatsapp2Display} <span className="text-slate-500 text-[11px]">(CS 2)</span>
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">mail</span>
                                <a href={`mailto:${contact.email}`} className="hover:text-secondary transition-colors">
                                    {contact.email}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                     <p className="text-slate-500 font-label-caps text-[10px] uppercase tracking-wider">
                        &copy; {new Date().getFullYear()} <span className="text-white/80">{siteSettings.general.site_copyright}</span>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-slate-500 font-label-caps text-[8px] uppercase tracking-wider leading-tight">Agen Resmi<br/>Wonderful Indonesia</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
