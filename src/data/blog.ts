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
  },
  {
    id: 7,
    slug: "wisata-danau-toba-dari-malaysia",
    title: "Panduan Lengkap Wisata Danau Toba dari Malaysia: Penerbangan, Border, dan Estimasi Biaya MYR",
    excerpt:
      "Panduan praktis bagi wisatawan Malaysia yang ingin ke Danau Toba: pilihan penerbangan KL–Medan, proses imigrasi, estimasi budget perjalanan dalam Ringgit Malaysia, dan tips trip yang efisien.",
    category: "Panduan Tamu",
    image_url: "/images/sumut/toba_hero.webp",
    createdAt: "2026-10-05T08:00:00Z",
    updatedAt: "2026-11-15T08:00:00Z",
    readTime: "8 menit baca",
    relatedPackageSlug: "danau-toba-4d3n",
    tags: ["Malaysia", "MYR", "Penerbangan KUL-KNO", "Danau Toba", "Panduan Tamu"],
    sections: [
      {
        heading: "1. Kenapa Danau Toba Wajib Masuk Bucket List Traveller Malaysia",
        paragraphs: [
          "Danau Toba bukan sekadar tasik biasa — ia adalah kaldera gunung berapi purba terbesar di dunia, terletak di jantung Sumatera Utara, dengan kedalaman mencecah 505 meter dan luas hampir 1.130 kilometer persegi. Dari segi landskap, ia menyerupai laut dalaman yang dikelilingi bukit-bukit hijau berjela, dengan Pulau Samosir yang terapung bagai syurga tersembunyi di tengahnya.",
          "Bagi rakyat Malaysia, Danau Toba menawarkan sesuatu yang jarang ditemui dalam pakej pelancongan biasa: persekitaran alam semula jadi yang belum terlalu komersial, kos perjalanan yang sangat berpatutan dalam Ringgit Malaysia, makanan halal yang mudah ditemui, serta mesra budaya Melayu kerana ramai penduduk tempatan fasih berbahasa Melayu dan beragama Islam.",
          "Jarak terbang dari Kuala Lumpur ke Medan hanya sekitar 1 jam 10 minit — lebih dekat daripada ke Kota Kinabalu! Namun ramai rakyat Malaysia masih belum menyedari betapa mudah dan murahnya perjalanan ke Danau Toba. Panduan ini hadir untuk menjawab semua pertanyaan tersebut dari A hingga Z."
        ]
      },
      {
        heading: "2. Pilihan Penerbangan dari Malaysia ke Medan (Bandara Kualanamu / KNO)",
        paragraphs: [
          "Gerbang udara utama ke kawasan Danau Toba adalah Bandara Internasional Kualanamu (KNO) di Deli Serdang, Sumatera Utara. Dari Malaysia, terdapat beberapa pilihan penerbangan langsung yang beroperasi harian.",
          "Dari Kuala Lumpur (KLIA / KUL): AirAsia dan Malaysia Airlines menerbangkan laluan KUL–KNO setiap hari. Masa penerbangan sekitar 1 jam 10 minit. Tambang AirAsia boleh serendah MYR 80–150 (sehala, termasuk duti) jika ditempah awal, manakala MAS menawarkan lebih banyak bagasi termasuk. Penerbangan pagi dari KLIA bertolak sekitar pukul 07:00–09:00 WM dan mendarat di Medan antara pukul 07:00–09:00 WIB (Medan 1 jam lebih lambat dari Malaysia).",
          "Dari Penang (PEN): AirAsia menerbangkan laluan Penang–Medan beberapa kali seminggu, tambang boleh serendah MYR 60–100 sehala. Masa penerbangan hanya 35–40 minit. Ini pilihan terbaik untuk pelancong dari Utara Semenanjung.",
          "Dari Johor Bahru (JHB / Senai): AirAsia juga menerbangkan laluan JHB–KNO beberapa kali seminggu. Sesuai untuk pelancong dari Selatan Semenanjung atau Singapura yang lebih mudah ke Senai.",
          "Tips tempah tiket: Gunakan Google Flights atau laman web terus AirAsia untuk perbandingan harga. Tempah tiket pulang-pergi sekurang-kurangnya 6–8 minggu awal untuk mendapat harga terbaik. Pastikan terbang pagi (mendarat sebelum tengahari) supaya hari pertama di Medan boleh terus ke destinasi."
        ]
      },
      {
        heading: "3. Proses Imigrasi & Kemasukan ke Indonesia",
        paragraphs: [
          "Rakyat Malaysia tidak memerlukan visa untuk melawat Indonesia bagi tempoh tidak melebihi 30 hari. Ini adalah kemudahan Bebas Visa yang diberikan Indonesia kepada warganegara Malaysia — proses masuk sangat mudah dan pantas.",
          "Dokumen yang diperlukan: Pasport Malaysia yang sah dengan sekurang-kurangnya 6 bulan tempoh sah baki. Tiket penerbangan pulang atau laluan keluar Indonesia. Anda tidak perlu mengisi borang imigrasi kertas — Indonesia kini menggunakan sistem digital di banyak bandara termasuk Kualanamu.",
          "Di Kaunter Imigrasi KNO: Antri di kaunter imigrasi, imbas pasport, cap jari (biometrik), dan anda selesai dalam masa 5–10 minit. Proses keseluruhan di lapangan terbang dari mendarat hingga keluar terminal biasanya mengambil masa 20–35 minit.",
          "Penting: Simpan bukti penginapan (nama hotel atau nama operator trip) untuk ditunjukkan kepada pegawai imigrasi jika ditanya. Operator kami akan menghantar itinerary rasmi ke e-mel anda selepas pengesahan tempahan."
        ]
      },
      {
        heading: "4. Estimasi Bajet Perjalanan dalam Ringgit Malaysia (MYR)",
        paragraphs: [
          "Berikut adalah anggaran kos perjalanan untuk pakej 4 Hari 3 Malam Danau Toba & Berastagi bagi 2 orang dewasa. Kadar pertukaran yang digunakan: 1 MYR ≈ IDR 4,400.",
          "Tiket penerbangan pulang-pergi (2 orang, AirAsia KUL–KNO–KUL): MYR 400–600. Pakej trip privat 4D3N (termasuk hotel, kenderaan, dokumentasi, tiket masuk): mulai MYR 700–1,000 per orang, jumlah 2 orang MYR 1,400–2,000. Hotel premium (jika ditingkatkan di luar pakej): tiada kos tambahan kerana hotel sudah termasuk dalam pakej. Makan malam (tidak termasuk dalam pakej, 3 malam × 2 orang × MYR 15–25): MYR 90–150. Oleh-oleh dan belanja peribadi: MYR 100–200. Jumlah keseluruhan anggaran: MYR 2,000–3,000 untuk 2 orang selama 4 hari 3 malam.",
          "Perbandingan: Bajet yang sama untuk pakej Pulau Langkawi domestik atau Bali biasanya melebihi MYR 3,500–5,000 untuk 2 orang. Danau Toba menawarkan nilai yang jauh lebih baik dengan pengalaman alam yang lebih unik dan jarang dikunjungi pelancong Malaysia."
        ]
      },
      {
        heading: "5. Tips Penting untuk Pelancong Malaysia ke Danau Toba",
        paragraphs: [
          "Menukar wang: Tukar Ringgit ke Rupiah di kaunter money changer berdaftar di KLIA sebelum berlepas, atau di kaunter money changer di Medan selepas mendarat. Jangan tukar di hotel kerana kadar sering tidak kompetitif. Kad ATM Visa/Mastercard Malaysia juga boleh digunakan di mesin ATM BCA atau BNI di Medan.",
          "SIM kad: Beli SIM kad Telkomsel atau XL di airport Kualanamu terus — harga sekitar MYR 15–25 untuk pakej data 10GB–20GB yang cukup untuk 4–5 hari. Liputan 4G di kawasan Berastagi dan Danau Toba secara amnya baik di tempat-tempat utama.",
          "Makanan halal: Ini bukan isu di Medan dan kawasan Danau Toba. Majoriti restoran di koridor Medan–Berastagi–Parapat adalah restoran Muslim atau halal. Operator kami memastikan 100% makanan halal dalam semua pakej rasmi.",
          "Bahasa: Ramai penduduk tempatan memahami bahasa Melayu kerana kesamaan bahasa. Pemandu kami juga boleh berkomunikasi dalam bahasa Melayu dan Inggeris dengan lancar.",
          "Hubungi kami melalui WhatsApp sebelum bertolak untuk pengesahan tempahan, itinerary rasmi, dan panduan terkini mengenai cuaca serta laluan."
        ]
      }
    ]
  },
  {
    id: 8,
    slug: "itinerary-5-hari-4-malam-toba-berastagi",
    title: "Itinerary 5 Hari 4 Malam Toba & Berastagi: Panduan Lengkap Medan – Danau Toba – Samosir – Berastagi",
    excerpt:
      "Itinerary detail 5D4N lengkap dari Medan ke Danau Toba, Pulau Samosir, Silalahi, Paropo, Bukit Holbung, hingga Berastagi — cocok untuk keluarga dan rombongan dari Malaysia dan Singapura.",
    category: "Rute",
    image_url: "/images/sumut/toba_landscape.webp",
    createdAt: "2026-10-10T09:00:00Z",
    updatedAt: "2026-11-15T08:00:00Z",
    readTime: "10 menit baca",
    relatedPackageSlug: "danau-toba-5d4n",
    tags: ["Itinerary 5D4N", "Danau Toba", "Berastagi", "Samosir", "Rombongan Keluarga"],
    sections: [
      {
        heading: "Sebelum Mulai: Penjemputan & Orientasi",
        paragraphs: [
          "Itinerary 5 Hari 4 Malam (5D4N) adalah paket paling komprehensif yang kami tawarkan dan dirancang untuk memberikan pengalaman menyeluruh kawasan Sumatera Utara: dari kota bersejarah Medan, dataran tinggi Karo di Berastagi, tepi barat kaldera Danau Toba yang jarang dikunjungi di Silalahi dan Paropo, hingga pesisir Pulau Samosir dengan budaya Batak yang kaya.",
          "Seluruh perjalanan menggunakan kendaraan privat — tidak ada bus umum, tidak ada tamu asing yang digabung. Anda atau rombongan keluarga menempati kendaraan sendiri bersama pengemudi dan pemandu lokal kami yang berpengalaman, berbahasa Melayu dan Inggris."
        ]
      },
      {
        heading: "Hari 1 — Medan: Kota Bersejarah & Budaya Melayu Deli",
        paragraphs: [
          "Pagi hari, pengemudi menjemput rombongan di Bandara Internasional Kualanamu (KNO). Setelah istirahat sebentar di hotel Medan untuk check-in dan sarapan, City Tour Medan dimulai sekitar pukul 10:00 WIB.",
          "Destinasi Hari 1 (Medan): Istana Maimun (istana bersejarah Kesultanan Deli bergaya Melayu-Moorish, dibangun 1888) → Masjid Raya Al-Mashun (masjid ikonik bergaya Ottoman-India, landmark kota Medan) → Kawasan Kesawan dan Jalan Semarang (arsitektur kolonial Belanda, bangunan tua peninggalan era perkebunan tembakau) → Makan siang di restoran halal lokal (coba Soto Medan atau Lontong Medan) → Menara Air Tirtanadi (ikon kota) → Makan malam di kawasan Simpang Lima, lanjut coba durian Medan kupas segar.",
          "Bermalam: Hotel bintang 3-4 di pusat kota Medan (sekitar Sudirman/Imam Bonjol) — sarapan pagi termasuk dalam paket."
        ]
      },
      {
        heading: "Hari 2 — Pematang Siantar, Sidamanik & Parapat (Danau Toba)",
        paragraphs: [
          "Berangkat dari Medan pukul 08:00 WIB, perjalanan melalui jalan tol Medan–Tebing Tinggi kemudian ke Pematang Siantar (sekitar 2,5 jam). Di Pematang Siantar, singgah sebentar untuk foto di becak motor antik khas Siantar dan kunjungan singkat ke pusat kota bersejarah.",
          "Dari Siantar, perjalanan berlanjut ke Kebun Teh Sidamanik (sekitar 45 menit) — hamparan perkebunan teh hijau luas milik PTPN IV dengan udara segar pegunungan. Sempat sarapan/snack Mie Gomak hangat di kedai teh Sidamanik.",
          "Siang hari, tiba di Parapat di tepi Danau Toba. Makan siang di restoran halal pinggir danau (coba Ikan Mas Arsik atau Nila Bakar). Sore hari, penyeberangan dengan ferry dari Pelabuhan Ajibata menuju Pulau Samosir (45–60 menit berlayar sambil menikmati pemandangan kaldera).",
          "Bermalam: Marianna Resort atau Samosir Cottage di Pulau Samosir, kamar menghadap danau — sarapan pagi termasuk."
        ]
      },
      {
        heading: "Hari 3 — Eksplorasi Pulau Samosir: Budaya Batak & Pantai Pasir Putih",
        paragraphs: [
          "Pagi di Samosir adalah waktu paling indah — danau tenang dengan kabut tipis di pagi buta, suhu sejuk sekitar 22–24°C. Setelah sarapan, kunjungan ke destinasi budaya Samosir dimulai sekitar pukul 09:00 WIB.",
          "Destinasi Hari 3 (Samosir): Desa Tomok → Makam Raja Sidabutar (situs bersejarah abad ke-16) → Kampung Ulos Hutaraja (lihat penenun ulos Batak tradisional di halaman rumah adat) → Batu Persidangan Huta Siallagan (tempat pengadilan adat Batak kuno) → Makan siang di restoran halal Samosir → Pantai Pasir Putih Parbaba (berenang di air Danau Toba yang jernih kebiruan, foto dan bermain air) → Bukit Holbung atau Desa Lumban Suhi-suhi untuk foto sunset.",
          "Malam di Samosir: Nikmati makan malam di tepi danau, langit bintang di Samosir yang bebas polusi cahaya sangat memukau. Bermalam malam kedua di Samosir."
        ]
      },
      {
        heading: "Hari 4 — Silalahi, Paropo & Air Terjun Sitiris-tiris (Switzerland of Toba)",
        paragraphs: [
          "Hari keempat adalah favorit banyak tamu karena kawasan Silalahi dan Paropo di barat laut Danau Toba menawarkan pemandangan kaldera yang berbeda — tebing curam bertemu langsung dengan perairan biru jernih, minim bangunan, dan sangat fotogenik.",
          "Itinerary Hari 4: Keluar Samosir lewat Jembatan Tano Ponggol – Pangururan (melewati Menara Pandang Tele dengan panorama Danau Toba dari atas) → Turun ke Silalahi → Naik sampan tradisional ke Air Terjun Sitiris-tiris (momen paling epic: air terjun alami jatuh langsung ke permukaan Danau Toba, bisa mendekat dengan sampan) → Mandi dan foto di spot air terjun → Makan siang sederhana di warung Silalahi atau Paropo → Tiba di Paropo, istirahat dan foto golden hour.",
          "Bermalam: Penginapan tepi danau di Paropo atau Tongging — suasana sangat tenang, cocok untuk istirahat total. Langit senja di Paropo menghadap danau sangat dramatis."
        ]
      },
      {
        heading: "Hari 5 — Sipiso-piso, Berastagi & Kepulangan",
        paragraphs: [
          "Hari terakhir diisi dengan destinasi-destinasi kelas dunia di Tanah Karo sebelum menuju bandara. Berangkat dari penginapan Paropo/Tongging pukul 08:00 WIB.",
          "Destinasi Hari 5: Air Terjun Sipiso-piso (salah satu air terjun tertinggi Indonesia, 120 meter, dengan panorama Danau Toba dari puncak tebing) → Kota Berastagi: Pasar Buah Berastagi (beli markisa, jeruk madu, stroberi, alpukat — harga petani langsung) → Taman Alam Lumbini (replika Pagoda Shwedagon berlapis emas) → Bukit Gundaling (panorama Gunung Sibayak dan Gunung Sinabung) → Oleh-oleh khas Medan di toko resmi (Bika Ambon, Bolu Meranti, Pancake Durian beku).",
          "Pengantaran ke Bandara Kualanamu (KNO) dimulai pukul 14:00–15:00 WIB tergantung jam penerbangan. Waktu tempuh Berastagi–KNO sekitar 2,5–3 jam, sudah diperhitungkan dengan buffer 3 jam sebelum boarding. Perjalanan pulang yang berkesan dari Sumatera Utara!"
        ]
      }
    ]
  },
  {
    id: 9,
    slug: "kuliner-halal-medan-dan-sekitar-danau-toba",
    title: "Kuliner Halal Terbaik di Medan, Parapat & Berastagi: Rekomendasi Warung dan Restoran Pilihan",
    excerpt:
      "Panduan kuliner halal lengkap selama perjalanan ke Danau Toba: dari sarapan Lontong Medan, Soto Medan, Mie Gomak Parapat, Ikan Mas Arsik, hingga buah segar Berastagi dan oleh-oleh khas.",
    category: "Kuliner",
    image_url: "/images/sumut/maimun_palace.webp",
    createdAt: "2026-10-20T09:30:00Z",
    updatedAt: "2026-11-15T08:00:00Z",
    readTime: "7 menit baca",
    relatedPackageSlug: "danau-toba-4d3n",
    tags: ["Kuliner Halal", "Medan", "Parapat", "Berastagi", "Mie Gomak", "Ikan Arsik"],
    sections: [
      {
        heading: "1. Jaminan Halal 100% Sepanjang Perjalanan",
        paragraphs: [
          "Pertanyaan paling sering dari tamu Malaysia dan Singapura sebelum berangkat adalah: 'Mudah tak cari makanan halal di Danau Toba?' Jawabannya: sangat mudah. Kawasan koridor Medan–Pematang Siantar–Parapat–Berastagi didominasi oleh rumah makan Muslim dan warung halal yang sudah beroperasi puluhan tahun.",
          "Dalam semua paket resmi Sumatera Explore, pemandu dan pengemudi kami sudah hafal titik-titik makan halal terpercaya di setiap persinggahan. Kami tidak akan membawa tamu ke restoran yang meragukan. Jika ada menu tertentu yang perlu dipastikan, pengemudi kami siap menanyakan langsung ke dapur. Anak kecil dan orang tua dengan selera khusus? Tingkat kepedasan juga bisa disesuaikan."
        ]
      },
      {
        heading: "2. Kuliner Wajib Coba di Medan",
        paragraphs: [
          "Lontong Medan: Sajian sarapan khas ibu kota Sumatera Utara ini terdiri dari lontong (nasi padat dibungkus daun pisang) disiram kuah sayur lodeh santan dengan pelengkap bihun goreng, teri kacang, perkedel, dan sambal. Teksturnya ringan namun mengenyangkan, cocok sebelum perjalanan jauh.",
          "Soto Medan: Berbeda dari soto di Jawa, Soto Medan menggunakan kuah santan berwarna kuning keemasan dengan rempah bercita rasa kuat — campuran kunyit, serai, lengkuas, dan kayu manis. Disajikan dengan ayam atau daging sapi, telur rebus, dan emping. Sangat cocok untuk selera Melayu.",
          "Nasi Gurih Melayu Deli: Di kawasan sekitar Istana Maimun dan Masjid Raya Al-Mashun, banyak kedai menyajikan nasi gurih ala Melayu Deli dengan lauk pilihan: gulai ayam, rendang, telur balado, perkedel jagung, dan ikan goreng kering.",
          "Durian Medan: Agenda wajib sore hari sebelum check-in hotel atau ke bandara. Durian Medan terkenal dagingnya tebal, legit, bercita rasa pahit-manis yang khas. Harga per buah mulai Rp 50.000–150.000 (sekitar MYR 11–34) tergantung ukuran dan jenis."
        ]
      },
      {
        heading: "3. Kuliner Tepi Danau Toba & Parapat",
        paragraphs: [
          "Mie Gomak: Dijuluki 'Spageti Batak' oleh tamu internasional, Mie Gomak adalah mi lidi berukuran besar berkuah santan kuning dengan bumbu andaliman (lada khas Batak yang memberikan sensasi kebas-pedas unik di mulut). Sangat cocok disantap hangat di udara sejuk tepi danau.",
          "Ikan Mas Arsik: Hidangan ikan mas yang dimasak dengan bumbu kuning khas Batak (kunyit, bawang merah, kemiri, andaliman, kecombrang) hingga meresap sempurna. Daging ikan lunak dan beraroma, kuah bumbunya bisa dijadikan cocolan nasi. Ini menu ikonik yang wajib dicoba sekali seumur hidup di tepi Danau Toba.",
          "Ikan Nila Bakar Sambal: Ikan nila segar dari Danau Toba yang dibakar di atas arang dan disajikan dengan sambal khas lokal. Ditemani nasi hangat dan lalapan segar, menyantap ikan bakar dengan latar Danau Toba adalah pengalaman yang sulit dilupakan.",
          "Di kawasan Parapat, Ajibata, dan sekitar Pelabuhan Tigaras terdapat banyak pilihan warung makan halal yang buka dari pagi hingga malam. Pengemudi kami akan selalu merekomendasikan warung terpercaya dengan kebersihan terjamin."
        ]
      },
      {
        heading: "4. Kuliner & Produk Segar Berastagi",
        paragraphs: [
          "Pasar Buah Berastagi adalah surga buah segar bagi wisatawan. Di sini Anda bisa membeli langsung dari tangan petani dengan harga jauh di bawah harga supermarket: Markisa Berastagi (merah dan kuning, sangat harum dan segar), Jeruk Madu Berastagi (tanpa biji, manis dengan kulit tipis), Stroberi Kebun (segar, merah penuh), Alpukat Mentega (creamy, ukuran besar), Jagung Manis Rebus.",
          "Kopi Sidikalang: Di Berastagi banyak kedai kopi yang menjual biji kopi Sidikalang, salah satu kopi arabika terbaik Sumatera. Bawa pulang sebagai oleh-oleh untuk diseduh di rumah.",
          "Kuliner panas Berastagi: Di pagi hari yang dingin (suhu 15–18°C), cobalah Mie Rebus Karo atau Jagung Bakar di sekitar Pasar Buah. Ada juga kedai yang menjual Martabak Terang Bulan (serupa dengan apam Malaysia) yang sangat cocok untuk sarapan sambil melihat kabut pegunungan."
        ]
      },
      {
        heading: "5. Oleh-oleh Khas yang Aman Dibawa di Pesawat",
        paragraphs: [
          "Sebelum menuju Bandara Kualanamu, ada beberapa oleh-oleh wajib yang bisa dibeli di toko resmi di kota Medan:",
          "Bika Ambon: Kue khas Medan berbahan tepung tapioka, telur, dan santan yang difermentasi — menghasilkan tekstur kenyal berpori dengan rasa manis gurih. Tersedia dalam berbagai varian rasa. Tahan 2–3 hari di suhu ruang atau lebih lama jika disimpan dalam kulkas.",
          "Bolu Meranti: Bolu gulung isi berbagai varian (durian, keju, blueberry) yang sangat populer sebagai oleh-oleh Medan. Kemasan kotak elegan, cocok sebagai hadiah.",
          "Pancake Durian Beku: Pancake isi durian Medan asli yang dikemas vakum beku — aman dibawa sebagai bagasi terdaftar. Tahan hingga beberapa hari jika dijaga tetap beku. Ini oleh-oleh paling viral dan dicari tamu Malaysia.",
          "Ulos Batak: Kain tenun tradisional Batak yang bisa dibeli di Samosir atau di toko souvenir Medan. Cocok sebagai cinderamata budaya yang bermakna."
        ]
      }
    ]
  },
  {
    id: 10,
    slug: "tips-wisata-hemat-ke-samosir",
    title: "Tips Budget Trip ke Pulau Samosir: Hemat Biaya Ferry, Penginapan, Oleh-oleh & Waktu Terbaik Berkunjung",
    excerpt:
      "Panduan wisata hemat ke Pulau Samosir: cara naik ferry, pilihan penginapan budget, spot oleh-oleh terjangkau, dan waktu terbaik untuk berkunjung agar trip semakin berkesan.",
    category: "Tips Liburan",
    image_url: "/images/sumut/batak_house.webp",
    createdAt: "2026-11-01T08:00:00Z",
    updatedAt: "2026-11-15T08:00:00Z",
    readTime: "7 menit baca",
    relatedPackageSlug: "danau-toba-3d2n",
    tags: ["Pulau Samosir", "Budget Trip", "Ferry Danau Toba", "Tips Hemat", "Wisata Keluarga"],
    sections: [
      {
        heading: "1. Pulau Samosir: Kenapa Layak Jadi Destinasi Utama",
        paragraphs: [
          "Pulau Samosir adalah pulau vulkanik yang terapung di tengah Danau Toba — sebuah fenomena geografi yang langka di dunia. Pulau seluas 630 km² ini adalah jantung kebudayaan Batak Toba, dengan kampung-kampung adat berusia ratusan tahun, makam raja-raja Batak, kain ulos yang ditenun tangan, dan pantai pasir putih alami yang menyentuh perairan danau paling jernih di Sumatera.",
          "Bagi wisatawan yang ingin pengalaman autentik — bukan sekadar wisata foto cepat — Samosir adalah tujuan yang bisa menghabiskan 2–3 hari tanpa terasa bosan. Biayanya pun lebih terjangkau dibanding destinasi populer lain seperti Bali atau Lombok, terutama bagi tamu dari Malaysia."
        ]
      },
      {
        heading: "2. Panduan Naik Ferry ke Pulau Samosir",
        paragraphs: [
          "Ada dua cara masuk ke Pulau Samosir: melalui ferry penumpang dan kendaraan dari sisi timur Danau Toba, atau masuk lewat darat melalui Jembatan Tano Ponggol di Pangururan (sisi barat). Untuk pengalaman pertama, naik ferry adalah pilihan yang lebih berkesan.",
          "Rute Ferry Utama: Pelabuhan Ajibata (Parapat) → Pelabuhan Tomok (Samosir). Ini adalah rute paling populer dan beroperasi hampir sepanjang hari dari pukul 06:00 hingga 18:00 WIB. Tarif ferry penumpang sekitar Rp 10.000–20.000 per orang (sekitar MYR 2–5). Jika membawa kendaraan roda empat, biaya penyeberangan mobil sekitar Rp 100.000–200.000. Lama perjalanan: 45–60 menit melintasi perairan danau.",
          "Rute Alternatif Ferry: Pelabuhan Tigaras (dari arah Berastagi/Tongging) → Pelabuhan Simanindo. Rute ini lebih sepi dan cocok bagi tamu yang datang dari arah Paropo dan Silalahi tanpa melewati pusat Parapat. Jadwal lebih terbatas, biasanya pagi dan siang hari.",
          "Tips naik ferry: Datang ke dermaga minimal 30 menit sebelum jadwal keberangkatan, terutama saat weekend dan hari libur nasional ketika antrean kendaraan bisa lebih panjang. Pengemudi kami akan mengurus antrean kendaraan sementara tamu bersantai di area tunggu atau kafe tepi danau."
        ]
      },
      {
        heading: "3. Pilihan Penginapan di Pulau Samosir untuk Berbagai Budget",
        paragraphs: [
          "Samosir memiliki berbagai pilihan penginapan dari yang sederhana hingga resort berbintang, semuanya menawarkan pemandangan Danau Toba yang memukau.",
          "Budget (Rp 150.000–300.000/malam atau MYR 34–68): Guest house dan homestay lokal di sekitar Tuk-Tuk dan Tomok. Kebanyakan sudah bersih, kamar sederhana dengan kipas angin, beberapa sudah dilengkapi AC. Sarapan sederhana kadang sudah termasuk.",
          "Mid-range (Rp 400.000–700.000/malam atau MYR 90–160): Penginapan seperti Samosir Cottage, Tabo Cottage, atau Toledo Inn di Tuk-Tuk. Kamar lebih luas dengan AC, beberapa menghadap danau langsung. Fasilitas restoran halal di properti atau dekat properti.",
          "Premium (Rp 800.000–1.500.000/malam atau MYR 180–340): Marianna Resort — resort terbaik di Samosir dengan kolam renang menghadap danau, kamar deluxe berbalkon, dan restoran halal. Ini pilihan yang kami rekomendasikan dalam paket privat 4D3N dan 5D4N untuk kenyamanan maksimal keluarga.",
          "Tips: Jika datang pada periode peak season (Juni–Agustus dan Desember–Januari), pesan penginapan minimal 2–3 minggu sebelumnya. Konfirmasi ketersediaan penginapan sudah termasuk dalam layanan operator kami saat Anda memesan paket trip."
        ]
      },
      {
        heading: "4. Oleh-oleh Terbaik dari Samosir & Tips Belanja Hemat",
        paragraphs: [
          "Kain Ulos Batak: Ini adalah oleh-oleh paling otentik dari Samosir. Ulos adalah kain tenun tradisional Batak dengan motif geometris yang memiliki makna budaya mendalam. Di Kampung Ulos Hutaraja dan Pasar Tomok, Anda bisa membeli langsung dari penenun. Harga mulai Rp 50.000–500.000 (MYR 11–114) tergantung kualitas dan kerumitan motif.",
          "Patung Kayu Batak: Miniatur rumah adat Bolon, figur Sigale-gale (boneka kayu Batak yang bisa menari), dan ukiran kayu motif Batak adalah cinderamata populer. Harga mulai Rp 20.000–200.000.",
          "Kopi dan Rempah Lokal: Pasar Tomok dan Pasar Pangururan menjual kopi bubuk lokal, andaliman (lada Batak), serta rempah khas Sumatera dengan harga murah langsung dari produsen.",
          "Tips belanja hemat: Harga di Kampung Ulos Hutaraja umumnya lebih murah dibanding di Pasar Tomok yang lebih ramai turis. Tawar-menawar adalah hal yang wajar dan diterima dengan ramah — mulailah penawaran dari 50–60% harga yang disebutkan penjual. Belanja di pagi hari (sebelum pukul 11:00) biasanya lebih tenang dan harga lebih terbuka untuk negosiasi."
        ]
      },
      {
        heading: "5. Waktu Terbaik Berkunjung ke Pulau Samosir",
        paragraphs: [
          "Musim Kering (April–Oktober): Ini adalah waktu ideal berkunjung ke Samosir. Langit lebih cerah, danau tenang, dan aktivitas outdoor seperti bersepeda keliling pulau, berenang di Pantai Parbaba, dan naik sampan ke Air Terjun Sitiris-tiris sangat menyenangkan. Suhu siang berkisar 24–28°C, malam 18–22°C.",
          "Peak Season (Juni–Agustus dan Desember–Januari): Periode sekolah libur Malaysia dan Indonesia bersamaan menyebabkan lonjakan tamu. Penginapan dan ferry lebih ramai. Jika bisa, hindari periode ini atau pesan jauh-jauh hari.",
          "Musim Hujan (November–Maret): Hujan biasanya turun pada sore hingga malam hari, pagi masih cerah. Pemandangan danau justru lebih dramatis dengan kabut tipis di pagi hari. Ferry tetap beroperasi kecuali cuaca ekstrem. Harga penginapan dan trip biasanya lebih rendah 15–20% dibanding peak season — ini kesempatan bagus untuk budget traveller.",
          "Hari Pasar Tomok: Pasar Tomok paling ramai pada hari Senin dan Jumat. Jika ingin suasana pasar yang meriah dan banyak pilihan produk lokal, rencanakan kunjungan pada hari-hari tersebut.",
          "Untuk informasi cuaca terkini dan ketersediaan paket trip, hubungi tim kami melalui WhatsApp sebelum menetapkan tanggal perjalanan. Kami selalu update kondisi lapangan harian."
        ]
      }
    ]
  }
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
