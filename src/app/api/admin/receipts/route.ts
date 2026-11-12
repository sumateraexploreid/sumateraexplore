import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, okList, fail, parsePagination } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";

export async function ensureReceiptsTable() {
  await dbQuery(`
    CREATE TABLE IF NOT EXISTS receipt_logs (
      id SERIAL PRIMARY KEY,
      receipt_number VARCHAR(64) NOT NULL UNIQUE,
      booking_id INTEGER NULL,
      booking_code VARCHAR(64) DEFAULT '',
      issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
      guest_name VARCHAR(160) NOT NULL,
      guest_phone VARCHAR(64) DEFAULT '',
      guest_origin VARCHAR(120) DEFAULT '',
      package_name VARCHAR(200) NOT NULL,
      trip_date VARCHAR(40) DEFAULT '',
      pax_summary VARCHAR(140) DEFAULT '',
      vehicle_type VARCHAR(120) DEFAULT '',
      currency VARCHAR(8) NOT NULL DEFAULT 'MYR',
      items_json JSONB NOT NULL DEFAULT '[]'::jsonb,
      total_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
      dp_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
      remaining_amount NUMERIC(15,2) NOT NULL DEFAULT 0,
      payment_status VARCHAR(40) NOT NULL DEFAULT 'DP Lunas',
      payment_method VARCHAR(80) DEFAULT 'Transfer Bank / QRIS',
      notes TEXT DEFAULT '',
      issuer_name VARCHAR(120) DEFAULT '',
      created_by VARCHAR(160) DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function generateReceiptNumber() {
  const now = new Date();
  const ymd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rnd = Math.floor(1000 + Math.random() * 9000);
  return `KWT-${ymd}-${rnd}`;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    await ensureReceiptsTable();
    const sp = req.nextUrl.searchParams;
    const { page, pageSize, offset, q } = parsePagination(sp);

    const filters: string[] = [];
    const params: unknown[] = [];

    if (q) {
      params.push(`%${q.toLowerCase()}%`);
      filters.push(
        `(LOWER(receipt_number) LIKE $${params.length} OR LOWER(guest_name) LIKE $${params.length} OR LOWER(package_name) LIKE $${params.length} OR LOWER(booking_code) LIKE $${params.length})`,
      );
    }

    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const countRes = await dbQuery<{ total: number }>(
      `SELECT COUNT(*)::int AS total FROM receipt_logs ${where}`,
      params,
    );
    const total = countRes.rows[0]?.total || 0;

    params.push(pageSize, offset);
    const { rows } = await dbQuery(
      `SELECT id, receipt_number, booking_id, booking_code,
              TO_CHAR(issue_date, 'YYYY-MM-DD') AS issue_date,
              guest_name, guest_phone, guest_origin,
              package_name, trip_date, pax_summary, vehicle_type,
              currency, items_json AS items,
              total_amount::float8 AS total_amount,
              dp_amount::float8 AS dp_amount,
              remaining_amount::float8 AS remaining_amount,
              payment_status, payment_method, notes, issuer_name,
              created_by, created_at, updated_at
       FROM receipt_logs
       ${where}
       ORDER BY created_at DESC, id DESC
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params,
    );

    return okList(rows, total, page, pageSize);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat riwayat kwitansi.",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin", "editor", "cs_operator"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    await ensureReceiptsTable();
    const body = await req.json();

    const guestName = String(body.guest_name || "").trim();
    const packageName = String(body.package_name || "").trim();
    if (!guestName) return fail("Nama tamu wajib diisi.", 400);
    if (!packageName) return fail("Nama paket atau layanan wajib diisi.", 400);

    const receiptNumber =
      String(body.receipt_number || "").trim() || generateReceiptNumber();
    const totalAmount = Math.max(0, Number(body.total_amount) || 0);
    const dpAmount = Math.max(0, Number(body.dp_amount) || 0);
    const remainingAmount =
      body.remaining_amount !== undefined
        ? Math.max(0, Number(body.remaining_amount) || 0)
        : Math.max(0, totalAmount - dpAmount);
    const items = Array.isArray(body.items) ? body.items : [];

    const { rows } = await dbQuery(
      `INSERT INTO receipt_logs (
        receipt_number, booking_id, booking_code, issue_date,
        guest_name, guest_phone, guest_origin,
        package_name, trip_date, pax_summary, vehicle_type,
        currency, items_json, total_amount, dp_amount, remaining_amount,
        payment_status, payment_method, notes, issuer_name, created_by
      ) VALUES (
        $1, $2, $3, COALESCE(NULLIF($4, '')::date, CURRENT_DATE),
        $5, $6, $7,
        $8, $9, $10, $11,
        $12, $13::jsonb, $14, $15, $16,
        $17, $18, $19, $20, $21
      )
      RETURNING id, receipt_number, booking_id, booking_code,
                TO_CHAR(issue_date, 'YYYY-MM-DD') AS issue_date,
                guest_name, guest_phone, guest_origin,
                package_name, trip_date, pax_summary, vehicle_type,
                currency, items_json AS items,
                total_amount::float8 AS total_amount,
                dp_amount::float8 AS dp_amount,
                remaining_amount::float8 AS remaining_amount,
                payment_status, payment_method, notes, issuer_name,
                created_by, created_at, updated_at`,
      [
        receiptNumber,
        body.booking_id ? Number(body.booking_id) : null,
        String(body.booking_code || "").trim(),
        String(body.issue_date || "").trim(),
        guestName,
        String(body.guest_phone || "").trim(),
        String(body.guest_origin || "").trim(),
        packageName,
        String(body.trip_date || "").trim(),
        String(body.pax_summary || "").trim(),
        String(body.vehicle_type || "").trim(),
        String(body.currency || "MYR").trim(),
        JSON.stringify(items),
        totalAmount,
        dpAmount,
        remainingAmount,
        String(body.payment_status || "DP Lunas").trim(),
        String(body.payment_method || "Transfer Bank / QRIS").trim(),
        String(body.notes || "").trim(),
        String(body.issuer_name || auth.user.name || "Tim Sumatera Explore").trim(),
        auth.user.email,
      ],
    );

    const created = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "receipt",
      entityId: created.receipt_number,
      summary: `Buat kwitansi ${created.receipt_number} untuk ${created.guest_name} (${created.currency} ${created.total_amount})`,
    });

    return okItem(created, 201);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal menyimpan kwitansi.",
      500,
    );
  }
}

