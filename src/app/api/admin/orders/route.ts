import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, okList, fail, parsePagination } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";

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
        `(LOWER(guest_name) LIKE $${params.length} OR LOWER(booking_code) LIKE $${params.length} OR LOWER(guest_phone) LIKE $${params.length} OR LOWER(package_name) LIKE $${params.length})`,
      );
    }
    if (status && status !== "all") {
      params.push(status);
      filters.push(`dp_status = $${params.length}`);
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countRes = await dbQuery<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM bookings ${where}`,
      params,
    );
    const total = countRes.rows[0]?.total || 0;

    params.push(pageSize, offset);
    const { rows } = await dbQuery(
      `SELECT id, booking_code, package_slug, package_name, guest_name, guest_phone,
              guest_origin, TO_CHAR(trip_date, 'YYYY-MM-DD') AS trip_date,
              adults_count, children_count, vehicle_type, currency,
              estimated_total::float8 AS estimated_total,
              dp_amount::float8 AS dp_amount,
              dp_status, assigned_driver, notes, source, created_at, updated_at
       FROM bookings
       ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return okList(rows, total, page, pageSize);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat data order.",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin", "editor", "cs_operator"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = await req.json();
    const guestName = String(body.guest_name || "").trim();
    const guestPhone = String(body.guest_phone || "").trim();
    const packageName = String(body.package_name || "").trim();
    const packageSlug = String(body.package_slug || "custom").trim();

    if (!guestName || !guestPhone || !packageName) {
      return fail("Nama tamu, nomor WA, dan paket wisata wajib diisi.", 400);
    }

    const randSuffix = Math.floor(100 + Math.random() * 900);
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const bookingCode = `SE-${yy}${mm}-${randSuffix}`;

    const { rows } = await dbQuery(
      `INSERT INTO bookings (
        booking_code, package_slug, package_name, guest_name, guest_phone,
        guest_origin, trip_date, adults_count, children_count, vehicle_type,
        currency, estimated_total, dp_amount, dp_status, assigned_driver,
        notes, source
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, NULLIF($7, '')::date, $8, $9, $10,
        $11, $12, $13, $14, $15,
        $16, 'admin'
      )
      RETURNING *, TO_CHAR(trip_date, 'YYYY-MM-DD') AS trip_date,
                estimated_total::float8 AS estimated_total,
                dp_amount::float8 AS dp_amount`,
      [
        bookingCode,
        packageSlug,
        packageName,
        guestName,
        guestPhone.replace(/[^0-9+]/g, ""),
        String(body.guest_origin || "Malaysia"),
        body.trip_date || "",
        Math.max(1, Number(body.adults_count) || 2),
        Math.max(0, Number(body.children_count) || 0),
        String(body.vehicle_type || "Innova / SUV"),
        String(body.currency || "MYR"),
        Math.max(0, Number(body.estimated_total) || 0),
        Math.max(0, Number(body.dp_amount) || 0),
        body.dp_status || "waiting_dp",
        String(body.assigned_driver || ""),
        String(body.notes || ""),
      ],
    );

    const created = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "booking",
      entityId: created.booking_code,
      summary: `Catat order ${created.booking_code} an. ${created.guest_name} (${created.dp_status})`,
    });

    return okItem(created, 201);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal mencatat order.",
      500,
    );
  }
}

