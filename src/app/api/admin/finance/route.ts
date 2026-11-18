import { okItem, fail } from "@/lib/admin-api";
import { dbQuery } from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { DEFAULT_SITE_BUNDLE } from "@/lib/cms";

interface FinanceSettings {
  myrToIdr: number;
  sgdToIdr: number;
  dpPercentage: number;
  dpRuleNote: string;
  weekdayDisclaimer: string;
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const { rows } = await dbQuery<{
      value: unknown;
      updated_at: string | null;
    }>(
      `SELECT value, updated_at FROM site_settings WHERE key = 'finance'`,
    );

    const finance = {
      ...DEFAULT_SITE_BUNDLE.finance,
      ...(rows[0]?.value as Partial<FinanceSettings> | undefined),
    };

    // Calculate aggregated metrics from bookings
    const statsQuery = await dbQuery<{
      total_bookings: number;
      total_estimated: number;
      total_dp: number;
      total_ar: number;
    }>(`
      SELECT 
        COUNT(*)::int AS total_bookings,
        COALESCE(SUM(estimated_total), 0)::float8 AS total_estimated,
        COALESCE(SUM(dp_amount), 0)::float8 AS total_dp,
        COALESCE(SUM(CASE WHEN dp_status IN ('paid', 'dp_received', 'confirmed') THEN (estimated_total - dp_amount) ELSE 0 END), 0)::float8 AS total_ar
      FROM bookings
    `).catch(() => ({ rows: [] }));

    const monthlyQuery = await dbQuery<{
      month_label: string;
      order_count: number;
      revenue: number;
    }>(`
      SELECT 
        TO_CHAR(created_at, 'YYYY-MM') AS month_label,
        COUNT(*)::int AS order_count,
        COALESCE(SUM(estimated_total), 0)::float8 AS revenue
      FROM bookings
      GROUP BY TO_CHAR(created_at, 'YYYY-MM')
      ORDER BY month_label ASC
      LIMIT 6
    `).catch(() => ({ rows: [] }));

    const packageDistQuery = await dbQuery<{
      package_name: string;
      booking_count: number;
    }>(`
      SELECT 
        COALESCE(package_name, 'Trip Danau Toba') AS package_name,
        COUNT(*)::int AS booking_count
      FROM bookings
      GROUP BY package_name
      ORDER BY booking_count DESC
      LIMIT 5
    `).catch(() => ({ rows: [] }));

    const outstandingQuery = await dbQuery<{
      id: number;
      booking_code: string;
      guest_name: string;
      package_name: string;
      currency: string;
      estimated_total: number;
      dp_amount: number;
      balance: number;
    }>(`
      SELECT 
        id, booking_code, guest_name, package_name, currency,
        estimated_total::float8, dp_amount::float8,
        (estimated_total - dp_amount)::float8 AS balance
      FROM bookings
      WHERE (estimated_total - dp_amount) > 0
      ORDER BY created_at DESC
      LIMIT 6
    `).catch(() => ({ rows: [] }));

    return okItem({
      finance,
      updatedAt: rows[0]?.updated_at ?? null,
      analytics: {
        summary: statsQuery.rows[0] ?? {
          total_bookings: 0,
          total_estimated: 0,
          total_dp: 0,
          total_ar: 0,
        },
        monthly: monthlyQuery.rows ?? [],
        packageDistribution: packageDistQuery.rows ?? [],
        outstandingOrders: outstandingQuery.rows ?? [],
      },
    });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat konfigurasi keuangan.",
      500,
    );
  }
}
