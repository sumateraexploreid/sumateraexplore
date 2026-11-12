import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";
import { DEFAULT_SITE_BUNDLE, invalidatePublicCms } from "@/lib/cms";

const VALID_SETTING_KEYS = new Set([
  "finance",
  "business",
  "channels",
  "fleet",
  "faqs",
  "operations",
  "integrations",
]);

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const { rows } = await dbQuery<{ key: string; value: unknown; updated_at: string }>(
      `SELECT key, value, updated_at FROM site_settings ORDER BY key ASC`,
    );
    const settings: Record<string, unknown> = {
      finance: DEFAULT_SITE_BUNDLE.finance,
      business: DEFAULT_SITE_BUNDLE.business,
      channels: { socialChannels: DEFAULT_SITE_BUNDLE.socialChannels },
      fleet: { options: DEFAULT_SITE_BUNDLE.fleet },
      faqs: { items: DEFAULT_SITE_BUNDLE.faqs },
      operations: {
        documentationGear: DEFAULT_SITE_BUNDLE.documentationGear,
        operatorNotes: DEFAULT_SITE_BUNDLE.operatorNotes,
        legalDocuments: DEFAULT_SITE_BUNDLE.legalDocuments,
      },
      integrations: DEFAULT_SITE_BUNDLE.integrations,
    };

    for (const r of rows) {
      settings[r.key] = r.value;
    }

    return okItem(settings);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat pengaturan.",
      500,
    );
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = (await req.json()) as { key?: string; value?: unknown };
    const key = String(body.key || "").trim();
    if (!VALID_SETTING_KEYS.has(key)) {
      return fail("Kunci pengaturan tidak valid.", 400);
    }

    await dbQuery(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
      [key, JSON.stringify(body.value ?? {})],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "SETTINGS",
      entityType: "site_settings",
      entityId: key,
      summary: `Simpan pengaturan situs: ${key}`,
    });
    invalidatePublicCms();

    return okItem({ key, value: body.value });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal menyimpan pengaturan.",
      500,
    );
  }
}

