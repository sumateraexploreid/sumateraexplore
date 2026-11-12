import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Kebijakan Privasi - Sumatera Explore',
  description: 'Kebijakan privasi Sumatera Explore.',
};

export default function PrivacyPage() {
  return (
    <main>
      <section className="se-subhero">
        <div className="se-subhero-inner">
          <div>
            <nav aria-label="Breadcrumb" className="se-breadcrumb">
              <Link href="/">Beranda</Link>
              <span aria-hidden="true">/</span>
              <span>Kebijakan privasi</span>
            </nav>
            <h1>Kebijakan privasi</h1>
          </div>
          <p>Terakhir diperbarui: Juni 2025</p>
        </div>
      </section>

      <section className="se-prose-wrap">
        <article className="se-prose-card space-y-4">
          <h2>Perlindungan Data</h2>
          <p>
            Sumatera Explore berkomitmen untuk melindungi privasi pelanggan kami. Kami hanya
            mengumpulkan informasi yang diperlukan untuk memproses pemesanan Anda dan meningkatkan
            layanan kami.
          </p>

          <h2>Informasi yang Kami Kumpulkan</h2>
          <p>
            Informasi yang kami kumpulkan meliputi nama, alamat email, nomor telepon, dan detail
            perjalanan yang diperlukan untuk koordinasi tour.
          </p>

          <h2>Penggunaan Informasi</h2>
          <p>
            Data Anda tidak akan pernah dijual atau dibagikan kepada pihak ketiga untuk tujuan
            pemasaran tanpa persetujuan eksplisit dari Anda.
          </p>
        </article>
      </section>
    </main>
  );
}
