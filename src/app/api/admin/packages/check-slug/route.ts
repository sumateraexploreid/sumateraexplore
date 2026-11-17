import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { requireAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  const slug = req.nextUrl.searchParams.get("slug")?.trim().toLowerCase() || "";
  if (!slug || slug.length < 3) {
    return okItem({ exists: false, slug });
  }

  try {
    const { rows } = await dbQuery<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM tour_packages WHERE slug = $1) AS exists`,
      [slug],
    );
    return okItem({ exists: rows[0]?.exists || false, slug });
  } catch (err) {
    return fail(err instanceof Error ? err.message : "Gagal memeriksa slug.", 500);
  }
}