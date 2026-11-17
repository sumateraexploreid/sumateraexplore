import { dbQuery } from "@/lib/db";
import {
  TOUR_PACKAGES,
  DOCUMENTATION_GEAR,
  OPERATOR_NOTES,
} from "@/data/packages";
import { BLOG_POSTS } from "@/data/blog";
import {
  BUSINESS_IDENTITY,
  SOCIAL_CHANNELS,
  FLEET_OPTIONS,
  GUEST_FAQS,
  LEGAL_DOCUMENTS,
} from "@/data/business";

const INITIAL_GALLERY = [
  {
    image_url: "/images/sumut/toba_hero.webp",
    caption: "Panorama Pagi di Tepian Danau Toba",
    category: "Danau Toba",
    type: "package",
    slug: "danau-toba-2d1n",
    sort_order: 1,
  },
  {
    image_url: "/images/sumut/batak_house.webp",
    caption: "Huta Siallagan & Rumah Adat Batak Samosir",
    category: "Budaya",
    type: "package",
    slug: "danau-toba-3d2n",
    sort_order: 2,
  },
  {
    image_url: "/images/sumut/toba_landscape.webp",
    caption: "Silalahi & Bukit Holbung (Panorama Perbukitan)",
    category: "Alam",
    type: "package",
    slug: "danau-toba-4d3n",
    sort_order: 3,
  },
  {
    image_url: "/images/sumut/berastagi.webp",
    caption: "Dataran Tinggi Berastagi & Sidamanik",
    category: "Alam",
    type: "package",
    slug: "berastagi-highland-1d",
    sort_order: 4,
  },
  {
    image_url: "/images/sumut/lumbini.webp",
    caption: "Taman Alam Lumbini & Warisan Karo",
    category: "Budaya",
    type: "general",
    slug: null,
    sort_order: 5,
  },
  {
    image_url: "/images/sumut/sipiso_piso.webp",
    caption: "Air Terjun Sipiso-piso & Sitiris-tiris",
    category: "Danau Toba",
    type: "package",
    slug: "danau-toba-5d4n",
    sort_order: 6,
  },
];

/**
 * Idempotently seeds default packages, blog posts, gallery items, and site settings
 * if they are empty in the database.
 */
export async function ensureDefaultContentSeeded(): Promise<void> {
  try {
    // 1. Tour Packages
    const { rows: pkgCount } = await dbQuery<{ c: string }>(
      "SELECT COUNT(*)::text AS c FROM tour_packages",
    );
    if (Number(pkgCount[0]?.c || 0) === 0) {
      for (let i = 0; i < TOUR_PACKAGES.length; i++) {
        const p = TOUR_PACKAGES[i];
        await dbQuery(
          `INSERT INTO tour_packages (
            slug, short_label, name, duration, location_tag, price_myr, price_idr,
            is_featured, status, sort_order, image_url, hotels, description,
            includes, excludes, notes, tiers, itinerary
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7,
            $8, 'active', $9, $10, $11::jsonb, $12,
            $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::jsonb
          )
          ON CONFLICT (slug) DO NOTHING`,
          [
            p.slug,
            p.shortLabel,
            p.name,
            p.duration,
            p.locationTag,
            p.priceMyr,
            p.priceIdr,
            Boolean(p.isFeatured),
            i + 1,
            p.image_url,
            JSON.stringify(p.hotels),
            p.description,
            JSON.stringify(p.includes),
            JSON.stringify(p.excludes),
            JSON.stringify(p.notes),
            JSON.stringify(p.tiers),
            JSON.stringify(p.itinerary),
          ],
        );
      }
    }

    // 2. Blog Posts
    const { rows: blogCount } = await dbQuery<{ c: string }>(
      "SELECT COUNT(*)::text AS c FROM blog_posts",
    );
    if (Number(blogCount[0]?.c || 0) === 0) {
      for (const post of BLOG_POSTS) {
        await dbQuery(
          `INSERT INTO blog_posts (
            slug, title, excerpt, category, image_url, read_time,
            related_package_slug, tags, sections, status, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6,
            $7, $8::jsonb, $9::jsonb, 'published', $10::timestamptz, $11::timestamptz
          )
          ON CONFLICT (slug) DO NOTHING`,
          [
            post.slug,
            post.title,
            post.excerpt,
            post.category,
            post.image_url,
            post.readTime,
            post.relatedPackageSlug,
            JSON.stringify(post.tags),
            JSON.stringify(post.sections),
            post.createdAt,
            post.updatedAt,
          ],
        );
      }
    }

    // 3. Gallery Items
    const { rows: gCount } = await dbQuery<{ c: string }>(
      "SELECT COUNT(*)::text AS c FROM gallery_items",
    );
    if (Number(gCount[0]?.c || 0) === 0) {
      for (const item of INITIAL_GALLERY) {
        await dbQuery(
          `INSERT INTO gallery_items (image_url, caption, category, type, slug, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
          [
            item.image_url,
            item.caption,
            item.category,
            item.type,
            item.slug,
            item.sort_order,
          ],
        );
      }
    }

    // 4. Site Settings
    const settingsEntries: [string, Record<string, unknown>][] = [
      [
        "finance",
        {
          myrToIdr: 4400,
          sgdToIdr: 11500,
          dpPercentage: 30,
          dpRuleNote:
            "Pemesanan menggunakan DP sesuai kesepakatan via WhatsApp resmi; baki pelunasan dibayarkan setelah trip selesai di Bandara Kualanamu (KNO).",
          weekdayDisclaimer:
            "Tarif berlaku untuk keberangkatan Weekday (Senin-Kamis). Akhir pekan / musim cuti sekolah Malaysia dikonfirmasi saat booking.",
        },
      ],
      ["business", BUSINESS_IDENTITY as unknown as Record<string, unknown>],
      [
        "channels",
        { socialChannels: SOCIAL_CHANNELS } as Record<string, unknown>,
      ],
      ["fleet", { options: FLEET_OPTIONS } as Record<string, unknown>],
      ["faqs", { items: GUEST_FAQS } as Record<string, unknown>],
      [
        "operations",
        {
          documentationGear: DOCUMENTATION_GEAR,
          operatorNotes: OPERATOR_NOTES,
          legalDocuments: LEGAL_DOCUMENTS,
        } as Record<string, unknown>,
      ],
      [
        "integrations",
        {
          waAutoGreeting:
            "Halo Sumatera Explore, saya ingin menanyakan ketersediaan jadwal & estimasi DP paket.",
          gaMeasurementId: "",
          metaPixelId: "",
          supabaseProjectRef: "anqebirxzaydpnmqllnr",
          notifyEmail: BUSINESS_IDENTITY.email,
        },
      ],
    ];

    for (const [key, value] of settingsEntries) {
      await dbQuery(
        `INSERT INTO site_settings (key, value)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)],
      );
    }
  } catch (err) {
    console.error("ensureDefaultContentSeeded error:", err);
  }
}
