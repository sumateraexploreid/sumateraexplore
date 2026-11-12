import { okItem, fail } from "@/lib/admin-api";
import { requireAdminSession } from "@/lib/auth";
import { checkDbHealth, dbQuery } from "@/lib/db";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const [dbHealth, countsRes, bookingStatsRes, trendRes, financeRes, recentBookingsRes, auditRes] =
      await Promise.all([
        checkDbHealth(),
        dbQuery<{
          total_packages: number;
          active_packages: number;
          total_blogs: number;
          published_blogs: number;
          total_gallery: number;
          total_media: number;
          total_admins: number;
        }>(`
          SELECT
            (SELECT COUNT(*)::int FROM tour_packages) AS total_packages,
            (SELECT COUNT(*)::int FROM tour_packages WHERE status = 'active') AS active_packages,
            (SELECT COUNT(*)::int FROM blog_posts) AS total_blogs,
            (SELECT COUNT(*)::int FROM blog_posts WHERE status = 'published') AS published_blogs,
            (SELECT COUNT(*)::int FROM gallery_items WHERE is_active = TRUE) AS total_gallery,
            (SELECT COUNT(*)::int FROM media_assets) AS total_media,
            (SELECT COUNT(*)::int FROM admin_users WHERE is_active = TRUE) AS total_admins
        `),
        dbQuery<{
          dp_status: string;
          count: number;
          est_total: string;
          dp_total: string;
        }>(`
          SELECT
            dp_status,
            COUNT(*)::int AS count,
            COALESCE(SUM(estimated_total), 0)::text AS est_total,
            COALESCE(SUM(dp_amount), 0)::text AS dp_total
          FROM bookings
          GROUP BY dp_status
        `),
        dbQuery<{ day: string; count: number; total_myr: string }>(`
          WITH days AS (
            SELECT generate_series(
              CURRENT_DATE - INTERVAL '13 days',
              CURRENT_DATE,
              INTERVAL '1 day'
            )::date AS d
          )
          SELECT
            TO_CHAR(days.d, 'DD/MM') AS day,
            COUNT(b.id)::int AS count,
            COALESCE(SUM(b.estimated_total), 0)::text AS total_myr
          FROM days
          LEFT JOIN bookings b ON DATE(b.created_at) = days.d AND b.dp_status <> 'cancelled'
          GROUP BY days.d
          ORDER BY days.d ASC
        `),
        dbQuery<{ value: { myrToIdr?: number; sgdToIdr?: number; dpPercentage?: number } }>(
          `SELECT value FROM site_settings WHERE key = 'finance' LIMIT 1`,
        ),
        dbQuery<{
          id: number;
          booking_code: string;
          guest_name: string;
          package_name: string;
          adults_count: number;
          children_count: number;
          estimated_total: string;
          dp_amount: string;
          dp_status: string;
          created_at: string;
        }>(`
          SELECT id, booking_code, guest_name, package_name, adults_count, children_count,
                 estimated_total::text, dp_amount::text, dp_status, created_at
          FROM bookings
          ORDER BY created_at DESC
          LIMIT 6
        `),
        dbQuery<{
          id: number;
          admin_email: string;
          action: string;
          entity_type: string;
          entity_id: string;
          summary: string;
          created_at: string;
        }>(`
          SELECT id, admin_email, action, entity_type, entity_id, summary, created_at
          FROM audit_logs
          ORDER BY created_at DESC
          LIMIT 8
        `),
      ]);

    const statusSummary: Record<string, { count: number; estTotal: number; dpTotal: number }> = {
      pending_inquiry: { count: 0, estTotal: 0, dpTotal: 0 },
      waiting_dp: { count: 0, estTotal: 0, dpTotal: 0 },
      dp_paid: { count: 0, estTotal: 0, dpTotal: 0 },
      completed: { count: 0, estTotal: 0, dpTotal: 0 },
      cancelled: { count: 0, estTotal: 0, dpTotal: 0 },
    };

    let totalBookings = 0;
    let totalPipelineMyr = 0;
    let totalDpCollectedMyr = 0;

    for (const row of bookingStatsRes.rows) {
      const count = Number(row.count);
      const est = Number(row.est_total);
      const dp = Number(row.dp_total);
      statusSummary[row.dp_status] = { count, estTotal: est, dpTotal: dp };
      totalBookings += count;
      if (row.dp_status !== "cancelled") {
        totalPipelineMyr += est;
        if (row.dp_status === "dp_paid" || row.dp_status === "completed") {
          totalDpCollectedMyr += dp;
        }
      }
    }

    return okItem({
      dbHealth,
      counts: countsRes.rows[0],
      bookings: {
        total: totalBookings,
        totalPipelineMyr,
        totalDpCollectedMyr,
        byStatus: statusSummary,
      },
      trend14Days: trendRes.rows.map((r) => ({
        day: r.day,
        count: r.count,
        totalMyr: Number(r.total_myr),
      })),
      finance: financeRes.rows[0]?.value || {
        myrToIdr: 4400,
        sgdToIdr: 11500,
        dpPercentage: 30,
      },
      recentBookings: recentBookingsRes.rows.map((b) => ({
        ...b,
        estimated_total: Number(b.estimated_total),
        dp_amount: Number(b.dp_amount),
      })),
      recentAuditLogs: auditRes.rows,
    });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat statistik dashboard.",
      500,
    );
  }
}

