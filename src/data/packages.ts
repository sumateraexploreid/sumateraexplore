export interface PaxTier {
  pax: number;
  vehicle: string;
  priceMyr: number;
  label?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  subtitle?: string;
  description: string;
  stops?: { time: string; place: string }[];
}

export interface TourPackage {
  id: string;
  shortLabel: string;
  slug: string;
  name: string;
  duration: string;
  locationTag: string;
  priceMyr: number;
  priceIdr: number;
  isFeatured: boolean;
  image_url: string;
  hotels: string[];
  description: string;
  includes: string[];
  excludes: string[];
  notes: string[];
  tiers: PaxTier[];
  itinerary: ItineraryDay[];
}

export const DOCUMENTATION_GEAR = [
  "Dokumentasi foto & video 4K memakai iPhone (Cinematic & Ultra-Wide)",
  "Unlimited jepretan candid & posed selama rute oleh tim pendamping",
  "Gratis 1 video highlight Reels / TikTok siap posting",
  "File langsung dikirim hari itu juga via AirDrop, WhatsApp, atau Google Drive",
  "Butuh rekaman drone / aerial view? Bisa request & negosiasi harga langsung lewat WhatsApp sesuai jadwal & cuaca",
];

export const OPERATOR_NOTES = [
  "Seluruh paket dipandu supir Muslim lokal yang terbiasa menjaga jadwal sholat, dan rumah makan yang dikunjungi dijamin halal untuk tamu Muslim.",
  "Dokumentasi foto dan video 4K memakai iPhone termasuk video highlight sudah gratis di seluruh paket; layanan drone bersifat opsional dengan tarif yang dapat dinegosiasikan via WhatsApp.",
  "Pemesanan menggunakan DP yang disepakati langsung melalui WhatsApp resmi (+62 895 0247 2594); baki pelunasan trip diselesaikan setelah trip selesai atau sebelum berpisah di Bandara Kualanamu.",
  "Daftar tarif di situs mengikuti Harga Weekday resmi SUJAI TOBA SUMATERA. Hubungi WhatsApp kami untuk konfirmasi tanggal libur sekolah atau akhir pekan.",
  "Itinerary bersifat fleksibel dan disesuaikan dengan jadwal penerbangan (flight) tamu yang sudah dibeli.",
  "Biaya aktivitas opsional seperti Seadoo Safari Samosir (jetski) atau sewa drone dihitung terpisah dan disepakati secara transparan di awal.",
  "Penginapan dan makan driver/guide selama trip sudah menjadi tanggung jawab kami — tamu tidak perlu menanggung.",
  "Kanak-kanak usia 5 tahun ke bawah gratis. Untuk 4 orang ke atas boleh memilih 1 bilik atau 2 bilik.",
];

