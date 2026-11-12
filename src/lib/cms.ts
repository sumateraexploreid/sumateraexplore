import "server-only";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { dbQuery } from "@/lib/db";
import {
  TOUR_PACKAGES,
  DOCUMENTATION_GEAR,
  OPERATOR_NOTES,
  type TourPackage,
  type PaxTier,
  type ItineraryDay,
} from "@/data/packages";
import { BLOG_POSTS, type BlogPost, type BlogSection } from "@/data/blog";
import {
  BUSINESS_IDENTITY,
  SOCIAL_CHANNELS,
  FLEET_OPTIONS,
  GUEST_FAQS,
  LEGAL_DOCUMENTS,
  type SocialChannel,
  type FleetOption,
  type GuestFaqItem,
  type LegalDocumentItem,
} from "@/data/business";

export const CMS_CACHE_TAG = "cms-data";

export interface LiveGalleryItem {
  id: number;
  image_url: string;
  caption: string;
  category: string;
  type?: string;
  slug?: string;
  sort_order: number;
  is_active: boolean;
}

export interface FinanceSettings {
  myrToIdr: number;
  sgdToIdr: number;
  dpPercentage: number;
  dpRuleNote: string;
  weekdayDisclaimer: string;
}

export interface BusinessSettings {
  brandName: string;
  legalName: string;
  legalForm: string;
  decreeNumber: string;
  decreeIssuer: string;
  decreeDate: string;
  kbli: string[];
  ownerName: string;
  address: string;
  shortAddress: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  siteUrl: string;
}

export interface IntegrationsSettings {
  waAutoGreeting: string;
  gaMeasurementId: string;
  metaPixelId: string;
  supabaseProjectRef: string;
  notifyEmail: string;
}

export interface LiveSiteBundle {
  finance: FinanceSettings;
  business: BusinessSettings;
  socialChannels: SocialChannel[];
  fleet: FleetOption[];
  faqs: GuestFaqItem[];
  documentationGear: string[];
  operatorNotes: string[];
  legalDocuments: LegalDocumentItem[];
  integrations: IntegrationsSettings;
}

const DEFAULT_GALLERY: LiveGalleryItem[] = [
  {
    id: 1,
    image_url: "/images/sumut/toba_hero.webp",
    caption: "Panorama Pagi di Tepian Danau Toba",
    category: "Danau Toba",
    type: "package",
    slug: "danau-toba-2d1n",
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    image_url: "/images/sumut/batak_house.webp",
    caption: "Huta Siallagan & Rumah Adat Batak Samosir",
    category: "Budaya",
    type: "package",
    slug: "danau-toba-3d2n",
    sort_order: 2,
    is_active: true,
  },
  {
    id: 3,
    image_url: "/images/sumut/toba_landscape.webp",
    caption: "Silalahi & Bukit Holbung (Panorama Perbukitan)",
    category: "Alam",
    type: "package",
    slug: "danau-toba-4d3n",
    sort_order: 3,
    is_active: true,
  },
  {
    id: 4,
    image_url: "/images/sumut/berastagi.webp",
    caption: "Dataran Tinggi Berastagi & Sidamanik",
    category: "Alam",
    type: "package",
    slug: "berastagi-highland-1d",
    sort_order: 4,
    is_active: true,
  },
  {
    id: 5,
    image_url: "/images/sumut/lumbini.webp",
    caption: "Taman Alam Lumbini & Warisan Karo",
    category: "Budaya",
    type: "general",
    sort_order: 5,
    is_active: true,
  },
  {
    id: 6,
    image_url: "/images/sumut/sipiso_piso.webp",
    caption: "Air Terjun Sipiso-piso & Sitiris-tiris",
    category: "Danau Toba",
    type: "package",
    slug: "danau-toba-5d4n",
    sort_order: 6,
    is_active: true,
  },
];

