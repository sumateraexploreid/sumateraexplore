import React from "react";
import Link from "next/link";
import FaqAccordion from "@/components/FaqAccordion";
import LegalDocumentProof from "@/components/LegalDocumentProof";
import { getLiveSiteBundle } from "@/lib/cms";

export const metadata = {
  title: "Cara Pembayaran - Sumatera Explore | Payment Methods for International Guests",
  description:
    "Panduan lengkap cara pembayaran paket wisata Sumatera Explore untuk tamu dari Singapura dan Malaysia. Bank transfer, Wise, dan mata uang yang diterima.",
};

export default async function PaymentPage() {
  const bundle = await getLiveSiteBundle();
  const BUSINESS_IDENTITY = bundle.business;
  const LEGAL_DOCUMENTS = bundle.legalDocuments;
  const faqs = [
    {
      q: "Apakah saya bisa membayar dengan kartu kredit?",
      a: "Saat ini kami belum menerima pembayaran kartu kredit langsung. Namun Anda bisa menggunakan Wise yang mendukung transfer dari rekening kartu. Hubungi kami untuk alternatif lain.",
    },
    {
      q: "Berapa lama waktu yang dibutuhkan untuk konfirmasi setelah transfer?",
      a: "Konfirmasi diberikan dalam 1x24 jam kerja setelah dana diterima. Untuk transfer via Wise biasanya lebih cepat (1 sampai 4 jam). Kirimkan bukti transfer ke WhatsApp kami untuk mempercepat proses.",
    },
    {
      q: "Apakah harga paket sudah termasuk semua biaya?",
      a: 'Setiap paket memiliki daftar "Termasuk" dan "Tidak Termasuk" yang jelas. Biasanya tidak termasuk: tiket pesawat, visa, pengeluaran pribadi, dan makanan di luar itinerary.',
    },
    {
      q: "Bisakah saya melihat harga dalam MYR atau SGD?",
      a: "Ya. Ganti mata uang lewat pemilih bahasa di bilah navigasi. Harga langsung dikonversi memakai kurs yang berlaku.",
    },
    {
      q: "Bagaimana kalau saya harus membatalkan?",
      a: "Pembatalan lebih dari 14 hari sebelum keberangkatan: dana kembali 100% (dipotong biaya admin Rp 50.000). 7 hingga 14 hari sebelumnya: kembali 50%. Kurang dari 7 hari: dana tidak dapat dikembalikan. Pembatalan karena bencana alam atau force majeure: dana kembali penuh atau dijadwalkan ulang tanpa biaya.",
    },
    {
      q: "Kapan saya harus melunasi?",
      a: "Tamu dapat memberikan uang muka (DP) untuk mengunci jadwal armada dan hotel, lalu menyelesaikan baki pelunasan sebelum berpisah di Bandara Kualanamu atau sesuai kesepakatan di WhatsApp resmi.",
    },
  ];

  const currencies = [
    { code: "MYR", name: "Ringgit Malaysia", status: "Diterima" },
    { code: "SGD", name: "Singapore Dollar", status: "Diterima" },
    { code: "IDR", name: "Rupiah Indonesia", status: "Diterima" },
  ];

  return (
    <main className="se-page min-h-dvh">
      <section className="se-subhero" aria-labelledby="payment-title">
        <div className="se-subhero-inner">
          <div>
            <nav className="se-breadcrumb" aria-label="Navigasi halaman">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Cara pembayaran</span>
            </nav>
            <h1 id="payment-title">Cara Pembayaran</h1>
          </div>
          <p>Pembayaran mudah untuk tamu Indonesia, Malaysia, dan Singapura dalam IDR, MYR, SGD.</p>
        </div>
      </section>

      <div className="se-section space-y-10 sm:space-y-12">
        <section className="border-l-2 border-accent pl-4 sm:pl-6" aria-labelledby="deposit-title">
          <h2 id="deposit-title" className="font-display text-2xl text-ink mb-3">
            Sistem deposit dan komunikasi via WhatsApp
          </h2>
          <p className="text-ink-2 text-sm leading-relaxed max-w-[65ch]">
            Pemesanan dikonfirmasi setelah uang muka (DP) diterima dengan rincian nominal dan bukti transfer yang dikoordinasikan langsung lewat WhatsApp resmi ({BUSINESS_IDENTITY.whatsappDisplay}) untuk mengunci armada serta hotel. Baki pelunasan diselesaikan setelah trip selesai sebelum berpisah di Bandara Kualanamu (KNO).
          </p>
        </section>

        <section aria-labelledby="payment-legal-title" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-rule pt-8">
          <div className="lg:col-span-5 space-y-2">
            <h2 id="payment-legal-title" className="font-display text-2xl text-ink">
              Bukti legalitas resmi penerima transfer
            </h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              Seluruh pemesanan dikelola resmi oleh{" "}
              <strong className="text-ink">{BUSINESS_IDENTITY.legalForm} {BUSINESS_IDENTITY.legalName}</strong>{" "}
              dengan nomor pengesahan{" "}
              <strong className="text-accent num">{BUSINESS_IDENTITY.decreeNumber}</strong> dan kantor beralamat di{" "}
              {BUSINESS_IDENTITY.shortAddress}.
            </p>
            <div className="pt-1">
              <Link href="/about" className="se-text-link">
                Detail badan hukum &amp; KBLI
              </Link>
            </div>
          </div>
          <div className="lg:col-span-7">
            <LegalDocumentProof documents={LEGAL_DOCUMENTS} compact />
          </div>
        </section>

        <section aria-labelledby="currency-title">
          <h2 id="currency-title" className="font-display text-2xl text-ink mb-5 sm:mb-6">
            Mata uang yang diterima
          </h2>
          <div className="grid grid-cols-3 gap-3 sm:gap-8">
            {currencies.map((cur) => (
              <div key={cur.code} className="border-t border-rule pt-4 sm:pt-5">
                <p className="font-display text-xl sm:text-2xl text-ink">{cur.code}</p>
                <p className="text-xs sm:text-sm text-ink-2 mt-1">{cur.name}</p>
                <p className="text-xs font-semibold text-success mt-2 sm:mt-3">{cur.status}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="methods-title">
          <h2 id="methods-title" className="font-display text-2xl text-ink mb-6">
            Metode pembayaran
          </h2>
          <div className="divide-y divide-rule border-y border-rule">
            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <h3 className="font-display text-xl text-ink">Wise (TransferWise)</h3>
                <p className="text-xs text-accent font-semibold mt-1">Rekomendasi tamu internasional</p>
              </div>
              <div className="md:col-span-8 space-y-2 text-sm text-ink-2">
                <p>
                  Metode paling hemat dan cepat untuk transfer dari Singapura dan Malaysia tanpa biaya tersembunyi dengan kurs mendekati nilai pasar.
                </p>
                <p className="text-xs text-muted">
                  Best option for international guests. Low fees, transparent exchange rate, supports MYR and SGD.
                </p>
                <p className="pt-2 text-xs text-ink">
                  Email Wise: <strong>booking@sumateraexplore.my.id</strong> (atau hubungi kami lewat WhatsApp untuk detail rekening terbaru).
                </p>
              </div>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <h3 className="font-display text-xl text-ink">Transfer bank lokal (Indonesia)</h3>
              </div>
              <div className="md:col-span-8 space-y-2 text-sm text-ink-2">
                <p>Untuk tamu yang memiliki rekening bank Indonesia atau menggunakan jasa keuangan lokal.</p>
                <p className="text-xs text-ink pt-1">
                  Nomor rekening dikirim bersama konfirmasi pesanan. Belum menerimanya? Kirim kode booking ke{" "}
                  <a
                    href={`https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent font-semibold underline"
                  >
                    {BUSINESS_IDENTITY.whatsappDisplay}
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-4">
                <h3 className="font-display text-xl text-ink">Transfer bank internasional (SWIFT)</h3>
              </div>
              <div className="md:col-span-8 space-y-2 text-sm text-ink-2">
                <p>
                  Untuk transfer antarbank internasional. Biaya SWIFT dan konversi mata uang ditanggung oleh pengirim.
                </p>
                <p className="text-xs text-muted">
                  For SWIFT transfers, bank fees and currency conversion charges are borne by the sender.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title">
          <h2 id="faq-title" className="font-display text-2xl text-ink mb-6">
            Pertanyaan umum
          </h2>
          <FaqAccordion faqs={faqs} />
        </section>

        <section className="border-t border-rule pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl text-ink">Siap memesan atau butuh panduan pembayaran?</h2>
            <p className="text-sm text-ink-2 mt-1">
              Hubungi kami lewat WhatsApp dan tim akan memandu langkah pembayaran hingga selesai.
            </p>
          </div>
          <a
            href={`https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="se-btn se-btn--primary"
          >
            Chat via WhatsApp
          </a>
        </section>
      </div>
    </main>
  );
}
