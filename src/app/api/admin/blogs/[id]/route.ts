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
  if (!id) return fail("ID artikel tidak valid.", 400);

  try {
    const body = await req.json();
    const { rows: curRows } = await dbQuery(`SELECT * FROM blog_posts WHERE id = $1 LIMIT 1`, [
      id,
    ]);
    const cur = curRows[0];
    if (!cur) return fail("Artikel tidak ditemukan.", 404);

    const { rows } = await dbQuery(
      `UPDATE blog_posts SET
        slug = $2,
        title = $3,
        excerpt = $4,
        category = $5,
        image_url = $6,
        read_time = $7,
        related_package_slug = $8,
        tags = $9::jsonb,
        sections = $10::jsonb,
        status = $11,
        updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [
        id,
        body.slug ?? cur.slug,
        body.title ?? cur.title,
        body.excerpt ?? cur.excerpt,
        body.category ?? cur.category,
        body.image_url ?? cur.image_url,
        body.read_time ?? cur.read_time,
        body.related_package_slug ?? cur.related_package_slug,
        JSON.stringify(body.tags ?? cur.tags),
        JSON.stringify(body.sections ?? cur.sections),
        body.status ?? cur.status,
      ],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "UPDATE",
      entityType: "blog_post",
      entityId: id,
      summary: `Update artikel: ${rows[0].title} (${rows[0].status})`,
    });
    invalidatePublicCms();

    return okItem(rows[0]);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui artikel.",
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
  if (!id) return fail("ID artikel tidak valid.", 400);

  const { rows } = await dbQuery(
    `DELETE FROM blog_posts WHERE id = $1 RETURNING id, title`,
    [id],
  );
  if (!rows[0]) return fail("Artikel tidak ditemukan.", 404);

  await recordAuditLog({
    adminEmail: auth.user.email,
    action: "DELETE",
    entityType: "blog_post",
    entityId: id,
    summary: `Hapus artikel: ${rows[0].title}`,
  });
  invalidatePublicCms();

  return okItem({ deletedId: id });
}
