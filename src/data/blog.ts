export interface BlogSection {
  heading: string;
  paragraphs: string[];
}

export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: "Rute" | "Destinasi" | "Kuliner" | "Tips Liburan" | "Panduan Tamu";
  image_url: string;
  createdAt: string;
  updatedAt: string;
  readTime: string;
  relatedPackageSlug: string;
  tags: string[];
  sections: BlogSection[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    slug: "panduan-rute-kualanamu-berastagi-danau-toba",
    title: "Panduan Rute Darat Kualanamu (KNO) ke Berastagi, Paropo, dan Danau Toba",
    excerpt:
      "Ringkasan jalur darat resmi dari Bandara Internasional Kualanamu menuju Berastagi, Paropo, Parapat, hingga Pulau Samosir beserta pilihan durasi 2D1N sampai 5D4N.",
    category: "Rute",
    image_url: "/images/sumut/sumatra_panorama.webp",
    createdAt: "2025-10-12T08:00:00Z",
    updatedAt: "2026-11-01T08:00:00Z",
    readTime: "7 menit baca",
    relatedPackageSlug: "danau-toba-4d3n",
    tags: ["Bandara Kualanamu", "Rute Danau Toba", "Berastagi", "Paropo", "Samosir"],
    sections: [
      {
        heading: "1. Dua Arah Jalur Utama dari Bandara Kualanamu (KNO)",
        paragraphs: [
          "Setibanya di Bandara Internasional Kualanamu (KNO) di Deli Serdang, perjalanan menuju kawasan Danau Toba memiliki dua koridor darat utama. Memahami karakter dua jalur ini penting agar waktu tempuh efisien dan rombongan tidak memutar balik pada hari kepulangan.",
          "Jalur pertama melewati jalan tol Medan menuju Tebing Tinggi hingga Pematang Siantar, kemudian menanjak santai menuju Parapat sebagai gerbang timur Danau Toba. Jalur ini cocok bila penerbangan Anda tiba siang hari dan Anda memilih paket singkat 2 Hari 1 Malam langsung menuju tepian danau dan Pulau Samosir.",
          "Jalur kedua bergerak lewat selatan Medan mendaki dataran tinggi Tanah Karo menuju Berastagi, lalu turun memutari tepian barat laut Danau Toba melalui Air Terjun Sipiso-piso, Paropo, Silalahi, Tongging, hingga Tele dan Pulau Samosir. Koridor lingkar searah inilah yang dipakai dalam paket 3D2N, 4D3N, dan 5D4N agar tamu melihat lanskap pegunungan Karo dan kaldera danau dalam satu alur berurutan."
        ]
      },
      {
        heading: "2. Perkiraan Waktu Tempuh Antar Titik Lapangan",
        paragraphs: [
          "Pada kondisi lalu lintas normal, rute Bandara Kualanamu ke Pematang Siantar dan Kebun Teh Sidamanik memakan waktu sekitar 3 hingga 3,5 jam melewati jalur tol, lalu bersambung kurang lebih 1 jam ke Parapat. Dari pelabuhan Parapat atau Ajibata, penyeberangan ferry menuju Tomok atau Ambarita di Pulau Samosir berlangsung sekitar 45 hingga 60 menit.",
          "Sebaliknya, rute Kualanamu ke Berastagi melewati koridor Sembahe dan Sibolangit membutuhkan sekitar 2,5 hingga 3 jam tergantung kepadatan jalan pegunungan pada akhir pekan. Dari Berastagi menuju Tepian Paropo atau Air Terjun Sipiso-piso hanya sekitar 1,5 jam berkendara santai, sehingga nyaman bagi keluarga dengan anak kecil maupun orang tua."
        ]
      },
      {
        heading: "3. Memilih Durasi 2D1N, 3D2N, 4D3N, atau 5D4N",
        paragraphs: [
          "Untuk liburan singkat akhir pekan, paket Private Trip Danau Toba 2D1N memfokuskan waktu di Parapat, penyeberangan ke Samosir, Pasar Tomok, Bukit Holbung, dan Jembatan Tano Ponggol sebelum kembali ke Medan atau KNO pada sore hari kedua.",
          "Paket 3D2N memberi ruang ekstra untuk mampir ke Perkebunan Teh Sidamanik, pemandian alami Bah Damanik, dua malam di Samosir, Air Terjun Efrata, Bukit Sibeabea, serta pulangnya berhenti di Air Terjun Sipiso-piso dan Pasar Buah Berastagi.",
          "Bila Anda mengincar kawasan Paropo dan Silalahi yang populer dengan perairan jernih serta aktivitas naik sampan ke Air Terjun Sitiris-tiris, pilih paket 4D3N atau 5D4N. Durasi 5D4N juga memberi satu malam khusus berkemah santai di Bukit Holbung untuk menyaksikan matahari terbit di atas kaldera Toba."
        ]
      },
      {
        heading: "4. Kapasitas Armada SUV dan Van Hiace di Medan Berastagi",
        paragraphs: [
          "Kondisi jalan berkelok dan tanjakan panjang di sekitar Tele, Silalahi, dan Karo membutuhkan kendaraan bertenaga dan terawat. Untuk rombongan 1 hingga 4 orang dewasa beserta koper kabin, armada SUV atau MPV kelas Innova sangat ideal dan lincah menyusuri jalan desa tepi danau.",
          "Untuk rombongan keluarga besar berjumlah 5 hingga 10 orang, tim menyediakan armada Van Hiace atau Hiace Premio dengan kabin lapang dan bagasi memadai, didampingi pengemudi lokal yang hafal titik pemberhentian nyaman, masjid atau musholla di sepanjang jalan, serta restoran halal."
        ]
      },
      {
        heading: "5. Tips Mengatur Jam Kepulangan Agar Aman Menuju Flight KNO",
        paragraphs: [
          "Pada hari terakhir, perjalanan darat dari Samosir atau Berastagi menuju Bandara Kualanamu sebaiknya dimulai pukul 08.00 atau 09.00 WIB sesuai jadwal paket resmi. Menyisakan cadangan waktu minimal 3 jam sebelum jadwal terbang memberi ruang aman bila terjadi kepadatan lalu lintas di akses masuk kota Medan serta memberi kesempatan berhenti sebentar membeli oleh-oleh."
        ]
      }
    ]
  },
  {
    id: 2,
    slug: "pesona-danau-toba-yang-wajib-dikunjungi",
    title: "Panduan Penyeberangan Ferry Danau Toba dan Jalur Darat Samosir",
    excerpt:
      "Informasi praktis memilih dermaga penyeberangan ke Pulau Samosir, jalur jembatan darat Tano Ponggol di Pangururan, dan urutan kunjungan kampung adat Batak.",
    category: "Destinasi",
    image_url: "/images/sumut/toba_landscape.webp",
    createdAt: "2025-09-20T08:00:00Z",
    updatedAt: "2026-11-01T08:00:00Z",
    readTime: "6 menit baca",
    relatedPackageSlug: "danau-toba-3d2n",
    tags: ["Danau Toba", "Pulau Samosir", "Ferry Ajibata", "Tano Ponggol", "Huta Siallagan"],
    sections: [
      {
        heading: "1. Mengenal Pulau Samosir di Tengah Kaldera Toba",
        paragraphs: [
          "Pulau Samosir berada tepat di jantung Danau Toba dan dapat diakses melalui dua cara: menaiki ferry penumpang maupun kapal penyeberangan kendaraan dari sisi timur, atau berkendara langsung lewat darat melalui Kecamatan Tele dan Jembatan Tano Ponggol di Pangururan pada sisi barat.",
          "Dalam penyusunan itinerary privat, mengkombinasikan kedua akses tersebut adalah cara terbaik. Tamu merasakan pengalaman berlayar melintasi perairan danau saat berangkat menuju Tomok atau Ambarita, lalu pulang melewati jembatan darat Pangururan sambil singgah di Menara Pandang Tele dan perbukitan Holbung."
        ]
      },
      {
        heading: "2. Rute Dermaga Utama yang Sering Dipakai",
        paragraphs: [
          "Penyeberangan dari Pelabuhan Ajibata di Parapat menuju Tomok atau Pelabuhan Ambarita menjadi pilihan paling populer karena dermaganya tertata rapi dan berdekatan dengan area restoran halal di Parapat. Proses antre kendaraan di dermaga ditangani oleh pengemudi lokal kami sehingga tamu bisa bersantai di dek atas menikmati angin danau.",
          "Alternatif lainnya adalah lintasan dari Pelabuhan Tigaras menuju Simanindo di sisi utara Samosir yang efisien bila tamu bergerak dari arah Berastagi dan Tongging tanpa melewati pusat kota Parapat. Jadwal keberangkatan kapal umumnya tersedia sejak pagi hingga petang hari dengan penyesuaian kondisi cuaca perairan."
        ]
      },
      {
        heading: "3. Titik Budaya Utama: Huta Siallagan, Kampung Ulos Hutaraja, dan Tomok",
        paragraphs: [
          "Di pesisir timur Samosir, Desa Wisata Kampung Ulos Hutaraja memperlihatkan deretan rumah adat Bolon beratap ijuk serta pengrajin kain ulos yang menenun langsung memakai alat tenun tradisional di halaman kampung.",
          "Berjarak singkat dari sana, kawasan bersejarah Batu Persidangan Huta Siallagan dan Desa Tomok mengenalkan sejarah peradilan adat Batak lampau serta Makam Raja Sidabutar. Mengunjungi kedua kampung ini pada pukul 09.00 hingga 11.00 WIB jauh lebih teduh sebelum suhu siang meninggi."
        ]
      },
      {
        heading: "4. Jalur Pulang Lewat Pangururan, Sibeabea, Efrata, dan Tele",
        paragraphs: [
          "Setelah menuntaskan wisata tepi pantai pasir putih Parbaba dan kampung adat, perjalanan keluar pulau melewati Jembatan Tano Ponggol mengarah ke Bukit Sibeabea yang memiliki jalan berliku ikonik menghadap langsung ke teluk Danau Toba, lalu menanjak menuju Air Terjun Efrata serta Bukit Holbung di perbukitan Janji Martahan.",
          "Dari dataran tinggi Tele, tamu langsung melihat hamparan Danau Toba dan lereng Pusuk Buhit dari atas sebelum melanjutkan perjalanan ke Sidikalang, Taman Alam Lumbini di Berastagi, atau kembali langsung ke Medan."
        ]
      },
      {
        heading: "5. Fasilitas Masjid dan Area Istirahat di Pulau Samosir",
        paragraphs: [
          "Tamu Muslim tidak perlu khawatir saat berkeliling Samosir seharian penuh. Masjid dan musholla bersih tersedia strategis di kawasan Tomok, Pangururan, sekitar Pantai Pasir Putih Parbaba, hingga pelabuhan Parapat dan Ajibata. Pengemudi lokal kami selalu siap mengatur jeda shalat Zuhur dan Ashar sejalan dengan urutan persinggahan makan siang."
        ]
      }
    ]
  },
  {
    id: 3,
    slug: "kuliner-khas-medan-halal",
    title: "Rekomendasi Kuliner Halal Medan, Berastagi, dan Danau Toba untuk Tamu Malaysia & Singapura",
    excerpt:
      "Daftar makanan lokal Sumatera Utara yang halal, ramah selera Melayu Nusantara, dan lokasi persinggahan makan sepanjang rute Medan hingga Samosir.",
    category: "Kuliner",
    image_url: "/images/sumut/maimun_palace.webp",
    createdAt: "2025-09-10T10:30:00Z",
    updatedAt: "2026-11-01T08:00:00Z",
    readTime: "6 menit baca",
    relatedPackageSlug: "medan-city-tour-1d",
    tags: ["Kuliner Halal", "Medan", "Mie Gomak", "Soto Medan", "Durian"],
    sections: [
      {
        heading: "1. Jaminan Makanan Halal Selama Perjalanan Privat",
        paragraphs: [
          "Salah satu pertanyaan paling sering dari wisatawan Malaysia dan Singapura saat merencanakan liburan ke Danau Toba dan Samosir adalah ketersediaan rumah makan halal di kawasan tepi danau. Seluruh restoran yang dimasukkan dalam itinerary resmi Sumatera Explore adalah rumah makan Muslim atau restoran bersertifikasi halal yang telah diseleksi di sepanjang koridor Medan, Pematang Siantar, Parapat, Samosir, Paropo, dan Berastagi.",
          "Dalam seluruh paket resmi kami tertulis jaminan makanan halal 100 persen. Pengemudi kami juga terbiasa membantu menanyakan detail bahan kepada pihak dapur dan menyesuaikan tingkat kepedasan hidangan apabila rombongan membawa anak kecil maupun orang tua."
        ]
      },
      {
        heading: "2. Hidangan Khas Medan yang Cocok untuk Selera Melayu",
        paragraphs: [
          "Di pusat kota Medan, sarapan Lontong Medan dan Soto Medan menjadi menu pembuka yang cepat disukai wisatawan Semenanjung karena sama-sama memadukan kuah santan hangat berbumbu rempah Nusantara. Lontong Medan disajikan bersama sayur lodeh, tauco udang, ikan teri kacang, dan bihun goreng.",
          "Untuk makan siang di kota Medan, banyak grup menikmati sajian Melayu Deli, Kari Bihun Tabona dengan kaldu ayam atau sapi gurih, gulai kepala ikan bergaya Padang, serta hidangan di sekitar kawasan Istana Maimun dan Masjid Raya Al-Mashun."
        ]
      },
      {
        heading: "3. Sajian Tepi Danau Toba: Mie Gomak dan Ikan Mas Bakar",
        paragraphs: [
          "Saat makan siang di pinggir Danau Toba atau Parapat, menu andalan yang wajib dicoba tamu adalah olahan ikan air tawar segar seperti ikan nila bakar sambal kecap atau Ikan Mas Arsik bumbu kuning andaliman di restoran Muslim pinggir pantai danau.",
          "Selain hidangan nasi, kedai kopi dan sarapan di sekitar Parapat hingga perkebunan teh Sidamanik menyajikan Mie Gomak, mi lidi berukuran besar berkuah santan kuning kaya rempah yang cocok disantap hangat di udara sejuk."
        ]
      },
      {
        heading: "4. Buah Segar Berastagi dan Durian Medan",
        paragraphs: [
          "Ketika berhenti di Pasar Buah Berastagi, wisatawan gemar berburu markisa manis asli Karo, jeruk madu Berastagi tanpa biji, alpukat mentega, dan stroberi segar kebun. Pada sore hari di kota Medan sebelum check-in hotel atau pengantaran bandara, kedai durian Medan yang menyediakan buah durian kupas manis siap santap selalu menjadi agenda favorit tamu."
        ]
      },
      {
        heading: "5. Oleh-Oleh Populer yang Aman Dibawa Masuk Pesawat",
        paragraphs: [
          "Sebelum menuju Bandara Kualanamu di hari terakhir, tim biasa menyempatkan pemberhentian singkat ke gerai oleh-oleh resmi seperti Bika Ambon, Bolu Meranti, dan Pancake Durian beku kemasan kotak kedap udara agar aman dibawa sebagai bagasi atau kabin sesuai ketentuan maskapai tujuan Kuala Lumpur dan Singapura."
        ]
      }
    ]
  },
  {
    id: 4,
    slug: "switzerland-danau-toba-silalahi-paropo-sitiris-tiris",
    title: "Menjelajah Sisi Switzerland Danau Toba: Silalahi, Paropo, dan Air Terjun Sitiris-tiris",
    excerpt:
      "Kenapa kawasan Paropo, Silalahi, dan Air Terjun Sitiris-tiris menjadi sorotan paket 4D3N serta 5D4N lengkap dengan perjalanan sampan dan dokumentasi video 4K siap posting.",
    category: "Destinasi",
    image_url: "/images/sumut/sipiso_piso.webp",
    createdAt: "2025-10-25T09:00:00Z",
    updatedAt: "2026-11-01T08:00:00Z",
    readTime: "7 menit baca",
    relatedPackageSlug: "danau-toba-4d3n",
    tags: ["Silalahi", "Paropo", "Air Terjun Sitiris-tiris", "Cinematic 4K", "Danau Toba 4D3N"],
    sections: [
      {
        heading: "1. Perbedaan Karakter Tepian Paropo dan Silalahi Dibanding Parapat",
        paragraphs: [
          "Jika Parapat dan Tuk-Tuk lebih dikenal dengan deretan resor dan hotel besar tepi danau, koridor Paropo dan Silalahi di sisi barat laut kaldera menawarkan garis pantai berkerikil dengan latar tebing perbukitan curam yang langsung bertemu permukaan air jernih Danau Toba.",
          "Pemandangan perbukitan berlapis, udara pegunungan yang sejuk, dan tepian terbuka tanpa kepadatan bangunan membuat wilayah ini kerap disebut tamu sebagai Switzerland-nya Danau Toba. Pada sore hari, pantulan sinar matahari dari celah punggung bukit menciptakan gradasi air biru gelap keemasan yang tenang."
        ]
      },
      {
        heading: "2. Pengalaman Naik Sampan Menuju Air Terjun Sitiris-tiris",
        paragraphs: [
          "Salah satu momen unggulan pada hari kedua paket Switzerland Danau Toba 4D3N dan 5D4N adalah menyeberang dengan perahu sampan dari tepian Silalahi melintasi perairan tenang menuju Air Terjun Sitiris-tiris. Air terjun alami ini jatuh langsung dari dinding tebing berhutan ke permukaan Danau Toba.",
          "Berbeda dari air terjun lain yang hanya dipantau dari anjungan jauh, dari atas sampan rombongan dapat mendekat langsung ke dasar jatuhnya air, mandi air danau yang bersih di tepian tenang sekitar tebing, serta beristirahat di spot foto alam."
        ]
      },
      {
        heading: "3. Dokumentasi iPhone 4K Siap Posting di Atas Air & Opsi Drone",
        paragraphs: [
          "Cahaya alami dan pantulan perairan terbuka di sekitar Paropo, Silalahi, serta Air Terjun Sitiris-tiris menghasilkan rekaman yang tajam langsung lewat perangkat iPhone (4K Cinematic & Ultra-Wide) yang kami bawa gratis di setiap perjalanan—praktis untuk Reels, TikTok, dan potret keluarga.",
          "Seluruh sesi foto, rekaman video, hingga suntingan video highlight termasuk gratis tanpa biaya tambahan dan bisa langsung ditransfer hari itu juga lewat AirDrop atau WhatsApp. Jika rombongan ingin tambahan rekaman drone aerial di atas air, layanan drone bisa disesuaikan dan dinegosiasikan lebih awal bersama tim kami."
        ]
      },
      {
        heading: "4. Koneksi Rute ke Air Terjun Sipiso-piso dan Bukit Holbung",
        paragraphs: [
          "Secara geografis, Paropo dan Silalahi menghubungkan dua ikon pemandangan lain di barat Toba: Air Terjun Sipiso-piso yang menjulang di sisi Tongging dan hamparan sabana Bukit Holbung di perbukitan selatan. Pada paket 4D3N dan 5D4N, urutan persinggahan disusun searah agar perjalanan tetap santai tanpa bolak-balik di jalan yang sama."
        ]
      },
      {
        heading: "5. Persiapan Ringkas Sebelum Naik Sampan di Silalahi",
        paragraphs: [
          "Karena agenda hari kedua meliputi aktivitas perahu sampan dan bersantai di tepi air jernih Air Terjun Sitiris-tiris, tamu disarankan membawa baju ganti ringan, sandal pantai atau sepatu air, handuk kecil, serta pelindung ponsel tahan air agar bebas bergerak saat berfoto maupun bermain air di tepi danau."
        ]
      }
    ]
  },
  {
    id: 5,
    slug: "tips-liburan-keluarga-ke-berastagi",
    title: "Tips Liburan Keluarga ke Berastagi, Sidamanik, dan Bukit Holbung",
    excerpt:
      "Persiapan pakaian dingin, jadwal ramah keluarga dengan anak kecil maupun orang tua, serta aturan kunjungan taman wisata di dataran tinggi Karo dan Toba.",
    category: "Tips Liburan",
    image_url: "/images/sumut/berastagi.webp",
    createdAt: "2025-10-05T09:15:00Z",
    updatedAt: "2026-11-01T08:00:00Z",
    readTime: "6 menit baca",
    relatedPackageSlug: "berastagi-highland-1d",
    tags: ["Berastagi", "Liburan Keluarga", "Taman Alam Lumbini", "Sidamanik", "Holbung"],
    sections: [
      {
        heading: "1. Suhu Dataran Tinggi Berastagi dan Perlengkapan yang Dibutuhkan",
        paragraphs: [
          "Berada di ketinggian sekitar 1.300 meter di atas permukaan laut, kota Berastagi di Tanah Karo memiliki udara pegunungan yang sejuk pada siang hari dan dapat turun di bawah 18 derajat Celsius pada malam hingga pagi hari. Hembusan angin lembah di tepian Paropo maupun punggung Bukit Holbung juga terasa dingin menjelang matahari terbit.",
          "Siapkan jaket tahan angin, kaus kaki hangat untuk tidur bila menginap di hotel resort daerah Karo atau tenda Holbung, serta alas kaki bersol antiselip agar aman berjalan di pematang kebun teh Sidamanik maupun jalur batu alami air terjun."
        ]
      },
      {
        heading: "2. Tempat Ramah Anak dan Lansia di Rute Berastagi Highland",
        paragraphs: [
          "Bagi keluarga yang bepergian bersama anak kecil maupun orang tua, titik wisata Berastagi tergolong sangat ramah karena akses kendaraan dekat ke pintu masuk. Taman Alam Lumbini memiliki area pelataran rata dan taman bunga luas mengelilingi replika Pagoda Shwedagon berlapis warna keemasan.",
          "Di sekitarnya, keluarga dapat mampir ke Pasar Buah Berastagi, kebun stroberi musiman, menikmati panorama gunung berapi aktif Gunung Sibayak dari Bukit Gundaling, atau berendam di Pemandian Air Panas Belerang Sidebuk-debuk pada sore hari sebelum kembali beristirahat di hotel."
        ]
      },
      {
        heading: "3. Kebijakan Anak dan Fleksibilitas Ritme Private Trip",
        paragraphs: [
          "Pada seluruh paket resmi Sumatera Explore, anak berusia di bawah 5 tahun tidak dikenakan biaya dasar paket selama bergabung dengan orang tua, sedangkan anak berusia 6 hingga 11 tahun memakai perhitungan tarif 75 persen. Karena sifat perjalanan adalah 100 persen privat tanpa digabung peserta lain, jam makan maupun waktu istirahat balita dapat disesuaikan di lapangan."
        ]
      },
      {
        heading: "4. Waktu Kunjungan Terbaik Mengambil Foto Gunung Sinabung dan Danau Toba",
        paragraphs: [
          "Langit di dataran tinggi Tanah Karo dan lingkar Danau Toba umumnya paling terang pada pagi hingga menjelang tengah hari antara pukul 07.00 sampai 11.30 WIB sebelum kabut gunung turun pada sore hari. Itulah sebabnya jadwal penjemputan dari hotel dimulai pukul 08.00 atau 09.00 WIB agar seluruh foto pemandangan didapat dalam kondisi cahaya cerah."
        ]
      },
      {
        heading: "5. Pilihan Paket Harian vs Menginap Semalam di Berastagi",
        paragraphs: [
          "Bila waktu liburan Anda terbatas di kota Medan, paket Berastagi Highland 1 Hari sudah cukup mencakup Taman Alam Lumbini, Pasar Buah Berastagi, Bukit Gundaling, dan Pemandian Air Panas Sidebuk-debuk dalam satu hari penuh. Namun untuk rombongan yang menginginkan suasana malam dataran tinggi di Mikie Holiday Resort atau melanjutkan jalan esok pagi ke Paropo dan Danau Toba, paket 3D2N atau 4D3N jauh lebih santai."
        ]
      }
    ]
  },
  {
    id: 6,
    slug: "cara-booking-dan-ketentuan-tamu-malaysia-singapura",
    title: "Panduan Booking Trip Danau Toba dari Malaysia & Singapura (Kurs MYR, SGD, & Flight KNO)",
    excerpt:
      "Penjelasan lengkap penyesuaian jam penerbangan ke Kualanamu, konversi harga grup 1 hingga 10 orang, serta sistem deposit dan pelunasan setelah trip selesai.",
    category: "Panduan Tamu",
    image_url: "/images/sumut/hotel_room.webp",
    createdAt: "2025-11-02T08:00:00Z",
    updatedAt: "2026-11-05T08:00:00Z",
    readTime: "6 menit baca",
    relatedPackageSlug: "danau-toba-2d1n",
    tags: ["MYR", "SGD", "Booking Privat", "Wise", "Kualanamu"],
    sections: [
      {
        heading: "1. Mengatur Jam Penerbangan Kuala Lumpur atau Singapura ke Kualanamu",
        paragraphs: [
          "Bandara Internasional Kualanamu (KNO) dilayani penerbangan langsung harian dari Kuala Lumpur (KUL), Penang (PEN), Johor Bahru (JHB), serta Singapura (SIN). Perlu diingat bahwa waktu Medan (WIB, GMT+7) lebih awal 1 jam di belakang waktu Malaysia dan Singapura (GMT+8).",
          "Untuk durasi 2 Hari 1 Malam dan 3 Hari 2 Malam, penerbangan pagi tiba di Kualanamu antara pukul 08.00 sampai 11.00 WIB paling ideal supaya perjalanan darat hari pertama ke Berastagi atau Parapat masih mendapatkan cahaya siang yang lapang untuk singgah ke destinasi awal."
        ]
      },
      {
        heading: "2. Membaca Struktur Harga per Orang (Grup 1-4 SUV dan 5-10 Van Hiace)",
        paragraphs: [
          "Pada setiap halaman detail paket di Sumatera Explore, harga dihitung terbuka per orang dari skala 1 sampai 10 peserta. Semakin besar jumlah anggota keluarga atau rombongan Anda, biaya transportasi SUV atau Van Hiace dan ferry penyeberangan terbagi rata sehingga tarif per kepala menjadi jauh lebih hemat.",
          "Tarif resmi sudah memasukkan hotel pilihan setara Mikie Holiday Resort di Berastagi, Niagara atau Khas Parapat, Marianna Resort di Pulau Samosir, atau tenda Camp Holbung sesuai durasi paket pilihan Anda."
        ]
      },
      {
        heading: "3. Pembayaran Mudah dalam MYR, SGD, atau IDR serta Pelunasan Akhir",
        paragraphs: [
          "Wisatawan dari Malaysia dan Singapura dapat memeriksa perkiraan tarif langsung menggunakan tombol pengalih mata uang MYR, SGD, dan IDR pada bilah atas situs kami. Untuk penguncian kamar hotel dan armada kendaraan, proses konfirmasi memakai deposit melalui transfer bank lokal maupun transfer internasional Wise.",
          "Sesuai prinsip transparansi pada pricelist resmi kami, pengemudi ditanggung hotel serta makannya oleh operator tanpa biaya tambahan di lokasi, dan pelunasan sisa biaya diselesaikan langsung setelah seluruh rangkaian perjalanan selesai di Medan."
        ]
      },
      {
        heading: "4. Apa Saja yang Termasuk dan Tidak Termasuk agar Bebas Salah Paham",
        paragraphs: [
          "Seluruh komponen inti perjalanan seperti mobil privat ber-AC, bahan bakar, tol, biaya parkir, tiket masuk objek wisata tercantum, penyeberangan ferry Toba, hotel sarapan pagi, hingga dokumentasi gratis foto dan video iPhone 4K siap posting sudah tercakup dalam paket (kebutuhan drone opsional bisa didiskusikan lewat WhatsApp).",
          "Komponen di luar paket utama meliputi tiket pesawat pulang-pergi menuju KNO, makan malam atau siang pribadi bila mengambil paket tanpa fullboard makan, keperluan pribadi selama jalan-jalan, serta tipping sukarela bagi kru lapangan."
        ]
      },
      {
        heading: "5. Langkah Praktis Konfirmasi Jadwal lewat WhatsApp",
        paragraphs: [
          "Saat menghubungi tim kami lewat WhatsApp, cukup kirimkan tanggal kedatangan, perkiraan jam mendarat di Kualanamu, jumlah peserta dewasa dan anak-anak, serta paket pilihan 2D1N, 3D2N, 4D3N, atau 5D4N. Tim segera mengonfirmasi ketersediaan hotel beserta rincian total tarif dalam MYR, SGD, atau IDR."
        ]
      }
    ]
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
