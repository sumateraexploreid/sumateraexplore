import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth";
import { fetchLatestRates } from "@/lib/currency-cron";

export async function GET() {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const result = await fetchLatestRates();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}