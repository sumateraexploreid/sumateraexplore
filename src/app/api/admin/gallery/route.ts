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
    const { page, pageSize, offset } = parsePagination(sp);
    const category = (sp.get("category") || "").trim();

    const params: unknown[] = [];
    const where =
      category && category !== "all"
        ? (() => {
            params.push(category);
            return `WHERE category = $${params.length}`;
          })()
        : "";

    const countRes = await dbQuery<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM gallery_items ${where}`,
      params,
    );
    const total = countRes.rows[0]?.total || 0;

    params.push(pageSize, offset);
    const { rows } = await dbQuery(
      `SELECT id, image_url, caption, category, type, slug, sort_order, is_active, created_at
       FROM gallery_items
       ${where}
       ORDER BY sort_order ASC, id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return okList(rows, total, page, pageSize);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat galeri.",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = await req.json();
    const imageUrl = String(body.image_url || "").trim();
    const caption = String(body.caption || "").trim();
    if (!imageUrl || !caption) {
      return fail("Gambar dan keterangan foto wajib diisi.", 400);
    }

    const { rows } = await dbQuery(
      `INSERT INTO gallery_items (image_url, caption, category, type, slug, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, COALESCE((SELECT MAX(sort_order) + 1 FROM gallery_items), 1), $6)
       RETURNING *`,
      [
        imageUrl,
        caption,
        String(body.category || "Danau Toba"),
        String(body.type || "general"),
        body.slug ? String(body.slug) : null,
        body.is_active !== false,
      ],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "gallery_item",
      entityId: rows[0].id,
      summary: `Tambah foto galeri: ${rows[0].caption}`,
    });
    invalidatePublicCms();

    return okItem(rows[0], 201);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal menambah foto galeri.",
      500,
    );
  }
}

