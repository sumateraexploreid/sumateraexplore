# Sumatera Explore

## Arah beranda & sistem visual

Beranda memakai pendekatan link-hub operator lokal yang jujur dan langsung: foto Danau Toba kalem di latar belakang (**Deep Toba Slate-Pine** `oklch(22% 0.014 180)` yang bebas silau/halation), pilihan durasi instan (`2D 1N`, `3D 2N`, `4D 3N`, `5D 4N`) dengan harga awal langsung terlihat di layar pertama tanpa perlu gulir, diikuti tautan aksi susun ke katalog pricelist `1–20 pax SUV / Van Hiace / ELF`, galeri dokumentasi, cara pembayaran, dan WhatsApp resmi. Tanpa konten fiktif dan tanpa Bukit Lawang / Tangkahan / Orangutan.

System: Hallmark Custom (`dark / geometric-sans / calm-slate-pine`, `Plus Jakarta Sans`, hue `76` & `180`), terpadu di seluruh rute publik (`/`, `/tour/packages`, `/tour/[slug]`, `/tour/gallery`, `/tour/blog`, `/tour/blog/[slug]`, `/about`, `/payment`, `/terms`, `/privacy`) serta konsisten di `/admin`.

## Keputusan visual & token (`src/app/tokens.css`)

- **Warna (OKLCH — Deep Toba Slate-Pine + Calm Highland Amber-Sand):**
  - `--color-paper`: `oklch(22% 0.014 180)` (slate-pinus Danau Toba anti-glare, menggantikan obsidian pekat `#0c0f0e` dan membedakan diri dari putih terang `#fafafa`/`#ffffff` kompetitor)
  - `--color-paper-2`: `oklch(26.5% 0.015 180)` (kartu & subhero terangkat kalem)
  - `--color-paper-3`: `oklch(31% 0.016 180)` (lapisan elevasi tersier)
  - `--color-ink`: `oklch(93% 0.008 95)` (ivory kabut lembut — teks utama nyaman di mata)
  - `--color-ink-2`: `oklch(83% 0.012 120)` (teks sekunder lembut)
  - `--color-muted`: `oklch(73% 0.016 165)` (metadata & label kalem)
  - `--color-accent`: `oklch(78% 0.115 76)` (amber-pasir dataran tinggi yang hangat namun tidak menusuk)
  - `--color-accent-ink`: `oklch(18% 0.018 76)` (teks kontras tinggi di atas tombol aksen)
  - `--color-wa`: `oklch(50% 0.11 160)` (hijau zamrud Danau Toba untuk aksi WhatsApp)
  - `--color-rule`: `oklch(36% 0.016 180)` (garis pemisah 1px yang jelas tanpa kasar)
- **Huruf:** Plus Jakarta Sans (`--font-display` dan `--font-body`), angka harga memakai `tabular-nums` (`.num`).
- **Gerak:** hanya transisi hover/fokus/aktif singkat (`prefers-reduced-motion: reduce` selalu dihormati).
- **Aset:** seluruh gambar menggunakan aset proyek yang sudah ada (`/images/sumut/*`, `/images/home/*`).
