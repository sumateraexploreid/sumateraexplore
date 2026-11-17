import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";
import { ensureDefaultContentSeeded } from "@/lib/seed";
import { invalidatePublicCms } from "@/lib/cms";

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = (await req.json().catch(() => ({}))) as {
      action?: "seed_defaults" | "recalculate_package_idr";
    };

    const action = body.action || "seed_defaults";

    if (action === "seed_defaults") {
      await ensureDefaultContentSeeded();
      invalidatePublicCms();

      await recordAuditLog({
        adminEmail: auth.user.email,
        action: "UPDATE",
        entityType: "system",
        entityId: 0,
        summary: "Sinkronisasi data awal default website berhasil dijalankan",
      });

      return okItem({
        message: "Data awal default website (paket, artikel, galeri, pengaturan) berhasil disinkronkan.",
      });
    }

    if (action === "recalculate_package_idr") {
      // Get current finance rate
      const { rows: settingsRows } = await dbQuery<{ value: { myrToIdr: number } }>(
        `SELECT value FROM site_settings WHERE key = 'finance' LIMIT 1`,
      );
      const rate = Number(settingsRows[0]?.value?.myrToIdr || 4400);

      // Update package price_idr
      const { rowCount } = await dbQuery(
        `UPDATE tour_packages
         SET price_idr = ROUND(price_myr * $1),
             updated_at = NOW()
         WHERE status = 'active'`,
        [rate],
      );

      invalidatePublicCms();

      await recordAuditLog({
        adminEmail: auth.user.email,
        action: "UPDATE",
        entityType: "tour_packages",
        entityId: 0,
        summary: `Hitung ulang harga IDR seluruh paket tour berdasarkan kurs 1 MYR = Rp ${rate.toLocaleString("id-ID")}`,
      });

      return okItem({
        message: `Harga IDR pada ${rowCount || 0} paket tour aktif berhasil diselaraskan ke kurs 1 MYR = Rp ${rate.toLocaleString("id-ID")}.`,
      });
    }

    return fail("Aksi tidak valid.", 400);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal menjalankan sinkronisasi.",
      500,
    );
  }
}
