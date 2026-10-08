import React from 'react';
import Link from 'next/link';
import FaqAccordion from '@/components/FaqAccordion';

export const metadata = {
  title: 'Cara Pembayaran - Sumatera Explore | Payment Methods for International Guests',
  description: 'Panduan lengkap cara pembayaran paket wisata Sumatera Explore untuk tamu dari Singapura dan Malaysia. Bank transfer, Wise, dan mata uang yang diterima.',
};

export default function PaymentPage() {
    const faqs = [
        { q: 'Apakah saya bisa membayar dengan kartu kredit?', a: 'Saat ini kami belum menerima pembayaran kartu kredit langsung. Namun Anda bisa menggunakan Wise yang mendukung transfer dari rekening kartu. Hubungi kami untuk alternatif lain.' },
        { q: 'Berapa lama waktu yang dibutuhkan untuk konfirmasi setelah transfer?', a: 'Konfirmasi diberikan dalam 1x24 jam kerja setelah dana diterima. Untuk transfer via Wise biasanya lebih cepat (1-4 jam). Kirimkan bukti transfer ke WhatsApp kami untuk mempercepat proses.' },
        { q: 'Apakah harga paket sudah termasuk semua biaya?', a: 'Setiap paket memiliki daftar "Termasuk" dan "Tidak Termasuk" yang jelas. Biasanya tidak termasuk: tiket pesawat, visa, pengeluaran pribadi, dan makanan di luar itinerary.' },
        { q: 'Bisakah saya melihat harga dalam MYR atau SGD?', a: 'Ya. Ganti bahasa lewat menu (di ponsel: buka menu ☰ terlebih dulu). Harga langsung dikonversi memakai kurs yang berlaku.' },
        { q: 'Bagaimana kalau saya harus membatalkan?', a: 'Pembatalan lebih dari 14 hari sebelum keberangkatan: dana kembali 100% (dipotong biaya admin Rp 50.000). 7–14 hari sebelumnya: kembali 50%. Kurang dari 7 hari: dana tidak dapat dikembalikan. Pembatalan karena bencana alam atau force majeure: dana kembali penuh atau dijadwalkan ulang tanpa biaya.' },
        { q: 'Kapan saya harus melunasi?', a: 'Uang muka 30–50% menjadi tanda jadi, dan pelunasan paling lambat 7 hari sebelum tanggal keberangkatan. Tanggal jatuh tempo pesanan Anda tercantum di invoice dan di halaman pelacakan pesanan.' },
    ];

    return (
        <div className="bg-slate-50 min-h-screen pt-14 pb-12 font-sans">
            <div className="max-w-5xl mx-auto px-5 md:px-8 animate-fade-in-up duration-1000">

                {/* Header */}
                <div className="text-center mb-6 md:mb-8">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-100 text-green-700 text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full">Informasi</span>
                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight mt-6">
                        Cara <span className="text-toba-green">Pembayaran</span>
                    </h1>
                    <p className="mt-4 text-slate-600 font-normal max-w-xl mx-auto text-sm leading-relaxed">
                        Kami menerima berbagai metode pembayaran untuk memudahkan tamu dari Singapura, Malaysia, dan seluruh dunia.
                        <span className="block mt-1 text-slate-400 text-xs">We accept various payment methods for guests from Singapore, Malaysia, and around the world.</span>
                    </p>
                </div>

                {/* Deposit Info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 mb-6 flex gap-5 items-start">
                    <div className="w-10 h-10 bg-green-50 text-green-700 rounded-xl flex items-center justify-center shrink-0 border border-green-100">
                        <span className="material-symbols-outlined text-[18px]">info</span>
                    </div>
                    <div>
                        <h3 className="text-slate-900 font-semibold text-base mb-1.5">Sistem Deposit / Booking Confirmation</h3>
                        <p className="text-slate-600 font-normal text-sm leading-relaxed">Pemesanan dikonfirmasi setelah DP (uang muka) <strong className="text-slate-900 font-semibold">30–50% dari total harga paket</strong> diterima. Pelunasan dilakukan paling lambat <strong className="text-slate-900 font-semibold">7 hari sebelum keberangkatan</strong>. Untuk grup di bawah 5 orang, pelunasan penuh diminta saat booking.</p>
                        <p className="text-slate-400 text-xs mt-2">Booking is confirmed upon receipt of a 30–50% deposit. Full payment is required at least 7 days before departure.</p>
                    </div>
                </div>

                {/* Currency Accepted */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Mata Uang yang Diterima / Accepted Currencies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center hover:border-green-200 transition duration-300">
                            <div className="text-3xl mb-3">🇲🇾</div>
                            <p className="font-semibold text-slate-900 text-lg">MYR</p>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Ringgit Malaysia</p>
                            <p className="text-green-700 font-semibold text-xs tracking-wider mt-3">✓ Diterima</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center hover:border-green-200 transition duration-300">
                            <div className="text-3xl mb-3">🇸🇬</div>
                            <p className="font-semibold text-slate-900 text-lg">SGD</p>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Singapore Dollar</p>
                            <p className="text-green-700 font-semibold text-xs tracking-wider mt-3">✓ Diterima</p>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center hover:border-green-200 transition duration-300">
                            <div className="text-3xl mb-3">🇮🇩</div>
                            <p className="font-semibold text-slate-900 text-lg">IDR</p>
                            <p className="text-slate-400 text-xs font-normal mt-0.5">Rupiah Indonesia</p>
                            <p className="text-green-700 font-semibold text-xs tracking-wider mt-3">✓ Diterima</p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Metode Pembayaran / Payment Methods</h2>
                    <div className="space-y-6">

                        {/* Wise */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 hover:border-green-200 transition duration-300">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-toba-green/10 text-toba-green rounded-xl flex items-center justify-center shrink-0">
                                    <span className="font-bold text-base">W</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-base mb-1.5">Wise (TransferWise) — <span className="text-green-700 font-medium">Rekomendasi untuk Tamu Internasional</span></h3>
                                    <p className="text-slate-600 font-normal text-sm leading-relaxed mb-2">Metode paling murah dan tercepat untuk transfer dari Singapura dan Malaysia. Tidak ada biaya tersembunyi dan kurs mendekati nilai pasar.</p>
                                    <p className="text-slate-400 text-xs">Best option for international guests. Low fees, transparent exchange rate, supports MYR and SGD.</p>
                                    <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-4 text-xs font-normal text-slate-600">
                                        <p>📧 Email Wise: <strong>booking@sumateraexplore.my.id</strong></p>
                                        <p className="mt-1">Atau hubungi kami via WhatsApp untuk detail rekening Wise terbaru.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bank Transfer */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 hover:border-green-200 transition duration-300">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-toba-green/10 text-toba-green rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">account_balance</span>
                                </div>
                                <div className="w-full">
                                    <h3 className="font-bold text-slate-900 text-base mb-1.5">Transfer Bank Lokal (Indonesia)</h3>
                                    <p className="text-slate-600 font-normal text-sm leading-relaxed mb-4">Untuk tamu yang sudah memiliki akses ke rekening bank Indonesia atau menggunakan agen jasa keuangan.</p>
                                    
                                    <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-4">
                                        <p className="text-sm text-slate-600 font-normal leading-relaxed">Nomor rekening dikirim bersama konfirmasi pesanan. Sudah memesan tapi belum menerimanya? Kirim kode booking Anda ke
                                            <a href="https://wa.me/6282166889988" target="_blank" rel="noopener noreferrer" className="font-semibold text-toba-green hover:underline ml-1">+62 821-6688-9988</a>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* International SWIFT */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 hover:border-green-200 transition duration-300">
                            <div className="flex items-start gap-5">
                                <div className="w-12 h-12 bg-toba-green/10 text-toba-green rounded-xl flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">public</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-base mb-1.5">Transfer Bank Internasional (SWIFT)</h3>
                                    <p className="text-slate-600 font-normal text-sm leading-relaxed mb-2">Untuk transfer dari bank internasional. Harap diperhatikan bahwa biaya SWIFT dan konversi mata uang ditanggung oleh pengirim.</p>
                                    <p className="text-slate-400 text-xs">For SWIFT transfers, please note that bank fees and currency conversion charges are borne by the sender.</p>
                                    <div className="mt-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-4 text-xs font-normal text-slate-600">
                                        <p>Untuk detail SWIFT code dan instruksi transfer internasional lengkap, silakan hubungi kami via WhatsApp: <strong>+62 821-6688-9988</strong></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Pertanyaan Umum / FAQ</h2>
                    <FaqAccordion faqs={faqs} />
                </div>

                {/* CTA */}
                <div className="bg-slate-50 rounded-2xl border border-slate-200 shadow-sm p-8 md:p-12 text-center mt-12">
                    <h3 className="text-2xl md:text-3xl font-semibold text-slate-900 mb-3">Siap Memesan? / Ready to Book?</h3>
                    <p className="text-slate-600 font-normal text-sm mb-8">Hubungi kami via WhatsApp dan kami akan pandu proses pembayaran step-by-step.</p>
                    <a href="https://wa.me/6282166889988" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 text-white px-6 py-3 font-semibold text-xs uppercase tracking-wider transition-colors hover:bg-slate-800">
                        Chat via WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
