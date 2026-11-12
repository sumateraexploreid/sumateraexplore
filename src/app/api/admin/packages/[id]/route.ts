import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";
import { invalidatePublicCms } from "@/lib/cms";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID paket tidak valid.", 400);

  const { rows } = await dbQuery(`SELECT * FROM tour_packages WHERE id = $1 LIMIT 1`, [
    id,
  ]);
  if (!rows[0]) return fail("Paket tidak ditemukan.", 404);
  return okItem(rows[0]);
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID paket tidak valid.", 400);

  try {
    const body = await req.json();
    const { rows: existingRows } = await dbQuery(
      `SELECT * FROM tour_packages WHERE id = $1 LIMIT 1`,
      [id],
    );
    const cur = existingRows[0];
    if (!cur) return fail("Paket tidak ditemukan.", 404);

    const priceMyr =
      body.price_myr !== undefined ? Math.max(0, Number(body.price_myr)) : cur.price_myr;
    const priceIdr =
      body.price_idr !== undefined
        ? Math.max(0, Number(body.price_idr))
        : body.price_myr !== undefined
          ? Math.round(priceMyr * 4400)
          : cur.price_idr;

    const { rows } = await dbQuery(
      `UPDATE tour_packages SET
        slug = $2,
        short_label = $3,
        name = $4,
        duration = $5,
        location_tag = $6,
        price_myr = $7,
        price_idr = $8,
        is_featured = $9,
        status = $10,
        sort_order = $11,
        image_url = $12,
        hotels = $13::jsonb,
        description = $14,
        includes = $15::jsonb,
        excludes = $16::jsonb,
        notes = $17::jsonb,
        tiers = $18::jsonb,
        itinerary = $19::jsonb,
        updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        body.slug ?? cur.slug,
        body.short_label ?? cur.short_label,
        body.name ?? cur.name,
        body.duration ?? cur.duration,
        body.location_tag ?? cur.location_tag,
        priceMyr,
        priceIdr,
        body.is_featured !== undefined ? Boolean(body.is_featured) : cur.is_featured,
        body.status ?? cur.status,
        body.sort_order !== undefined ? Number(body.sort_order) : cur.sort_order,
        body.image_url ?? cur.image_url,
        JSON.stringify(body.hotels ?? cur.hotels),
        body.description ?? cur.description,
        JSON.stringify(body.includes ?? cur.includes),
        JSON.stringify(body.excludes ?? cur.excludes),
        JSON.stringify(body.notes ?? cur.notes),
        JSON.stringify(body.tiers ?? cur.tiers),
        JSON.stringify(body.itinerary ?? cur.itinerary),
      ],
    );

    const updated = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "UPDATE",
      entityType: "tour_package",
      entityId: updated.id,
      summary: `Perbarui paket: ${updated.name} (status: ${updated.status}, mulai RM ${updated.price_myr})`,
    });
    invalidatePublicCms();

    return okItem(updated);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui paket.",
      500,
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(["super_admin"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID paket tidak valid.", 400);

  const { rows } = await dbQuery(
    `DELETE FROM tour_packages WHERE id = $1 RETURNING id, name`,
    [id],
  );
  if (!rows[0]) return fail("Paket tidak ditemukan.", 404);

  await recordAuditLog({
    adminEmail: auth.user.email,
    action: "DELETE",
    entityType: "tour_package",
    entityId: id,
    summary: `Hapus permanen paket: ${rows[0].name}`,
  });
  invalidatePublicCms();

  return okItem({ deletedId: id });
}