export const TOUR_PACKAGES: TourPackage[] = [
  {
    id: "1",
    shortLabel: "2D 1N",
    slug: "danau-toba-2d1n",
    name: "Private Trip Danau Toba 2 Days 1 Night",
    duration: "2 Hari 1 Malam",
    locationTag: "Parapat & Pulau Samosir",
    priceMyr: 300,
    priceIdr: 1320000,
    isFeatured: true,
    image_url: "/images/sumut/toba_hero.webp",
    hotels: [
      "Hope Villa (view bukit cantik dan Danau Toba yang tenang)",
      "Samosir Cottages 4★ (view kolam renang & tepi Danau Toba)",
    ],
    description:
      "Perjalanan singkat namun lengkap dari Medan/Kualanamu menuju Parapat, menyeberangi Danau Toba ke Pulau Samosir, Bukit Holbung, Air Terjun Efrata, dan Menara Pandang Tele dengan gratis dokumentasi iPhone 4K siap posting (opsional drone bisa request).",
    includes: [
      "Transportasi kereta SUV / Van Hiace full AC",
      "Supir Muslim lokal sekaligus tour guide & pendamping foto iPhone (menjaga jadwal sholat)",
      "Jaminan pilihan rumah makan halal sepanjang itinerary",
      "1 malam di Hope Villa atau Samosir Cottages 4★ (pilih salah satu, sudah termasuk sarapan, AC & setrika)",
      "Pickup langsung ke rumah, hotel Medan, atau Bandara Kualanamu",
      "Semua tiket masuk wisata, biaya tol, parkir & ferry Ajibata–Ambarita PP",
      "Gratis dokumentasi iPhone 4K Cinematic (unlimited foto & video + edit highlight siap posting, drone opsional by request)",
      "Welcome fruit, welcome snack, kalung & bouquet bunga saat pickup di airport",
      "Air mineral, P3K, charger 2 pin di mobil & key chain kenang-kenangan",
    ],
    excludes: [
      "Makan pribadi selama trip (di luar sarapan hotel)",
      "Tiket pesawat (flight ticket)",
      "Aktivitas opsional Seadoo Safari Samosir (jetski) & request drone (bisa nego)",
    ],
    notes: [
      "Untuk trip 2 hari, disarankan mengambil penerbangan datang sehari sebelumnya dan bermalam di hotel Medan agar dapat berangkat pukul 05.00 WIB menuju Danau Toba.",
      "Disarankan membawa pakaian warna cerah agar kontras bagus di foto & video perbukitan Bukit Holbung dan Bukit Cinta.",
    ],
    tiers: [
      { pax: 1, vehicle: "Innova / SUV", priceMyr: 1650, label: "1 Orang (Dengan Hotel)" },
      { pax: 1, vehicle: "Innova / SUV", priceMyr: 1200, label: "1 Orang (Transport + Entrance Fee)" },
      { pax: 2, vehicle: "Innova / SUV", priceMyr: 550 },
      { pax: 3, vehicle: "Innova / SUV", priceMyr: 450 },
      { pax: 4, vehicle: "Innova / SUV", priceMyr: 400 },
      { pax: 5, vehicle: "Innova / SUV", priceMyr: 350 },
      { pax: 6, vehicle: "Innova / SUV", priceMyr: 300, label: "6 Orang (Innova)" },
      { pax: 6, vehicle: "Van Hiace", priceMyr: 400, label: "6 Orang (Van)" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Day 1: Medan / Kualanamu — Parapat — Samosir",
        description:
          "Berangkat pukul 05.00 dari hotel Medan atau Bandara Kualanamu (±3,5 jam ke Parapat) lalu menyeberang ke Pulau Samosir.",
        stops: [
          { time: "08.00 – 08.30", place: "Sarapan pagi di Kota Parapat" },
          { time: "09.00 – 10.00", place: "Bukit Senyum viewpoint Danau Toba" },
          { time: "10.30 – 11.30", place: "Ferry crossing Ajibata – Ambarita" },
          { time: "12.00 – 13.00", place: "Pasar Tomok (souvenir & budaya Batak)" },
          { time: "13.30 – 14.30", place: "Makan siang di Janji Maria Coffee & Resto" },
          { time: "15.30 – 16.30", place: "Huta Siallagan (Batu Persidangan)" },
          { time: "Opsional", place: "Seadoo Safari Samosir (Jetski)" },
          { time: "17.30", place: "Check-in Hope Villa / Samosir Cottages" },
          { time: "18.00 – 21.00", place: "Sunset, makan malam di resto hotel & istirahat" },
        ],
      },
      {
        day: 2,
        title: "Day 2: Explore Samosir — Bukit Holbung — Tele — Medan",
        description:
          "Sarapan dengan view Danau Toba, check-out pukul 09.00 lalu menyusuri sisi perbukitan Samosir sebelum kembali ke Medan.",
        stops: [
          { time: "10.30 – 11.30", place: "Bukit Holbung (sesi foto & video cinematic)" },
          { time: "12.00 – 13.00", place: "Bukit Cinta (spot foto panorama)" },
          { time: "13.30 – 14.30", place: "Makan siang di RM Raju Minang" },
          { time: "15.00 – 15.30", place: "Air Terjun Efrata" },
          { time: "16.00 – 16.30", place: "Menara Pandang Tele" },
          { time: "17.00 – 17.30", place: "Desa Agrowisata Singkam" },
          { time: "19.00 – 20.00", place: "Ferry crossing Ambarita – Ajibata" },
          { time: "21.00 – 22.00", place: "Makan malam Ayam Pecak Maha Asyik Siantar" },
          { time: "24.00", place: "Tiba di Kota Medan / Hotel, trip selesai" },
        ],
      },
    ],
  },
  {
    id: "2",
    shortLabel: "3D 2N",
    slug: "danau-toba-3d2n",
    name: "Private Trip Danau Toba 3 Days 2 Nights",
    duration: "3 Hari 2 Malam",
    locationTag: "Sidamanik, Samosir & Berastagi",
    priceMyr: 475,
    priceIdr: 2090000,
    isFeatured: true,
    image_url: "/images/sumut/sipiso_piso.webp",
    hotels: [
      "Malam 1: Samosir Cottages 4★ (pool & view Danau Toba)",
      "Malam 2: Hope Villa (view Bukit Sihotang & danau tenang)",
    ],
    description:
      "Rute favorit 3 hari 2 malam menginap di dua suasana hotel berbeda di Samosir, melewati Bah Damanik, Kebun Teh Sidamanik, Sabana Rumput Nadeak, Bukit Holbung, hingga Air Terjun Sipiso-piso Berastagi.",
    includes: [
      "Transportasi kereta SUV / Van Hiace full AC",
      "Supir Muslim lokal sekaligus tour guide & pendamping foto iPhone (menjaga jadwal sholat)",
      "Jaminan pilihan rumah makan halal sepanjang itinerary",
      "2 malam menginap: Samosir Cottages 4★ + Hope Villa (include sarapan, AC & setrika)",
      "Pickup & drop-off Bandara Kualanamu / Hotel Medan / Binjai",
      "Tiket masuk wisata, tol, parkir & seluruh penyeberangan ferry Danau Toba",
      "Gratis dokumentasi iPhone 4K Cinematic (unlimited foto, video & Reels siap posting; drone opsional by request)",
      "Welcome bouquet bunga & kalung bunga di airport + welcome fruit & snack",
    ],
    excludes: [
      "Makan pribadi selama trip",
      "Tiket pesawat (flight ticket)",
      "Aktivitas opsional jetski Seadoo Safari Samosir & request drone (bisa nego)",
    ],
    notes: [
      "Jika penerbangan pulang belum dibeli, disarankan bermalam di hotel Medan pada malam terakhir (opsional ~RM 70 / Rp 300.000 per kamar + free shuttle airport) agar hari ke-3 tidak terburu-buru mengejar pesawat.",
    ],
    tiers: [
      { pax: 1, vehicle: "Innova / SUV", priceMyr: 1650, label: "1 Orang (Dengan Hotel)" },
      { pax: 1, vehicle: "Innova / SUV", priceMyr: 1200, label: "1 Orang (Transport + Entrance Fee)" },
      { pax: 2, vehicle: "Innova / SUV", priceMyr: 800 },
      { pax: 3, vehicle: "Innova / SUV", priceMyr: 600 },
      { pax: 4, vehicle: "Innova / SUV", priceMyr: 550 },
      { pax: 5, vehicle: "Innova / SUV", priceMyr: 500 },
      { pax: 6, vehicle: "Innova / SUV", priceMyr: 475, label: "6 Orang (Innova)" },
      { pax: 6, vehicle: "Van Hiace", priceMyr: 600, label: "6 Orang (Van)" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Day 1: Kualanamu — Sidamanik — Parapat — Samosir",
        description:
          "Penjemputan pukul 09.00 di Bandara Kualanamu, mampir kuliner dan pemandian alam sebelum menyeberang sore ke Samosir.",
        stops: [
          { time: "09.15 – 10.00", place: "Ayam Penyet Cindelaras KNIA" },
          { time: "12.00 – 13.00", place: "Kolam Bening Bah Damanik" },
          { time: "13.10 – 13.30", place: "Kebun Teh Sidamanik" },
          { time: "14.30 – 15.30", place: "Makan siang di Biwa Coffee & Resto" },
          { time: "16.00 – 16.30", place: "Bukit Senyum viewpoint" },
          { time: "17.00 – 18.00", place: "Ferry crossing Ajibata – Ambarita" },
          { time: "18.30", place: "Check-in Samosir Cottages, sunset & dinner di ORARI Restaurant" },
        ],
      },
      {
        day: 2,
        title: "Day 2: Explore Pulau Samosir",
        description:
          "Sarapan tepi kolam renang Samosir Cottages, check-out pukul 09.00 lalu keliling situs budaya Batak dan savana pulau.",
        stops: [
          { time: "Opsional", place: "Seadoo Safari Samosir (Jetski)" },
          { time: "10.00 – 11.00", place: "Huta Siallagan" },
          { time: "11.15 – 12.30", place: "Pasar Tomok (souvenir khas Batak)" },
          { time: "13.00 – 14.00", place: "Makan siang di Janji Maria Coffee & Resto" },
          { time: "15.00 – 15.30", place: "Waterfront Pangururan" },
          { time: "16.00 – 16.30", place: "Sabana Rumput Nadeak" },
          { time: "17.30 – 20.30", place: "Check-in Hope Villa, sunset view Danau Toba & dinner" },
        ],
      },
      {
        day: 3,
        title: "Day 3: Holbung — Sipiso-piso — Berastagi — Medan",
        description:
          "Check-out Hope Villa pukul 09.00 lalu melintasi Ferry Pintu Batu – Sihotang menuju Berastagi dan Medan.",
        stops: [
          { time: "09.30 – 10.00", place: "Ferry crossing Pintu Batu – Sihotang" },
          { time: "11.00 – 12.00", place: "Bukit Holbung (sesi foto & video cinematic)" },
          { time: "12.30 – 13.30", place: "Bukit Cinta (spot panorama Danau Toba)" },
          { time: "13.45 – 14.30", place: "Makan siang di RM Raju Minang" },
          { time: "17.00 – 18.30", place: "Air Terjun Sipiso-piso (boleh turun ke bawah)" },
          { time: "19.30 – 20.30", place: "Makan malam di Puncak Resto Berastagi" },
          { time: "22.30", place: "Tiba di Hotel Medan atau Bandara Kualanamu" },
        ],
      },
    ],
  },
  {
    id: "3",
    shortLabel: "4D 3N",
    slug: "danau-toba-4d3n",
    name: "Switzerland Danau Toba 4 Days 3 Nights",
    duration: "4 Hari 3 Malam",
    locationTag: "Paropo, Sitiris-tiris, Holbung & Samosir",
    priceMyr: 450,
    priceIdr: 1980000,
    isFeatured: true,
    image_url: "/images/sumut/toba_landscape.webp",
    hotels: [
      "Malam 1: Ello Hotel Paropo (view Bukit Silalahi & Danau Toba)",
      "Malam 2: Hope Villa (view Bukit Sihotang)",
      "Malam 3: Samosir Cottages 4★",
    ],
    description:
      "Rute unggulan menuju sisi 'Switzerland Danau Toba' di Silalahi dan Air Terjun Sitiris-tiris naik sampan beserta dokumentasi foto & video iPhone 4K siap posting (opsional drone bisa request), ditambah Paropo, Holbung, dan Samosir.",
    includes: [
      "Transportasi SUV (1–6 pax Innova), Van Hiace (6–10 pax), ELF (15 pax), atau 2 Van (20 pax)",
      "Supir Muslim lokal sekaligus tour guide & pendamping foto iPhone (menjaga jadwal sholat)",
      "Jaminan pilihan rumah makan halal sepanjang itinerary",
      "3 malam hotel: Ello Hotel Paropo, Hope Villa & Samosir Cottages 4★ (sarapan, AC & setrika)",
      "Sewa sampan menuju Air Terjun Sitiris-tiris + sesi foto & video langsung di tepi air terjun",
      "Tiket wisata, tol, ferry Pintu Batu & Ambarita, serta gratis dokumentasi iPhone 4K + Reels highlight siap posting",
      "Welcome bouquet di airport Kualanamu, snack, buah & key chain",
    ],
    excludes: [
      "Makan pribadi selama trip",
      "Tiket pesawat (flight ticket)",
      "Jetski Seadoo Safari Samosir (opsional) & request drone (bisa nego)",
    ],
    notes: [
      "Day 2 melintasi jalur jalan sempit menuju Silalahi & Sitiris-tiris yang jarang dilalui operator umum agar tamu mendapatkan pemandangan terindah di Danau Toba.",
    ],
    tiers: [
      { pax: 1, vehicle: "Solo Trip", priceMyr: 1400, label: "Solo Trip" },
      { pax: 2, vehicle: "Innova / SUV", priceMyr: 750 },
      { pax: 3, vehicle: "Innova / SUV", priceMyr: 625 },
      { pax: 4, vehicle: "Innova / SUV", priceMyr: 550 },
      { pax: 5, vehicle: "Innova / SUV", priceMyr: 500 },
      { pax: 6, vehicle: "Innova", priceMyr: 450, label: "6 Orang (Innova)" },
      { pax: 6, vehicle: "Van Hiace", priceMyr: 600, label: "6 Orang (Hiace)" },
      { pax: 7, vehicle: "Van Hiace", priceMyr: 575 },
      { pax: 8, vehicle: "Van Hiace", priceMyr: 550 },
      { pax: 9, vehicle: "Van Hiace", priceMyr: 525 },
      { pax: 10, vehicle: "Van Hiace", priceMyr: 500 },
      { pax: 15, vehicle: "ELF", priceMyr: 475, label: "15 Orang (ELF)" },
      { pax: 20, vehicle: "2 Van Hiace", priceMyr: 500, label: "20 Orang (2 Van)" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Day 1: Kualanamu — Berastagi — Paropo",
        description:
          "Berangkat pukul 09.00 dari airport Kualanamu menyusuri dataran tinggi Karo menuju tepian tenang Danau Toba di Paropo.",
        stops: [
          { time: "09.15 – 10.00", place: "Ayam Penyet Cindelaras KNIA" },
          { time: "13.00 – 14.00", place: "Sarune Cafe Lavender + Makan siang" },
          { time: "15.00 – 16.00", place: "Air Terjun Sipiso-piso" },
          { time: "16.15 – 17.00", place: "Loken Barn" },
          { time: "17.30 – 18.00", place: "Paepira Lakeside" },
          { time: "18.30 – 21.15", place: "Check-in Ello Hotel Paropo, sunset & dinner" },
        ],
      },
      {
        day: 2,
        title: "Day 2: Silalahi & Sitiris-tiris ('Switzerland Danau Toba')",
        description:
          "Check-out pukul 08.30 menyusuri tepi danau Silalahi, menaiki sampan ke Air Terjun Sitiris-tiris, lalu berlanjut ke Tele dan Efrata.",
        stops: [
          { time: "08.30 – 09.00", place: "Jalan tepi bukit Silalahi" },
          { time: "09.30 – 11.00", place: "Sampan menuju Air Terjun Sitiris-tiris + sesi video tepi air" },
          { time: "12.00 – 13.00", place: "Makan siang di RM Muslim Yahya" },
          { time: "14.00 – 15.00", place: "Menara Pandang Tele" },
          { time: "15.15 – 16.00", place: "Air Terjun Efrata" },
          { time: "16.30 – 17.00", place: "Desa Agrowisata Singkam" },
          { time: "18.00", place: "Check-in Hope Villa & sunset view Danau Toba" },
        ],
      },
      {
        day: 3,
        title: "Day 3: Explore Samosir (Holbung — Nadeak — Tomok)",
        description:
          "Menyeberang ke Pulau Samosir dari Sihotang, mengabadikan panorama perbukitan savana dan singgah di Tomok.",
        stops: [
          { time: "09.30 – 10.00", place: "Ferry crossing Pintu Batu – Sihotang" },
          { time: "10.30 – 11.30", place: "Bukit Holbung (spot panorama 360°)" },
          { time: "12.00 – 13.00", place: "Bukit Cinta (spot foto senja/savana)" },
          { time: "13.30 – 14.30", place: "Makan siang di RM Raju Minang" },
          { time: "15.30 – 16.00", place: "Sabana Rumput Nadeak" },
          { time: "17.30 – 18.30", place: "Pasar Tomok (souvenir khas Batak)" },
          { time: "19.00", place: "Check-in Samosir Cottages & makan malam" },
        ],
      },
      {
        day: 4,
        title: "Day 4: Samosir — Sidamanik — Medan",
        description:
          "Mengunjungi Huta Siallagan lalu menyeberang ke Ajibata, menyusuri kebun teh dan makan malam di Medan sebelum ke bandara.",
        stops: [
          { time: "Opsional", place: "Seadoo Safari Samosir (Jetski)" },
          { time: "09.30 – 10.00", place: "Huta Siallagan" },
          { time: "10.30 – 11.30", place: "Ferry crossing Ambarita – Ajibata" },
          { time: "12.00 – 12.30", place: "Bukit Senyum" },
          { time: "13.00 – 14.00", place: "Makan siang di Damasus Resto" },
          { time: "15.30 – 17.00", place: "Kebun Teh Sidamanik & Kolam Bening Bah Damanik" },
          { time: "19.30 – 20.30", place: "Makan malam di Kampung Kecil Medan" },
          { time: "21.30", place: "Tiba di Bandara Kualanamu / Hotel Medan" },
        ],
      },
    ],
  },
  {
    id: "4",
    shortLabel: "5D 4N",
    slug: "danau-toba-5d4n",
    name: "Full Explore & Camping Holbung 5 Days 4 Nights",
    duration: "5 Hari 4 Malam",
    locationTag: "Paropo, Sitiris-tiris, Camping Holbung & Samosir",
    priceMyr: 550,
    priceIdr: 2420000,
    isFeatured: true,
    image_url: "/images/sumut/batak_house.webp",
    hotels: [
      "Malam 1: Ello Hotel Paropo",
      "Malam 2: Hope Villa Sihotang",
      "Malam 3: Camping Sunset & Sunrise di Bukit Holbung (atau ganti hotel jika tidak mau camping)",
      "Malam 4: Samosir Cottages 4★",
    ],
    description:
      "Paket paling lengkap 5 hari 4 malam meliputi Paropo, Sitiris-tiris Waterfall, bermalam camping dengan sunset, dinner & stargazing di Bukit Holbung, serta tur penuh Pulau Samosir dan Sidamanik.",
    includes: [
      "Transportasi SUV (1–6 pax Innova), Van Hiace (6–10 pax), ELF (15 pax), atau 2 Van (20 pax)",
      "Supir Muslim lokal sekaligus tour guide & pendamping foto iPhone (menjaga jadwal sholat)",
      "Jaminan pilihan rumah makan halal sepanjang itinerary",
      "3 malam hotel (Ello Hotel Paropo, Hope Villa, Samosir Cottages 4★) + 1 malam camping Bukit Holbung (bisa diganti hotel)",
      "Sampan menuju Air Terjun Sitiris-tiris & perlengkapan camping/masak di Holbung",
      "Tiket wisata, tol, ferry Pintu Batu & Ambarita, gratis dokumentasi iPhone 4K Cinematic + Reels highlight",
      "Welcome bouquet bunga di Kualanamu, snack, air mineral & key chain",
    ],
    excludes: [
      "Makan pribadi selama trip",
      "Tiket pesawat (flight ticket)",
      "Jetski Seadoo Safari Samosir (opsional) & request drone (bisa nego)",
    ],
    notes: [
      "Jika tamu tidak berkenan camping di Bukit Holbung pada malam ke-3, menginap akan dialihkan ke hotel nyaman dengan standar yang sama.",
    ],
    tiers: [
      { pax: 1, vehicle: "Solo Trip", priceMyr: 1800, label: "Solo Trip" },
      { pax: 2, vehicle: "Innova / SUV", priceMyr: 900 },
      { pax: 3, vehicle: "Innova / SUV", priceMyr: 850 },
      { pax: 4, vehicle: "Innova / SUV", priceMyr: 800 },
      { pax: 5, vehicle: "Innova / SUV", priceMyr: 750 },
      { pax: 6, vehicle: "Innova", priceMyr: 650, label: "6 Orang (Innova)" },
      { pax: 6, vehicle: "Van Hiace", priceMyr: 700, label: "6 Orang (Hiace)" },
      { pax: 10, vehicle: "Van Hiace", priceMyr: 600 },
      { pax: 15, vehicle: "ELF", priceMyr: 550, label: "15 Orang (ELF)" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Day 1: Kualanamu — Berastagi — Paropo",
        description: "Tiba di KNIA pukul 09.00, eksplorasi dataran tinggi hingga Paropo.",
        stops: [
          { time: "09.15 – 10.00", place: "Ayam Penyet Cindelaras KNIA" },
          { time: "13.00 – 14.00", place: "Sarune Cafe Lavender + Makan siang" },
          { time: "15.00 – 16.00", place: "Air Terjun Sipiso-piso (boleh turun)" },
          { time: "16.15 – 17.00", place: "Loken Barn" },
          { time: "17.30 – 18.00", place: "Paepira Lakeside" },
          { time: "18.30 – 21.15", place: "Check-in Ello Hotel Paropo, sunset & dinner" },
        ],
      },
      {
        day: 2,
        title: "Day 2: Silalahi & Air Terjun Sitiris-tiris",
        description: "Susur tepi danau Silalahi dan naik sampan ke Air Terjun Sitiris-tiris.",
        stops: [
          { time: "08.30 – 11.00", place: "Jalan Silalahi & Sitiris-tiris Waterfall (sesi foto tepi danau)" },
          { time: "12.00 – 13.00", place: "Makan siang di RM Muslim Yahya" },
          { time: "14.00 – 15.00", place: "Menara Pandang Tele" },
          { time: "15.30 – 16.00", place: "Desa Agrowisata Singkam" },
          { time: "17.00 – 21.00", place: "Check-in Hope Villa, sunset & dinner" },
        ],
      },
      {
        day: 3,
        title: "Day 3: Explore Samosir & Camping Bukit Holbung",
        description:
          "Melintasi Pintu Batu menuju Bukit Holbung, Bukit Cinta, Air Terjun Efrata, lalu bermalam camping di Bukit Holbung.",
        stops: [
          { time: "09.30 – 10.00", place: "Ferry crossing Pintu Batu – Sihotang" },
          { time: "10.30 – 11.30", place: "Bukit Holbung (spot panorama 360°)" },
          { time: "12.00 – 13.00", place: "Bukit Cinta (spot foto senja/savana)" },
          { time: "13.30 – 14.30", place: "Makan siang di RM Raju Minang" },
          { time: "15.00 – 16.00", place: "Air Terjun Efrata" },
          { time: "18.00 – selesai", place: "Sunset, masak, dinner & stargazing di Bukit Holbung" },
        ],
      },
      {
        day: 4,
        title: "Day 4: Sunrise Holbung — Sidihoni — Tomok",
        description:
          "Menikmati sunrise Bukit Holbung pukul 05.30 lalu menjelajah Danau Sidihoni, Sabana Nadeak, dan Pasar Tomok.",
        stops: [
          { time: "05.30 – 07.00", place: "Sunrise Bukit Holbung" },
          { time: "10.15 – 11.00", place: "Sarapan pagi di RM Raju Minang" },
          { time: "12.00 – 13.30", place: "Sabana Rumput Nadeak & Bukit Sidihoni" },
          { time: "14.00 – 15.00", place: "Makan siang di Tepi Coffee Pangururan" },
          { time: "16.00 – 17.00", place: "Pasar Tomok (souvenir Batak)" },
          { time: "17.30", place: "Check-in Samosir Cottages 4★, sunset & dinner" },
        ],
      },
      {
        day: 5,
        title: "Day 5: Huta Siallagan — Sidamanik — Medan",
        description:
          "Hari terakhir menyusuri Huta Siallagan, Sidamanik, hingga kuliner malam Medan sebelum ke bandara.",
        stops: [
          { time: "09.30 – 10.00", place: "Huta Siallagan (opsional Jetski sebelumnya)" },
          { time: "10.30 – 11.30", place: "Ferry crossing Ambarita – Ajibata" },
          { time: "12.00 – 14.00", place: "Bukit Senyum & makan siang di Damasus Resto" },
          { time: "15.30 – 17.00", place: "Kebun Teh Sidamanik & Kolam Bening Bah Damanik" },
          { time: "19.30 – 20.30", place: "Makan malam & kuliner di Kampung Kecil Medan" },
          { time: "21.30", place: "Tiba di Bandara Kualanamu / Hotel Medan" },
        ],
      },
    ],
  },
  {
    id: "5",
    shortLabel: "1 Hari",
    slug: "berastagi-highland-1d",
    name: "Private Day Trip Berastagi & Sipiso-piso 1 Hari",
    duration: "1 Hari",
    locationTag: "Berastagi, Tanah Karo",
    priceMyr: 185,
    priceIdr: 814000,
    isFeatured: false,
    image_url: "/images/sumut/berastagi.webp",
    hotels: ["Day trip tanpa menginap (kembali ke Medan malam hari)"],
    description:
      "Perjalanan sehari penuh ke dataran tinggi Berastagi mengunjungi Sarune Cafe Lavender, Air Terjun Sipiso-piso, Loken Barn, Taman Alam Lumbini, dan Pasar Buah.",
    includes: [
      "Transportasi SUV / Van full AC PP dari Medan",
      "Driver-guide Muslim lokal + gratis dokumentasi foto & video iPhone 4K",
      "Semua tiket masuk destinasi Berastagi & tol",
    ],
    excludes: ["Makan siang & malam pribadi", "Belanja buah/oleh-oleh"],
    notes: [
      "Tersedia opsi tambahan sunrise hiking Gunung Sibayak atau pemandian air panas Sidebuk-debuk.",
    ],
    tiers: [
      { pax: 2, vehicle: "SUV", priceMyr: 310 },
      { pax: 4, vehicle: "SUV", priceMyr: 215 },
      { pax: 6, vehicle: "Van Hiace", priceMyr: 185 },
    ],
    itinerary: [
      {
        day: 1,
        title: "Medan — Berastagi — Sipiso-piso — Medan",
        description: "Berangkat pagi dari Medan ke Tanah Karo dan kembali sore/malam.",
        stops: [
          { time: "08.00 – 10.30", place: "Berangkat dari Medan menuju Tanah Karo" },
          { time: "10.30 – 12.00", place: "Taman Alam Lumbini & Bukit Gundaling" },
          { time: "12.30 – 14.00", place: "Sarune Cafe Lavender + makan siang" },
          { time: "14.30 – 16.00", place: "Air Terjun Sipiso-piso & Loken Barn" },
          { time: "17.00 – 18.00", place: "Pasar Buah Berastagi & jagung bakar Penatapen" },
          { time: "20.30", place: "Kembali ke Hotel Medan" },
        ],
      },
    ],
  },
  {
    id: "6",
    shortLabel: "1 Hari",
    slug: "medan-city-tour-1d",
    name: "Medan Heritage & Culinary 1 Hari",
    duration: "1 Hari",
    locationTag: "Kota Medan",
    priceMyr: 145,
    priceIdr: 638000,
    isFeatured: false,
    image_url: "/images/sumut/maimun_palace.webp",
    hotels: ["Day trip / transit Bandara Kualanamu – Kota Medan"],
    description:
      "Keliling Kota Medan mengunjungi Istana Maimun, Masjid Raya Al-Mashun, Tjong A Fie Mansion, Kampung Kecil Medan, dan berburu kuliner halal serta durian khas Medan.",
    includes: [
      "Transportasi SUV / Van full AC",
      "Driver-guide lokal & foto dokumentasi",
      "Parkir, tol KNIA–Medan & tiket masuk destinasi",
    ],
    excludes: ["Belanja pribadi & oleh-oleh Bolu Meranti / Bika Ambon"],
    notes: ["Cocok untuk tamu yang tiba lebih awal atau menjelang jadwal penerbangan pulang."],
    tiers: [
      { pax: 2, vehicle: "SUV", priceMyr: 240 },
      { pax: 4, vehicle: "SUV", priceMyr: 165 },
      { pax: 6, vehicle: "Van Hiace", priceMyr: 145 },
    ],
    itinerary: [
      {
        day: 1,
        title: "Istana Maimun — Masjid Raya — Kuliner Medan",
        description: "City tour santai 8 jam seputar sejarah Kesultanan Deli dan kuliner halal Medan.",
        stops: [
          { time: "09.00 – 11.30", place: "Istana Maimun & Masjid Raya Al-Mashun" },
          { time: "12.00 – 13.30", place: "Makan siang di Kampung Kecil Medan" },
          { time: "14.00 – 15.30", place: "Tjong A Fie Mansion Kesawan" },
          { time: "16.00 – 17.30", place: "Belanja oleh-oleh khas Medan & durian" },
        ],
      },
    ],
  },
];

export function getPackageBySlug(slug: string): TourPackage | undefined {
  return TOUR_PACKAGES.find((p) => p.slug === slug);
}
