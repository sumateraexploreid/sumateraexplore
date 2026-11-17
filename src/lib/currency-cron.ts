import { adminFetch } from "@/lib/admin-client";

export interface CurrencyRateResult {
  ok: boolean;
  data?: {
    myrToIdr: number;
    sgdToIdr: number;
    source: string;
    fetchedAt: string;
  };
  error?: string;
}

export async function fetchLatestRates(): Promise<CurrencyRateResult> {
  try {
    // Use exchangerate.host (free, no API key required)
    const response = await fetch(
      "https://api.exchangerate.host/latest?base=USD&symbols=MYR,IDR,SGD",
      { next: { revalidate: 0 } }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.rates || !data.rates.MYR || !data.rates.IDR || !data.rates.SGD) {
      throw new Error("Invalid response format from exchangerate.host");
    }

    // Calculate cross rates: MYR/IDR and SGD/IDR
    const usdToMyr = data.rates.MYR;
    const usdToIdr = data.rates.IDR;
    const usdToSgd = data.rates.SGD;

    const myrToIdr = Math.round(usdToIdr / usdToMyr);
    const sgdToIdr = Math.round(usdToIdr / usdToSgd);

    // Sanity checks
    if (myrToIdr < 3000 || myrToIdr > 6000) {
      throw new Error(`MYR/IDR rate ${myrToIdr} out of expected range`);
    }
    if (sgdToIdr < 8000 || sgdToIdr > 15000) {
      throw new Error(`SGD/IDR rate ${sgdToIdr} out of expected range`);
    }

    const fetchedAt = new Date().toISOString();

    // Update database via admin API
    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({
          key: "finance",
          value: { myrToIdr, sgdToIdr },
        }),
      });
    } catch (dbErr) {
      console.warn("Failed to update finance settings in DB:", dbErr);
      // Continue anyway - return the rates
    }

    return {
      ok: true,
      data: {
        myrToIdr,
        sgdToIdr,
        source: "exchangerate.host",
        fetchedAt,
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error fetching rates",
    };
  }
}