import files from "@/generated/public-files.json";

/**
 * Port setia dari imageUrl() (app/Helpers/ImageHelper.php).
 * Urutan aturan SENGAJA dipertahankan: berkas nyata menang, lalu pemetaan
 * kata kunci untuk path warisan, lalu fallback.
 *
 * Padanan disk: public_path(x) = public/x ; Storage::disk('public') = public/storage/x.
 */
const PUBLIC = new Set<string>(files);
const inPublic = (p: string) => PUBLIC.has(p);
const inStorage = (p: string) => PUBLIC.has(`storage/${p}`);

const TOUR = "/images/home/tour.webp";
const S = (n: string) => `/images/sumut/${n}.webp`;

const memo = new Map<string, string>();

export function imageUrl(path: string | null | undefined, fallback?: string | null): string {
  const key = `${path ?? "\0"}|${fallback ?? "\0"}`;
  const hit = memo.get(key);
  if (hit !== undefined) return hit;
  const r = resolve(path, fallback);
  memo.set(key, r);
  return r;
}

function resolve(input: string | null | undefined, fallback?: string | null): string {
  let path = input ?? "";
  if (!path || path === "null") {
    if (fallback) path = fallback;
    else return TOUR;
  }

  const lower = path.toLowerCase();
  const isRemote = /^(https?:)?\/\/|^(data|blob):/i.test(path);

  // 1. Berkas nyata menang (hanya path lokal).
  if (!isRemote) {
    let nyata = path.replace(/^\/+/, "");
    if (nyata.startsWith("_static/")) nyata = nyata.slice(8);
    const tanpaStorage = nyata.startsWith("storage/") ? nyata.slice(8) : nyata;
    if (nyata && inPublic(nyata)) return `/${nyata}`;
    if (tanpaStorage && inStorage(tanpaStorage)) return `/storage/${tanpaStorage}`;
  }

  const has = (...s: string[]) => s.some((x) => lower.includes(x));

  // 2. Kata kunci avatar / kategori.
  if (has("staff1")) return S("specialist_avatar");
  if (has("user1")) return S("avatar_user_1");
  if (has("user2")) return S("avatar_user_2");
  if (has("user3")) return S("avatar_user_3");
  if (has("user4")) return S("avatar_user_4");
  if (has("outbound")) return "/images/home/outbound.webp";
  if (has("tour")) return TOUR;

  // 3. Path warisan 2023/10.
  if (has("2023/10/") || /assets\/images\/\d{4}\/\d{2}\//.test(lower)) {
    if (has("001-1")) return S("toba_hero");
    if (has("002-1")) return S("toba_landscape");
    if (has("003-1")) return S("batak_house");
    if (has("004")) return S("sipiso_piso");
    if (has("005")) return S("berastagi");
    if (has("006")) return S("lumbini");
    if (has("008")) return S("hotel_room");
    if (has("009-1")) return S("maimun_palace");
    if (has("0010", "010")) return S("masjid_raya");
    if (has("team-building", "fun-games", "gathering", "outbound-kids"))
      return "/images/home/outbound.webp";
  }

  // 4. Placeholder / domain jarak jauh yang dialihkan ke aset lokal.
  if (has("unsplash.com", "placeholder", "pravatar.cc", "googleusercontent.com")) {
    if (has("photo-1580489944761", "staff1")) return S("specialist_avatar");
    if (has("photo-1507003211169", "user1", "ab6axubc2hfgasrsa7a85bf12siuk3")) return S("avatar_user_1");
    if (has("photo-1534528741775", "user2", "ab6axuafawoa9yazv80gupi35ev08b")) return S("avatar_user_2");
    if (has("photo-1500648767791", "user3")) return S("avatar_user_3");
    if (has("photo-1494790108377", "user4")) return S("avatar_user_4");
    if (has("photo-1472099645785")) return S("avatar_user_1");
    if (has("photo-1596402184320", "photo-1544735049", "photo-1511632765")) return S("sumatra_panorama");
    if (has("googleusercontent.com")) return S("avatar_user_3");
    return TOUR;
  }

  // 5. URL penuh / data / blob apa adanya.
  if (/^(https?:)?\/\//i.test(path) || /^(data|blob):/i.test(path)) return path;

  // 6. Logo mitra.
  if (has("mandiri")) return "/images/partners/mandiri.svg";
  if (has("usu-", "usu.")) return "/images/partners/usu.svg";
  if (has("pelindo")) return "/images/partners/pelindo.svg";
  if (has("hyundai")) return "/images/partners/hyundai.svg";

  // 7. Pemetaan destinasi.
  if (has("lake-toba-premium")) return S("toba_hero");
  if (has("sumatra-panorama")) return S("sumatra_panorama");
  if (has("toba-1")) return S("toba_hero");
  if (has("toba-2", "toba-landscape")) return S("toba_landscape");
  if (has("toba-3")) return S("batak_house");
  if (has("toba-4", "sipiso_piso", "sipiso-piso")) return S("sipiso_piso");
  if (has("toba", "samosir", "parapat")) {
    if (has("sunset")) return S("toba_landscape");
    if (has("boat", "danau-toba-panorama")) return S("toba_hero");
    if (has("huta-bolon", "batak")) return S("batak_house");
    return S("toba_landscape");
  }
  if (has("sipiso")) return S("sipiso_piso");
  if (has("berastagi-1")) return S("berastagi");
  if (has("berastagi-2", "lumbini")) return S("lumbini");
  if (has("berastagi-3", "simalem")) return S("hotel_room");
  if (has("berastagi", "karo")) return S("berastagi");
  if (has("medan-1", "maimun")) return S("maimun_palace");
  if (has("medan-2", "masjid")) return S("masjid_raya");
  if (has("medan")) return S("maimun_palace");
  if (has("bukitlawang-1", "orangutan")) return S("orangutan");
  if (has("bukitlawang-2", "bukit-lawang")) return S("sumatra_panorama");
  if (has("honeymoon-1")) return S("hotel_room");
  if (has("honeymoon-2")) return S("toba_landscape");
  if (has("honeymoon-3")) return S("toba_hero");
  if (has("sumut-complete-1")) return S("toba_hero");
  if (has("sumut-complete-2")) return S("berastagi");
  if (has("sumut-complete-3")) return S("orangutan");
  if (has("010", "0010", "hotel", "room")) return S("hotel_room");

  // 8. Mobil.
  if (has("car", "avanza", "innova", "hiace", "alphard", "apv", "sigra")) {
    if (has("avanza", "apv", "sigra")) return "/images/sumut/car_avanza.webp";
    if (has("innova")) return "/images/sumut/car_innova.webp";
    if (has("hiace")) return "/images/sumut/car_hiace.webp";
    if (has("alphard")) return "/images/sumut/car_alphard.webp";
    return "/images/sumut/car_avanza.webp";
  }

  // 9. Avatar.
  if (has("avatar", "specialist", "sarah")) {
    if (has("specialist", "sarah")) return S("specialist_avatar");
    if (has("avatar_user_1", "user_1", "-1", "_1")) return S("avatar_user_1");
    if (has("avatar_user_2", "user_2", "-2", "_2")) return S("avatar_user_2");
    if (has("avatar_user_3", "user_3", "-3", "_3")) return S("avatar_user_3");
    if (has("avatar_user_4", "user_4", "-4", "_4")) return S("avatar_user_4");
    return S("avatar_user_1");
  }

  // 10. Kata kunci blog.
  if (has("batak")) return S("batak_house");
  if (has("trekking", "orangutan")) return S("orangutan");
  if (has("spots", "photo")) return S("toba_landscape");
  if (has("best-time")) return S("toba_hero");
  if (has("transfer", "guide")) return S("sumatra_panorama");
  if (has("food", "kuliner")) return S("hotel_room");
  if (has("water", "sport")) return S("toba_hero");
  if (has("budget")) return S("toba_landscape");

  // 11. Berkas tidak ada di mana pun -> gambar bawaan.
  return TOUR;
}

/** Padanan imageFallback(): nilai untuk atribut onerror. */
export const imageFallback = (fallback?: string | null) => fallback ?? TOUR;
