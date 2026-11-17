import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okList, fail, parsePagination } from "@/lib/admin-api";
import { requireAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const sp = req.nextUrl.searchParams;
    const { page, pageSize, offset, q } = parsePagination(sp);
    const action = (sp.get("action") || "").trim();
    const entityType = (sp.get("entity_type") || "").trim();
    const dateFrom = (sp.get("date_from") || "").trim();
    const dateTo = (sp.get("date_to") || "").trim();

    const filters: string[] = [];
    const params: unknown[] = [];

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      filters.push(
        `(LOWER(admin_email) LIKE $${params.length} OR LOWER(entity_type) LIKE $${params.length} OR LOWER(entity_id) LIKE $${params.length} OR LOWER(summary) LIKE $${params.length})`,
      );
    }
    if (action) {
      params.push(action);
      filters.push(`action = $${params.length}`);
    }
    if (entityType) {
      params.push(entityType);
      filters.push(`entity_type = $${params.length}`);
    }
    if (dateFrom) {
      params.push(dateFrom);
      filters.push(`created_at >= $${params.length}::date`);
    }
    if (dateTo) {
      params.push(dateTo);
      filters.push(`created_at < ($${params.length}::date + INTERVAL '1 day')`);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countRes = await dbQuery<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM audit_logs ${where}`,
      params,
    );
    const total = countRes.rows[0]?.total || 0;

    params.push(pageSize, offset);
    const { rows } = await dbQuery(
      `SELECT id, admin_email, action, entity_type, entity_id, summary, created_at
       FROM audit_logs
       ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return okList(rows, total, page, pageSize);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat riwayat audit.",
      500,
    );
  }
}