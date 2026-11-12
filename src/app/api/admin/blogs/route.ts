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
    const category = (sp.get("category") || "").trim();
    const status = (sp.get("status") || "").trim();

    const filters: string[] = [];
    const params: unknown[] = [];

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      filters.push(
        `(LOWER(title) LIKE $${params.length} OR LOWER(slug) LIKE $${params.length})`,
      );
    }
    if (category && category !== "all") {
      params.push(category);
      filters.push(`category = $${params.length}`);
    }
    if (status && status !== "all") {
      params.push(status);
      filters.push(`status = $${params.length}`);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countRes = await dbQuery<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM blog_posts ${where}`,
      params,
    );
    const total = countRes.rows[0]?.total || 0;

    params.push(pageSize, offset);
    const { rows } = await dbQuery(
      `SELECT id, slug, title, excerpt, category, image_url, read_time,
              related_package_slug, tags, sections, status, created_at, updated_at
       FROM blog_posts
       ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return okList(rows, total, page, pageSize);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat daftar artikel.",
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
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();

    if (!slug || !title) {
      return fail("Slug dan judul artikel wajib diisi.", 400);
    }

    const { rows } = await dbQuery(
      `INSERT INTO blog_posts (
        slug, title, excerpt, category, image_url, read_time,
        related_package_slug, tags, sections, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7, $8::jsonb, $9::jsonb, $10
      )
      RETURNING *`,
      [
        slug,
        title,
        excerpt || title,
        String(body.category || "Rute"),
        String(body.image_url || "/images/sumut/sumatra_panorama.webp"),
        String(body.read_time || "5 menit baca"),
        String(body.related_package_slug || "danau-toba-3d2n"),
        JSON.stringify(Array.isArray(body.tags) ? body.tags : []),
        JSON.stringify(Array.isArray(body.sections) ? body.sections : []),
        body.status || "published",
      ],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "blog_post",
      entityId: rows[0].id,
      summary: `Tulis artikel baru: ${rows[0].title}`,
    });
    invalidatePublicCms();

    return okItem(rows[0], 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal membuat artikel.";
    if (msg.includes("duplicate key")) {
      return fail("Slug artikel sudah dipakai.", 409);
    }
    return fail(msg, 500);
  }
}

