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

    return okItem({
      finance,
      updatedAt: rows[0]?.updated_at ?? null,
    });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat konfigurasi keuangan.",
      500,
    );
  }
}