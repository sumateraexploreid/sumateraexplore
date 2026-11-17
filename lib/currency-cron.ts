import { dbQuery } from "@/lib/db";
import { DEFAULT_SITE_BUNDLE } from "@/lib/cms";

interface FinanceSettings {
  myrToIdr: number;
  sgdToIdr: number;
  dpPercentage: number;
  dpRuleNote: string;
  weekdayDisclaimer: string;
}

export async function fetchLatestRates() {
  try {
    const response = await fetch("https://api.exchangerate.host/latest?base=IDR&symbols=MYR,SGD");
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const data = await response.json();

    const myrToIdr = 1 / data.rates.MYR;
    const sgdToIdr = 1 / data.rates.SGD;

    // Fetch current finance settings to preserve other fields
    const { rows } = await dbQuery<{
      value: unknown;
    }>(`SELECT value FROM site_settings WHERE key = 'finance'`);

    const currentFinanceSettings: FinanceSettings = {
      ...DEFAULT_SITE_BUNDLE.finance,
      ...(rows[0]?.value as Partial<FinanceSettings> | undefined),
    };

    const updatedFinanceSettings: FinanceSettings = {
      ...currentFinanceSettings,
      myrToIdr: myrToIdr,
      sgdToIdr: sgdToIdr,
    };

    await dbQuery(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key) DO UPDATE SET value = $2::jsonb, updated_at = NOW()`,
      ["finance", JSON.stringify(updatedFinanceSettings)],
    );

    console.log("Currency rates updated successfully.");
    return { ok: true, data: updatedFinanceSettings };
  } catch (error) {
    console.error("Error updating currency rates:", error);
    return { ok: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}