export const DEFAULT_SITE_BUNDLE: LiveSiteBundle = {
  finance: {
    myrToIdr: 4400,
    sgdToIdr: 11500,
    dpPercentage: 30,
    dpRuleNote:
      "Pemesanan menggunakan DP sesuai kesepakatan via WhatsApp resmi; baki pelunasan dibayarkan setelah trip selesai di Bandara Kualanamu (KNO).",
    weekdayDisclaimer:
      "Tarif berlaku untuk keberangkatan Weekday (Senin-Kamis). Akhir pekan / musim cuti sekolah Malaysia dikonfirmasi saat booking.",
  },
  business: {
    brandName: BUSINESS_IDENTITY.brandName,
    legalName: BUSINESS_IDENTITY.legalName,
    legalForm: BUSINESS_IDENTITY.legalForm,
    decreeNumber: BUSINESS_IDENTITY.decreeNumber,
    decreeIssuer: BUSINESS_IDENTITY.decreeIssuer,
    decreeDate: BUSINESS_IDENTITY.decreeDate,
    kbli: [...BUSINESS_IDENTITY.kbli],
    ownerName: BUSINESS_IDENTITY.ownerName,
    address: BUSINESS_IDENTITY.address,
    shortAddress: BUSINESS_IDENTITY.shortAddress,
    whatsappNumber: BUSINESS_IDENTITY.whatsappNumber,
    whatsappDisplay: BUSINESS_IDENTITY.whatsappDisplay,
    email: BUSINESS_IDENTITY.email,
    siteUrl: BUSINESS_IDENTITY.siteUrl,
  },
  socialChannels: SOCIAL_CHANNELS,
  fleet: FLEET_OPTIONS,
  faqs: GUEST_FAQS,
  documentationGear: DOCUMENTATION_GEAR,
  operatorNotes: OPERATOR_NOTES,
  legalDocuments: LEGAL_DOCUMENTS,
  integrations: {
    waAutoGreeting:
      "Halo Sumatera Explore, saya ingin menanyakan ketersediaan jadwal & estimasi DP paket.",
    gaMeasurementId: "",
    metaPixelId: "",
    supabaseProjectRef: "anqebirxzaydpnmqllnr",
    notifyEmail: BUSINESS_IDENTITY.email,
  },
};

export function invalidatePublicCms() {
  revalidateTag(CMS_CACHE_TAG, { expire: 0 });
  revalidateTag("currency_manual_rates", { expire: 0 });
  revalidatePath("/", "layout");
  revalidatePath("/tour/packages");
  revalidatePath("/tour/blog");
  revalidatePath("/tour/gallery");
  revalidatePath("/about");
  revalidatePath("/payment");
}

interface PackageRow {
  id: number;
  slug: string;
  short_label: string;
  name: string;
  duration: string;
  location_tag: string;
  price_myr: number;
  price_idr: number;
  is_featured: boolean;
  image_url: string;
  hotels: string[];
  description: string;
  includes: string[];
  excludes: string[];
  notes: string[];
  tiers: PaxTier[];
  itinerary: ItineraryDay[];
}

export const getLivePackages = unstable_cache(
  async (): Promise<TourPackage[]> => {
    try {
      const { rows } = await dbQuery<PackageRow>(
        `SELECT id, slug, short_label, name, duration, location_tag, price_myr, price_idr,
                is_featured, image_url, hotels, description, includes, excludes, notes, tiers, itinerary
         FROM tour_packages
         WHERE status = 'active'
         ORDER BY sort_order ASC, id ASC`,
      );
      if (!rows.length) return TOUR_PACKAGES;
      return rows.map((r) => ({
        id: String(r.id),
        shortLabel: r.short_label,
        slug: r.slug,
        name: r.name,
        duration: r.duration,
        locationTag: r.location_tag,
        priceMyr: Number(r.price_myr),
        priceIdr: Number(r.price_idr),
        isFeatured: Boolean(r.is_featured),
        image_url: r.image_url,
        hotels: Array.isArray(r.hotels) ? r.hotels : [],
        description: r.description,
        includes: Array.isArray(r.includes) ? r.includes : [],
        excludes: Array.isArray(r.excludes) ? r.excludes : [],
        notes: Array.isArray(r.notes) ? r.notes : [],
        tiers: Array.isArray(r.tiers) ? r.tiers : [],
        itinerary: Array.isArray(r.itinerary) ? r.itinerary : [],
      }));
    } catch {
      return TOUR_PACKAGES;
    }
  },
  ["cms-packages"],
  { tags: [CMS_CACHE_TAG], revalidate: 120 },
);

export async function getLivePackageBySlug(
  slug: string,
): Promise<TourPackage | undefined> {
  const packages = await getLivePackages();
  return packages.find((p) => p.slug === slug);
}

