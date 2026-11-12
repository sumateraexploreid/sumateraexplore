import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdminSession(["super_admin", "editor", "cs_operator"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const id = Number((await ctx.params).id);
  if (!id) return fail("ID order tidak valid.", 400);

  try {
    const body = await req.json();
    const { rows: curRows } = await dbQuery(`SELECT * FROM bookings WHERE id = $1 LIMIT 1`, [
      id,
    ]);
    const cur = curRows[0];
    if (!cur) return fail("Order tidak ditemukan.", 404);

    const { rows } = await dbQuery(
      `UPDATE bookings SET
        guest_name = $2,
        guest_phone = $3,
        guest_origin = $4,
        trip_date = COALESCE(NULLIF($5, '')::date, trip_date),
        adults_count = $6,
        children_count = $7,
        vehicle_type = $8,
        currency = $9,
        estimated_total = $10,
        dp_amount = $11,
        dp_status = $12,
        assigned_driver = $13,
        notes = $14,
        updated_at = NOW()
       WHERE id = $1
       RETURNING *, TO_CHAR(trip_date, 'YYYY-MM-DD') AS trip_date,
                 estimated_total::float8 AS estimated_total,
                 dp_amount::float8 AS dp_amount`,
      [
        id,
        body.guest_name ?? cur.guest_name,
        body.guest_phone ?? cur.guest_phone,
        body.guest_origin ?? cur.guest_origin,
        body.trip_date !== undefined ? body.trip_date : null,
        body.adults_count !== undefined ? Number(body.adults_count) : cur.adults_count,
        body.children_count !== undefined ? Number(body.children_count) : cur.children_count,
        body.vehicle_type ?? cur.vehicle_type,
        body.currency ?? cur.currency,
        body.estimated_total !== undefined
          ? Number(body.estimated_total)
          : cur.estimated_total,
        body.dp_amount !== undefined ? Number(body.dp_amount) : cur.dp_amount,
        body.dp_status ?? cur.dp_status,
        body.assigned_driver !== undefined ? body.assigned_driver : cur.assigned_driver,
        body.notes !== undefined ? body.notes : cur.notes,
      ],
    );

    const updated = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "UPDATE",
      entityType: "booking",
      entityId: updated.booking_code,
      summary: `Update order ${updated.booking_code} -> status ${updated.dp_status}, DP ${updated.currency} ${updated.dp_amount}`,
    });

    return okItem(updated);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui order.",
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
  if (!id) return fail("ID order tidak valid.", 400);

  const { rows } = await dbQuery(
    `DELETE FROM bookings WHERE id = $1 RETURNING booking_code`,
    [id],
  );
  if (!rows[0]) return fail("Order tidak ditemukan.", 404);

  await recordAuditLog({
    adminEmail: auth.user.email,
    action: "DELETE",
    entityType: "booking",
    entityId: rows[0].booking_code,
    summary: `Hapus order ${rows[0].booking_code}`,
  });

  return okItem({ deletedId: id });
}
