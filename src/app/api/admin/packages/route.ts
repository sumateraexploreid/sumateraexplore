import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, okList, fail, parsePagination } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";
import { invalidatePublicCms } from "@/lib/cms";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const sp = req.nextUrl.searchParams;
    const { page, pageSize, offset, q } = parsePagination(sp);
    const status = (sp.get("status") || "").trim();

    const filters: string[] = [];
    const params: unknown[] = [];

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      filters.push(
        `(LOWER(name) LIKE $${params.length} OR LOWER(slug) LIKE $${params.length} OR LOWER(location_tag) LIKE $${params.length})`,
      );
    }
    if (status && status !== "all") {
      params.push(status);
      filters.push(`status = $${params.length}`);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countRes = await dbQuery<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM tour_packages ${where}`,
      params,
    );
    const total = countRes.rows[0]?.total || 0;

    params.push(pageSize, offset);
    const { rows } = await dbQuery(
      `SELECT id, slug, short_label, name, duration, location_tag, price_myr, price_idr,
              is_featured, status, sort_order, image_url, hotels, description,
              includes, excludes, notes, tiers, itinerary, updated_at
       FROM tour_packages
       ${where}
       ORDER BY sort_order ASC, id ASC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return okList(rows, total, page, pageSize);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat daftar paket.",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = await req.json();
    const slug = String(body.slug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-|-$/g, "");
    const name = String(body.name || "").trim();
    const shortLabel = String(body.short_label || "").trim() || "Trip";
    const duration = String(body.duration || "").trim();
    const locationTag = String(body.location_tag || "").trim();
    const priceMyr = Math.max(0, Number(body.price_myr) || 0);
    const priceIdr =
      Number(body.price_idr) > 0
        ? Math.round(Number(body.price_idr))
        : Math.round(priceMyr * 4400);
    const imageUrl =
      String(body.image_url || "").trim() || "/images/sumut/toba_hero.webp";
    const description = String(body.description || "").trim();

    if (!slug || !name || !duration || !locationTag) {
      return fail("Slug, nama paket, durasi, dan lokasi wajib diisi.", 400);
    }

    const { rows } = await dbQuery(
      `INSERT INTO tour_packages (
        slug, short_label, name, duration, location_tag, price_myr, price_idr,
        is_featured, status, sort_order, image_url, hotels, description,
        includes, excludes, notes, tiers, itinerary
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, COALESCE((SELECT MAX(sort_order) + 1 FROM tour_packages), 1),
        $10, $11::jsonb, $12,
        $13::jsonb, $14::jsonb, $15::jsonb, $16::jsonb, $17::jsonb
      )
      RETURNING *`,
      [
        slug,
        shortLabel,
        name,
        duration,
        locationTag,
        priceMyr,
        priceIdr,
        Boolean(body.is_featured),
        body.status || "active",
        imageUrl,
        JSON.stringify(Array.isArray(body.hotels) ? body.hotels : []),
        description,
        JSON.stringify(Array.isArray(body.includes) ? body.includes : []),
        JSON.stringify(Array.isArray(body.excludes) ? body.excludes : []),
        JSON.stringify(Array.isArray(body.notes) ? body.notes : []),
        JSON.stringify(Array.isArray(body.tiers) ? body.tiers : []),
        JSON.stringify(Array.isArray(body.itinerary) ? body.itinerary : []),
      ],
    );

    const created = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "tour_package",
      entityId: created.id,
      summary: `Tambah paket tour: ${created.name} (RM ${created.price_myr})`,
    });
    invalidatePublicCms();

    return okItem(created, 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal membuat paket.";
    if (msg.includes("duplicate key")) {
      return fail("Slug paket sudah digunakan. Gunakan slug unik lainnya.", 409);
    }
    return fail(msg, 500);
  }
}

