# Sumatera Explore

## Arah beranda & sistem visual

Beranda memakai pendekatan link-hub operator lokal yang jujur dan langsung: foto Danau Toba gelap penuh di latar belakang (`#0c0f0e` obsidian), pilihan durasi instan (`2D 1N`, `3D 2N`, `4D 3N`, `5D 4N`) dengan harga awal langsung terlihat di layar pertama tanpa perlu gulir, diikuti tautan aksi susun ke katalog pricelist `1–10 pax SUV / Van Hiace`, galeri dokumentasi, cara pembayaran, dan WhatsApp resmi. Tanpa konten fiktif dan tanpa Bukit Lawang / Tangkahan / Orangutan.

System: Hallmark Custom (`dark / geometric-sans / warm`, `Plus Jakarta Sans`, hue `84`), terpadu di seluruh rute publik (`/`, `/tour/packages`, `/tour/[slug]`, `/tour/gallery`, `/tour/blog`, `/tour/blog/[slug]`, `/about`, `/payment`, `/terms`, `/privacy`) serta konsisten di `/admin`.

## Keputusan visual & token (`src/app/tokens.css`)

- **Warna (OKLCH):**
  - `--color-paper`: `oklch(14.5% 0.008 160)` (obsidian gelap utama `#0c0f0e`)
  - `--color-paper-2`: `oklch(18.5% 0.01 160)` (kartu & subhero gelap)
  - `--color-ink`: `oklch(96% 0.006 95)` (teks utama terang)
  - `--color-accent`: `oklch(77% 0.14 84)` (emas hangat Sumatera untuk aksen & harga)
  - `--color-wa`: `oklch(48% 0.135 150)` (hijau WhatsApp untuk aksi chat langsung)
  - `--color-rule`: `oklch(30% 0.012 160)` (garis pemisah 1px)
- **Huruf:** Plus Jakarta Sans (`--font-display` dan `--font-body`), angka harga memakai `tabular-nums` (`.num`).
- **Gerak:** hanya transisi hover/fokus/aktif singkat (`prefers-reduced-motion: reduce` selalu dihormati).
- **Aset:** seluruh gambar menggunakan aset proyek yang sudah ada (`/images/sumut/*`, `/images/home/*`).
