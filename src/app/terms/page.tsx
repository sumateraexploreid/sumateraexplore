import React from 'react';
import Link from 'next/link';
import { getLiveSiteBundle } from '@/lib/cms';

export const metadata = {
  title: 'Syarat dan Ketentuan - Sumatera Explore',
  description:
    'Syarat dan ketentuan layanan paket wisata Sumatera Explore: pemesanan, pembayaran, pembatalan, dan tanggung jawab layanan perjalanan Danau Toba.',
};

export default async function TermsPage() {
  const bundle = await getLiveSiteBundle();
  const BUSINESS_IDENTITY = bundle.business;
  return (
    <main className="min-h-dvh">
      <section className="se-subhero">
        <div className="se-subhero-inner">
          <div>
            <nav aria-label="Breadcrumb" className="se-breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Syarat &amp; ketentuan</span>
            </nav>
            <h1>Syarat &amp; ketentuan</h1>
          </div>
          <p>Terakhir diperbarui: Juni 2025</p>
        </div>
      </section>

      <section className="se-prose-wrap">
        <article className="se-prose-card">
          <div className="mb-8 border-b border-rule pb-6 text-sm text-ink-2 leading-relaxed">
            <p className="font-semibold text-ink mb-1">Sumatera Explore</p>
            <p>
              Nama Domain:{' '}
              <strong className="font-semibold text-ink">sumateraexplore.my.id</strong>, Brand
              resmi: <strong className="font-semibold text-ink">Sumatera Explore</strong>
            </p>
            <p className="mt-1">
              Dioperasikan oleh Sumatera Explore, berdomisili di Jl. Trimurti 109, Berastagi,
              Kabupaten Karo, Sumatera Utara.
            </p>
          </div>

          <div className="space-y-4">
            <h2>1. Pendaftaran &amp; Pemesanan</h2>
            <p>
              Setiap pemesanan dianggap sah apabila dilakukan melalui website resmi{' '}
              <strong className="font-semibold text-ink">sumateraexplore.my.id</strong> atau melalui
              jalur komunikasi resmi (WhatsApp/Email). Kami berhak meminta uang muka (DP) sebesar
              30-50% sebagai tanda jadi pemesanan paket wisata sebelum proses konfirmasi akomodasi
              dilakukan.
            </p>

            <h2>2. Pembayaran</h2>
            <p>
              Pelunasan wajib dilakukan paling lambat 7 hari sebelum tanggal keberangkatan.
              Pembayaran dapat dilakukan melalui:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Transfer bank rekening resmi Sumatera Explore (BCA / BNI / Mandiri)</li>
              <li>
                Transfer internasional via Wise (Transferwise) untuk tamu dari Singapura dan Malaysia
              </li>
              <li>
                Mata uang yang diterima: IDR (Rupiah), MYR (Ringgit Malaysia), SGD (Singapore Dollar)
              </li>
            </ul>
            <p>
              Untuk informasi rekening dan detail pembayaran internasional, silakan kunjungi halaman{' '}
              <Link href="/payment" className="font-semibold text-accent underline underline-offset-4 hover:text-ink">
                Cara Pembayaran
              </Link>
              .
            </p>

            <h2>3. Pembatalan</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Pembatalan &gt; 14 hari sebelum keberangkatan: Pengembalian dana 100% (potong biaya
                admin Rp 50.000).
              </li>
              <li>Pembatalan 7-14 hari sebelum keberangkatan: Pengembalian dana 50%.</li>
              <li>Pembatalan &lt; 7 hari sebelum keberangkatan: Dana tidak dapat dikembalikan.</li>
              <li>
                Pembatalan karena bencana alam atau force majeure: Pengembalian dana penuh atau
                penjadwalan ulang tanpa biaya.
              </li>
            </ul>

            <h2>4. Tanggung Jawab &amp; Asuransi</h2>
            <p>
              Sumatera Explore bertanggung jawab atas keselamatan dan kenyamanan tamu selama program
              berlangsung sesuai itinerary yang disepakati. Kami menyediakan asuransi perjalanan
              dasar untuk setiap tamu. Tamu disarankan untuk memiliki asuransi perjalanan pribadi
              yang mencakup evakuasi medis, terutama untuk tamu internasional.
            </p>

            <h2>5. Perubahan Jadwal</h2>
            <p>
              Sumatera Explore berhak mengubah itinerary atau jadwal perjalanan apabila terjadi
              kondisi force majeure (bencana alam, penutupan akses oleh pemerintah, cuaca ekstrem,
              dll) demi keselamatan dan kenyamanan tamu. Perubahan akan diberitahukan paling lambat
              24 jam sebelum keberangkatan.
            </p>

            <h2>6. Hak &amp; Kewajiban Tamu</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Tamu wajib mematuhi peraturan dan norma lokal di setiap destinasi yang dikunjungi.
              </li>
              <li>
                Tamu wajib memiliki dokumen perjalanan yang sah (paspor, visa jika diperlukan).
              </li>
              <li>Tamu bertanggung jawab atas barang bawaan pribadi masing-masing.</li>
            </ul>

            <h2>7. Kontak &amp; Penyelesaian Sengketa</h2>
            <p>
              Untuk pertanyaan, keluhan, atau penyelesaian sengketa, tamu dapat menghubungi kami
              melalui:
            </p>
            <ul className="list-none pl-0 space-y-2">
              <li>
                Email:{' '}
                <a
                  href={`mailto:${BUSINESS_IDENTITY.email}`}
                  className="font-semibold text-accent underline underline-offset-4 hover:text-ink"
                >
                  {BUSINESS_IDENTITY.email}
                </a>
              </li>
              <li>
                WhatsApp:{' '}
                <a
                  href={`https://wa.me/${BUSINESS_IDENTITY.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-accent underline underline-offset-4 hover:text-ink"
                >
                  {BUSINESS_IDENTITY.whatsappDisplay}
                </a>
              </li>
            </ul>
          </div>
        </article>
      </section>
    </main>
  );
}
