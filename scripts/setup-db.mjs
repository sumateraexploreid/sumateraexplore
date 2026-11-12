import crypto from "crypto";
import pg from "pg";
import { TOUR_PACKAGES, DOCUMENTATION_GEAR, OPERATOR_NOTES } from "../src/data/packages.ts";
import { BLOG_POSTS } from "../src/data/blog.ts";
import {
  BUSINESS_IDENTITY,
  SOCIAL_CHANNELS,
  FLEET_OPTIONS,
  GUEST_FAQS,
  LEGAL_DOCUMENTS,
} from "../src/data/business.ts";

const { Client } = pg;

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

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

async function main() {
  const conn = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!conn) {
    throw new Error("DIRECT_URL or DATABASE_URL is required in .env.local");
  }

  const client = new Client({
    connectionString: conn,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  try {
    console.log("1/4 Creating schema tables...");
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'super_admin' CHECK (role IN ('super_admin', 'editor', 'cs_operator')),
        password_hash TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        last_login_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tour_packages (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        short_label TEXT NOT NULL,
        name TEXT NOT NULL,
        duration TEXT NOT NULL,
        location_tag TEXT NOT NULL,
        price_myr INTEGER NOT NULL,
        price_idr INTEGER NOT NULL,
        is_featured BOOLEAN NOT NULL DEFAULT FALSE,
        status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
        sort_order INTEGER NOT NULL DEFAULT 0,
        image_url TEXT NOT NULL,
        hotels JSONB NOT NULL DEFAULT '[]'::jsonb,
        description TEXT NOT NULL,
        includes JSONB NOT NULL DEFAULT '[]'::jsonb,
        excludes JSONB NOT NULL DEFAULT '[]'::jsonb,
        notes JSONB NOT NULL DEFAULT '[]'::jsonb,
        tiers JSONB NOT NULL DEFAULT '[]'::jsonb,
        itinerary JSONB NOT NULL DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        booking_code TEXT UNIQUE NOT NULL,
        package_slug TEXT NOT NULL,
        package_name TEXT NOT NULL,
        guest_name TEXT NOT NULL,
        guest_phone TEXT NOT NULL,
        guest_origin TEXT NOT NULL DEFAULT 'Malaysia',
        trip_date DATE,
        adults_count INTEGER NOT NULL DEFAULT 2,
        children_count INTEGER NOT NULL DEFAULT 0,
        vehicle_type TEXT NOT NULL DEFAULT 'Innova / SUV',
        currency TEXT NOT NULL DEFAULT 'MYR',
        estimated_total NUMERIC(14,2) NOT NULL DEFAULT 0,
        dp_amount NUMERIC(14,2) NOT NULL DEFAULT 0,
        dp_status TEXT NOT NULL DEFAULT 'pending_inquiry'
          CHECK (dp_status IN ('pending_inquiry', 'waiting_dp', 'dp_paid', 'completed', 'cancelled')),
        assigned_driver TEXT,
        notes TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL DEFAULT 'whatsapp_manual',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Rute',
        image_url TEXT NOT NULL,
        read_time TEXT NOT NULL DEFAULT '5 menit baca',
        related_package_slug TEXT NOT NULL DEFAULT 'danau-toba-3d2n',
        tags JSONB NOT NULL DEFAULT '[]'::jsonb,
        sections JSONB NOT NULL DEFAULT '[]'::jsonb,
        status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS gallery_items (
        id SERIAL PRIMARY KEY,
        image_url TEXT NOT NULL,
        caption TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'Danau Toba',
        type TEXT NOT NULL DEFAULT 'general',
        slug TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS media_assets (
        id SERIAL PRIMARY KEY,
        filename TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        byte_size INTEGER NOT NULL,
        data_base64 TEXT NOT NULL,
        alt_text TEXT NOT NULL DEFAULT '',
        folder TEXT NOT NULL DEFAULT 'gallery',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        admin_email TEXT NOT NULL,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id TEXT NOT NULL,
        summary TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (dp_status, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_packages_order ON tour_packages (sort_order ASC, id ASC);
      CREATE INDEX IF NOT EXISTS idx_blogs_created ON blog_posts (created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_logs (created_at DESC);

      ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE tour_packages ENABLE ROW LEVEL SECURITY;
      ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
      ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
    `);

    console.log("2/4 Seeding admin user...");
    const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@sumateraexplore.my.id").toLowerCase();
    const adminPass = process.env.ADMIN_DEFAULT_PASSWORD || "SumateraToba#2026";
    await client.query(
      `INSERT INTO admin_users (email, name, role, password_hash, is_active)
       VALUES ($1, $2, 'super_admin', $3, TRUE)
       ON CONFLICT (email) DO NOTHING`,
      [adminEmail, "Suja'i (Owner & Admin)", hashPassword(adminPass)],
    );

    console.log("3/4 Seeding packages, blog posts, gallery & settings...");
    for (let i = 0; i < TOUR_PACKAGES.length; i++) {
      const p = TOUR_PACKAGES[i];
      await client.query(
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

    for (const post of BLOG_POSTS) {
      await client.query(
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

    const { rows: gCount } = await client.query("SELECT COUNT(*)::int AS c FROM gallery_items");
    if (gCount[0].c === 0) {
      for (const item of INITIAL_GALLERY) {
        await client.query(
          `INSERT INTO gallery_items (image_url, caption, category, type, slug, sort_order, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, TRUE)`,
          [item.image_url, item.caption, item.category, item.type, item.slug, item.sort_order],
        );
      }
    }

    const settingsEntries = [
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
      ["business", BUSINESS_IDENTITY],
      ["channels", { socialChannels: SOCIAL_CHANNELS }],
      ["fleet", { options: FLEET_OPTIONS }],
      ["faqs", { items: GUEST_FAQS }],
      [
        "operations",
        {
          documentationGear: DOCUMENTATION_GEAR,
          operatorNotes: OPERATOR_NOTES,
          legalDocuments: LEGAL_DOCUMENTS,
        },
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
      await client.query(
        `INSERT INTO site_settings (key, value)
         VALUES ($1, $2::jsonb)
         ON CONFLICT (key) DO NOTHING`,
        [key, JSON.stringify(value)],
      );
    }

    console.log("4/4 Seeding initial operational booking pipeline...");
    const { rows: bCount } = await client.query("SELECT COUNT(*)::int AS c FROM bookings");
    if (bCount[0].c === 0) {
      const sampleBookings = [
        {
          code: "SE-2611-001",
          slug: "danau-toba-4d3n",
          name: "Private Trip Danau Toba 4 Days 3 Nights",
          guest: "En. Amirul & Keluarga",
          phone: "60123456789",
          origin: "Malaysia",
          daysOffset: 10,
          adults: 6,
          children: 1,
          vehicle: "Innova / SUV",
          currency: "MYR",
          total: 2700,
          dp: 800,
          status: "dp_paid",
          driver: "Bang Suja'i (Driver Muslim)",
          notes: "Flight AirAsia tiba KNO 09.15 WIB. Request highlight Reels & makan halal.",
          source: "whatsapp_manual",
          createdDaysAgo: 4,
        },
        {
          code: "SE-2611-002",
          slug: "danau-toba-3d2n",
          name: "Private Trip Danau Toba 3 Days 2 Nights",
          guest: "Pn. Nurul Aisyah",
          phone: "60198887766",
          origin: "Malaysia",
          daysOffset: 16,
          adults: 4,
          children: 0,
          vehicle: "Innova / SUV",
          currency: "MYR",
          total: 2200,
          dp: 600,
          status: "waiting_dp",
          driver: "Bang Rizky",
          notes: "Pilihan hotel Samosir Cottages 4*. Menunggu transfer DP via Wise.",
          source: "whatsapp_manual",
          createdDaysAgo: 2,
        },
        {
          code: "SE-2611-003",
          slug: "danau-toba-5d4n",
          name: "Private Trip Danau Toba 5 Days 4 Nights",
          guest: "Mr. Tan & Friends",
          phone: "6591234567",
          origin: "Singapura",
          daysOffset: 24,
          adults: 6,
          children: 0,
          vehicle: "Van Hiace",
          currency: "MYR",
          total: 4200,
          dp: 0,
          status: "pending_inquiry",
          driver: "",
          notes: "Tanya opsi upgrade 1 malam di Berastagi Mikie Holiday + nego drone.",
          source: "web_form",
          createdDaysAgo: 1,
        },
        {
          code: "SE-2611-004",
          slug: "danau-toba-2d1n",
          name: "Private Trip Danau Toba 2 Days 1 Night",
          guest: "Kel. Bpk. Hendra",
          phone: "6281266778899",
          origin: "Indonesia",
          daysOffset: -3,
          adults: 4,
          children: 0,
          vehicle: "Innova / SUV",
          currency: "MYR",
          total: 1600,
          dp: 500,
          status: "completed",
          driver: "Bang Suja'i (Driver Muslim)",
          notes: "Pelunasan selesai di Bandara KNO. File 4K iPhone dikirim via AirDrop.",
          source: "whatsapp_manual",
          createdDaysAgo: 6,
        },
      ];

      for (const b of sampleBookings) {
        await client.query(
          `INSERT INTO bookings (
            booking_code, package_slug, package_name, guest_name, guest_phone,
            guest_origin, trip_date, adults_count, children_count, vehicle_type,
            currency, estimated_total, dp_amount, dp_status, assigned_driver,
            notes, source, created_at
          ) VALUES (
            $1, $2, $3, $4, $5,
            $6, CURRENT_DATE + ($7 || ' days')::interval, $8, $9, $10,
            $11, $12, $13, $14, $15,
            $16, $17, NOW() - ($18 || ' days')::interval
          )`,
          [
            b.code,
            b.slug,
            b.name,
            b.guest,
            b.phone,
            b.origin,
            String(b.daysOffset),
            b.adults,
            b.children,
            b.vehicle,
            b.currency,
            b.total,
            b.dp,
            b.status,
            b.driver,
            b.notes,
            b.source,
            String(b.createdDaysAgo),
          ],
        );
      }
    }

    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*)::int FROM admin_users) AS admins,
        (SELECT COUNT(*)::int FROM tour_packages) AS packages,
        (SELECT COUNT(*)::int FROM blog_posts) AS blogs,
        (SELECT COUNT(*)::int FROM gallery_items) AS gallery,
        (SELECT COUNT(*)::int FROM bookings) AS bookings,
        (SELECT COUNT(*)::int FROM site_settings) AS settings
    `);
    console.log("Seed complete:", counts.rows[0]);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});

