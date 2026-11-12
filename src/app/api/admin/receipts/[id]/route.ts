import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";
import { ensureReceiptsTable } from "../route";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(["super_admin", "editor", "cs_operator"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID kwitansi tidak valid.", 400);

  try {
    await ensureReceiptsTable();
    const { rows: existing } = await dbQuery(
      `SELECT * FROM receipt_logs WHERE id = $1 LIMIT 1`,
      [id],
    );
    const cur = existing[0];
    if (!cur) return fail("Kwitansi tidak ditemukan.", 404);

    const body = await req.json();
    const totalAmount =
      body.total_amount !== undefined
        ? Math.max(0, Number(body.total_amount) || 0)
        : Number(cur.total_amount);
    const dpAmount =
      body.dp_amount !== undefined
        ? Math.max(0, Number(body.dp_amount) || 0)
        : Number(cur.dp_amount);
    const remainingAmount =
      body.remaining_amount !== undefined
        ? Math.max(0, Number(body.remaining_amount) || 0)
        : Math.max(0, totalAmount - dpAmount);

    const { rows } = await dbQuery(
      `UPDATE receipt_logs SET
        receipt_number = $2,
        booking_id = $3,
        booking_code = $4,
        issue_date = COALESCE(NULLIF($5, '')::date, issue_date),
        guest_name = $6,
        guest_phone = $7,
        guest_origin = $8,
        package_name = $9,
        trip_date = $10,
        pax_summary = $11,
        vehicle_type = $12,
        currency = $13,
        items_json = $14::jsonb,
        total_amount = $15,
        dp_amount = $16,
        remaining_amount = $17,
        payment_status = $18,
        payment_method = $19,
        notes = $20,
        issuer_name = $21,
        updated_at = NOW()
       WHERE id = $1
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
        id,
        body.receipt_number ?? cur.receipt_number,
        body.booking_id !== undefined ? (body.booking_id ? Number(body.booking_id) : null) : cur.booking_id,
        body.booking_code !== undefined ? body.booking_code : cur.booking_code,
        body.issue_date !== undefined ? body.issue_date : null,
        body.guest_name ?? cur.guest_name,
        body.guest_phone ?? cur.guest_phone,
        body.guest_origin ?? cur.guest_origin,
        body.package_name ?? cur.package_name,
        body.trip_date ?? cur.trip_date,
        body.pax_summary ?? cur.pax_summary,
        body.vehicle_type ?? cur.vehicle_type,
        body.currency ?? cur.currency,
        body.items !== undefined ? JSON.stringify(body.items) : JSON.stringify(cur.items_json),
        totalAmount,
        dpAmount,
        remainingAmount,
        body.payment_status ?? cur.payment_status,
        body.payment_method ?? cur.payment_method,
        body.notes !== undefined ? body.notes : cur.notes,
        body.issuer_name ?? cur.issuer_name,
      ],
    );

    const updated = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "UPDATE",
      entityType: "receipt",
      entityId: updated.receipt_number,
      summary: `Perbarui kwitansi ${updated.receipt_number} (${updated.guest_name})`,
    });

    return okItem(updated);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui kwitansi.",
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
  if (!id) return fail("ID kwitansi tidak valid.", 400);

  await ensureReceiptsTable();
  const { rows } = await dbQuery(
    `DELETE FROM receipt_logs WHERE id = $1 RETURNING receipt_number`,
    [id],
  );
  if (!rows[0]) return fail("Kwitansi tidak ditemukan.", 404);

  await recordAuditLog({
    adminEmail: auth.user.email,
    action: "DELETE",
    entityType: "receipt",
    entityId: rows[0].receipt_number,
    summary: `Hapus kwitansi ${rows[0].receipt_number}`,
  });

  return okItem({ deleted: true, id });
}

