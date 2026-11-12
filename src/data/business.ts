export interface SocialChannel {
  key: "instagram" | "tiktok" | "threads";
  label: string;
  handle: string;
  url: string;
  note: string;
}

export interface FleetOption {
  slug: string;
  name: string;
  capacity: string;
  image: string;
  alt: string;
  note: string;
}

export interface GuestFaqItem {
  q: string;
  a: string;
}

export interface LegalDocumentItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  alt: string;
}

export const BUSINESS_IDENTITY = {
  brandName: "Sumatera Explore",
  legalName: "SUJAI TOBA SUMATERA",
  legalForm: "Perseroan Perorangan",
  decreeNumber: "AHU-A122244.AH.01.30.Tahun 2026",
  decreeIssuer: "Kementerian Hukum Republik Indonesia",
  decreeDate: "15 September 2026",
  kbli: [
    "79121 - Aktivitas Biro Perjalanan Wisata",
    "79110 - Aktivitas Agen Perjalanan",
  ],
  ownerName: "Suja'i",
  address:
    "Jl. Trimurti No. 109, Tambak Lau Mulgab I, Berastagi, Kabupaten Karo, Sumatera Utara 22152",
  shortAddress: "Jl. Trimurti No. 109, Berastagi, Kab. Karo, Sumatera Utara 22152",
  whatsappNumber: "6289502472594",
  whatsappDisplay: "+62 895 0247 2594",
  email: "booking@sumateraexplore.my.id",
  siteUrl: "https://sumateraexplore.my.id",
} as const;

export const SOCIAL_CHANNELS: SocialChannel[] = [
  {
    key: "instagram",
    label: "Instagram",
    handle: "@sumatera.explore",
    url: "https://www.instagram.com/sumatera.explore",
    note: "Galeri foto trip harian, sorotan Danau Toba, dan update cuaca lapangan.",
  },
  {
    key: "tiktok",
    label: "TikTok",
    handle: "@sumatera.explore",
    url: "https://www.tiktok.com/@sumatera.explore",
    note: "Video singkat Reels & TikTok perjalanan tamu dari Paropo, Holbung, dan Pulau Samosir.",
  },
  {
    key: "threads",
    label: "Threads",
    handle: "@sumatera.explore",
    url: "https://www.threads.com/@sumatera.explore",
    note: "Catatan rute harian langsung dari pengemudi dan tim lapangan Berastagi.",
  },
];

export const FLEET_OPTIONS: FleetOption[] = [
  {
    slug: "suv",
    name: "SUV & MPV (1-4 Pax)",
    capacity: "1 hingga 4 peserta + koper kabin",
    image: "/images/sumut/car_innova.webp",
    alt: "Armada Toyota Innova privat bersih dengan pengemudi lokal",
    note: "Lincah untuk jalan berkelok Berastagi, Paropo, Tele, hingga penyeberangan ferry ke Samosir.",
  },
  {
    slug: "hiace",
    name: "Van Hiace / Hiace Premio (5-10 Pax)",
    capacity: "5 hingga 10 peserta + bagasi keluarga",
    image: "/images/sumut/car_hiace.webp",
    alt: "Armada Toyota Hiace untuk rombongan keluarga di Medan dan Danau Toba",
    note: "Kabin lapang untuk keluarga besar dari Bandara Kualanamu (KNO) tanpa perlu berpindah kendaraan.",
  },
];

export const GUEST_FAQS: GuestFaqItem[] = [
  {
    q: "Apakah penjemputan langsung dari Bandara Kualanamu (KNO) atau Hotel Medan?",
    a: "Ya. Seluruh paket private trip sudah mencakup penjemputan dan pengantaran langsung ke Bandara Internasional Kualanamu (KNO), hotel area Medan, maupun rumah. Jadwal rute juga menyesuaikan jam penerbangan Anda.",
  },
  {
    q: "Apakah makanan sepanjang rute dijamin halal dan supirnya Muslim?",
    a: "Ya. Seluruh pengemudi kami adalah supir Muslim lokal yang menjaga jadwal sholat, dan rumah makan sepanjang itinerary dijamin halal serta nyaman untuk tamu Muslim.",
  },
  {
    q: "Bagaimana cara bayar, sistem DP, dan apakah ada bukti legalitas resmi?",
    a: "Pembayaran mendukung mata uang MYR, SGD, maupun IDR. Sistem pemesanan menggunakan uang muka (DP) yang dikonfirmasi langsung melalui WhatsApp (+62 895 0247 2594), lalu baki pelunasan diselesaikan setelah trip selesai sebelum berpisah di Bandara Kualanamu. Layanan dikelola resmi oleh Perseroan Perorangan SUJAI TOBA SUMATERA (SK Kementerian Hukum RI No. AHU-A122244.AH.01.30.Tahun 2026).",
  },
  {
    q: "Kendaraan apa yang dipakai untuk rombongan kecil hingga grup besar?",
    a: "Untuk 1 sampai 6 orang tersedia pilihan Innova/SUV ber-AC penuh, untuk 6 sampai 10 orang tersedia Van Hiace, dan untuk grup 15 sampai 20 orang tersedia ELF atau 2 Van Hiace. Penginapan dan makan driver/guide sudah kami tanggung sepenuhnya.",
  },
  {
    q: "Apakah anak-anak dikenakan biaya penuh, dan bagaimana dengan dokumentasi foto, video, atau drone?",
    a: "Anak usia 5 tahun ke bawah gratis. Seluruh paket sudah termasuk dokumentasi gratis foto dan video 4K memakai iPhone oleh tim lapangan—hasil natural, tajam, unlimited, disertai video highlight siap posting dan langsung dikirim hari itu juga via AirDrop/WhatsApp/Drive. Jika ingin tambahan rekaman drone, bisa dinegosiasikan langsung via WhatsApp sesuai rute dan kondisi cuaca.",
  },
];

export const LEGAL_DOCUMENTS: LegalDocumentItem[] = [
  {
    id: "sk-ahu",
    title: "SK Pengesahan Menteri Hukum RI",
    subtitle: "Nomor AHU-A122244.AH.01.30.Tahun 2026 (15 September 2026)",
    image: "/images/legal/sk-ahu-sujai-toba-sumatera.png",
    alt: "Salinan SK Keputusan Menteri Hukum RI Pengesahan Perseroan Perorangan SUJAI TOBA SUMATERA Nomor AHU-A122244.AH.01.30.Tahun 2026",
  },
  {
    id: "akta-pendirian",
    title: "Surat Pernyataan Pendirian Perseroan",
    subtitle: "SUJAI TOBA SUMATERA • KBLI 79121 & 79110 (NIK/NPWP disensor)",
    image: "/images/legal/akta-pendirian-sujai-toba-sumatera.png",
    alt: "Salinan Surat Pernyataan Pendirian Perseroan Perorangan SUJAI TOBA SUMATERA KBLI 79121 dan 79110 dengan sensor privasi",
  },
];

