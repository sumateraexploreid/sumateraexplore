import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";
import { invalidatePublicCms } from "@/lib/cms";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID galeri tidak valid.", 400);

  try {
    const body = await req.json();
    const { rows: curRows } = await dbQuery(
      `SELECT * FROM gallery_items WHERE id = $1 LIMIT 1`,
      [id],
    );
    const cur = curRows[0];
    if (!cur) return fail("Item galeri tidak ditemukan.", 404);

    const { rows } = await dbQuery(
      `UPDATE gallery_items SET
        image_url = $2,
        caption = $3,
        category = $4,
        type = $5,
        slug = $6,
        sort_order = $7,
        is_active = $8
       WHERE id = $1
       RETURNING *`,
      [
        id,
        body.image_url ?? cur.image_url,
        body.caption ?? cur.caption,
        body.category ?? cur.category,
        body.type ?? cur.type,
        body.slug !== undefined ? body.slug : cur.slug,
        body.sort_order !== undefined ? Number(body.sort_order) : cur.sort_order,
        body.is_active !== undefined ? Boolean(body.is_active) : cur.is_active,
      ],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "UPDATE",
      entityType: "gallery_item",
      entityId: id,
      summary: `Update foto galeri: ${rows[0].caption}`,
    });
    invalidatePublicCms();

    return okItem(rows[0]);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui item galeri.",
      500,
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID galeri tidak valid.", 400);

  const { rows } = await dbQuery(
    `DELETE FROM gallery_items WHERE id = $1 RETURNING caption`,
    [id],
  );
  if (!rows[0]) return fail("Item galeri tidak ditemukan.", 404);

  await recordAuditLog({
    adminEmail: auth.user.email,
    action: "DELETE",
    entityType: "gallery_item",
    entityId: id,
    summary: `Hapus foto galeri: ${rows[0].caption}`,
  });
  invalidatePublicCms();

  return okItem({ deletedId: id });
}