interface BlogRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogPost["category"];
  image_url: string;
  read_time: string;
  related_package_slug: string;
  tags: string[];
  sections: BlogSection[];
  created_at: string;
  updated_at: string;
}

export const getLiveBlogs = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const { rows } = await dbQuery<BlogRow>(
        `SELECT id, slug, title, excerpt, category, image_url, read_time,
                related_package_slug, tags, sections, created_at, updated_at
         FROM blog_posts
         WHERE status = 'published'
         ORDER BY created_at DESC, id DESC`,
      );
      if (!rows.length) return BLOG_POSTS;
      return rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        category: r.category,
        image_url: r.image_url,
        readTime: r.read_time,
        relatedPackageSlug: r.related_package_slug,
        tags: Array.isArray(r.tags) ? r.tags : [],
        sections: Array.isArray(r.sections) ? r.sections : [],
        createdAt: new Date(r.created_at).toISOString(),
        updatedAt: new Date(r.updated_at).toISOString(),
      }));
    } catch {
      return BLOG_POSTS;
    }
  },
  ["cms-blogs"],
  { tags: [CMS_CACHE_TAG], revalidate: 120 },
);

export async function getLiveBlogPost(slug: string): Promise<BlogPost | undefined> {
  const posts = await getLiveBlogs();
  return posts.find((p) => p.slug === slug);
}

export const getLiveGallery = unstable_cache(
  async (): Promise<LiveGalleryItem[]> => {
    try {
      const { rows } = await dbQuery<LiveGalleryItem>(
        `SELECT id, image_url, caption, category, type, slug, sort_order, is_active
         FROM gallery_items
         WHERE is_active = TRUE
         ORDER BY sort_order ASC, id DESC`,
      );
      if (!rows.length) return DEFAULT_GALLERY;
      return rows;
    } catch {
      return DEFAULT_GALLERY;
    }
  },
  ["cms-gallery"],
  { tags: [CMS_CACHE_TAG], revalidate: 120 },
);

export const getLiveSiteBundle = unstable_cache(
  async (): Promise<LiveSiteBundle> => {
    try {
      const { rows } = await dbQuery<{ key: string; value: Record<string, unknown> }>(
        `SELECT key, value FROM site_settings`,
      );
      const map = new Map<string, Record<string, unknown>>();
      for (const row of rows) map.set(row.key, row.value || {});

      const finance = map.get("finance") as Partial<FinanceSettings> | undefined;
      const business = map.get("business") as Partial<BusinessSettings> | undefined;
      const channels = map.get("channels") as { socialChannels?: SocialChannel[] } | undefined;
      const fleet = map.get("fleet") as { options?: FleetOption[] } | undefined;
      const faqs = map.get("faqs") as { items?: GuestFaqItem[] } | undefined;
      const operations = map.get("operations") as
        | {
            documentationGear?: string[];
            operatorNotes?: string[];
            legalDocuments?: LegalDocumentItem[];
          }
        | undefined;
      const integrations = map.get("integrations") as
        | Partial<IntegrationsSettings>
        | undefined;

      return {
        finance: { ...DEFAULT_SITE_BUNDLE.finance, ...(finance || {}) },
        business: { ...DEFAULT_SITE_BUNDLE.business, ...(business || {}) },
        socialChannels: channels?.socialChannels?.length
          ? channels.socialChannels
          : DEFAULT_SITE_BUNDLE.socialChannels,
        fleet: fleet?.options?.length ? fleet.options : DEFAULT_SITE_BUNDLE.fleet,
        faqs: faqs?.items?.length ? faqs.items : DEFAULT_SITE_BUNDLE.faqs,
        documentationGear: operations?.documentationGear?.length
          ? operations.documentationGear
          : DEFAULT_SITE_BUNDLE.documentationGear,
        operatorNotes: operations?.operatorNotes?.length
          ? operations.operatorNotes
          : DEFAULT_SITE_BUNDLE.operatorNotes,
        legalDocuments: operations?.legalDocuments?.length
          ? operations.legalDocuments
          : DEFAULT_SITE_BUNDLE.legalDocuments,
        integrations: {
          ...DEFAULT_SITE_BUNDLE.integrations,
          ...(integrations || {}),
        },
      };
    } catch {
      return DEFAULT_SITE_BUNDLE;
    }
  },
  ["cms-site-bundle"],
  { tags: [CMS_CACHE_TAG], revalidate: 120 },
);

