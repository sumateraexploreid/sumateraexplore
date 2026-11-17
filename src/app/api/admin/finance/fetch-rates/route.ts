import { okItem, fail } from "@/lib/admin-api";
import { requireAdminSession } from "@/lib/auth";

const EXCHANGERATE_HOST = "https://api.exchangerate.host";

interface ExchangerateHostConvert {
  success: boolean;
  result?: number;
  error?: string;
}

async function fetchRate(from: string, to: string): Promise<number> {
  const url = `${EXCHANGERATE_HOST}/convert?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=1`;
  const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    throw new Error(`exchangerate.host mengembalikan HTTP ${res.status}.`);
  }
  const json = (await res.json()) as ExchangerateHostConvert;
  if (!json.success || typeof json.result !== "number" || !Number.isFinite(json.result)) {
    throw new Error(json.error || "Kurs tidak dapat dibaca dari exchangerate.host.");
  }
  return json.result;
}

export async function GET() {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const [myrToIdr, sgdToIdr] = await Promise.all([
      fetchRate("MYR", "IDR"),
      fetchRate("SGD", "IDR"),
    ]);

    return okItem({
      myrToIdr: Number(myrToIdr.toFixed(4)),
      sgdToIdr: Number(sgdToIdr.toFixed(4)),
      source: "exchangerate.host",
      fetchedAt: new Date().toISOString(),
    });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal mengambil kurs otomatis.",
      502,
    );
  }
}