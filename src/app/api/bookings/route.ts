import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return fail("Payload tidak valid.", 400);

    const guestName = String(body.guest_name || "Tamu Website").trim().slice(0, 100);
    const guestPhone = String(body.guest_phone || "").trim().slice(0, 40);
    const packageSlug = String(body.package_slug || "").trim().slice(0, 80);
    const packageName = String(body.package_name || "").trim().slice(0, 140);

    if (!packageSlug || !packageName) {
      return fail("Paket wisata wajib disertakan.", 400);
    }

    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const code = `SE-${yy}${mm}-${Math.floor(100 + Math.random() * 900)}`;

    const { rows } = await dbQuery<{ id: number; booking_code: string }>(
      `INSERT INTO bookings (
        booking_code, package_slug, package_name, guest_name, guest_phone,
        guest_origin, trip_date, adults_count, children_count, vehicle_type,
        currency, estimated_total, dp_amount, dp_status, notes, source
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, NULLIF($7, '')::date, $8, $9, $10,
        $11, $12, 0, 'pending_inquiry', $13, 'web_form'
      )
      RETURNING id, booking_code`,
      [
        code,
        packageSlug,
        packageName,
        guestName,
        guestPhone || "Via WhatsApp Web",
        String(body.guest_origin || "Malaysia").slice(0, 40),
        String(body.trip_date || ""),
        Math.max(1, Math.min(40, Number(body.adults_count) || 2)),
        Math.max(0, Math.min(20, Number(body.children_count) || 0)),
        String(body.vehicle_type || "Innova / SUV").slice(0, 60),
        String(body.currency || "MYR").slice(0, 8),
        Math.max(0, Number(body.estimated_total) || 0),
        String(body.notes || "Inquiry langsung dari kalkulator halaman paket.").slice(0, 500),
      ],
    );

    return okItem(rows[0], 201);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal mencatat permintaan.",
      500,
    );
  }
}

