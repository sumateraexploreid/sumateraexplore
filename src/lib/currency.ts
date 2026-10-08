import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';

export const PRICE_BASE = 'MYR';
export const REPORTING = 'IDR';

export const DEFAULT_MYR_IDR = 4400;
export const DEFAULT_SGD_IDR = 11500;

export const CURRENCIES: Record<string, any> = {
  MYR: { symbol: 'RM ', decimals: 0, recordDecimals: 2, decPoint: '.', thousandsSep: ',' },
  IDR: { symbol: 'Rp ', decimals: 0, recordDecimals: 0, decPoint: ',', thousandsSep: '.' },
  SGD: { symbol: 'S$ ', decimals: 0, recordDecimals: 2, decPoint: '.', thousandsSep: ',' },
};

export const LOCALE_CURRENCY: Record<string, string> = {
  my: 'MYR',
  id: 'IDR',
  en: 'SGD',
};

export function currencyFor(locale: string = 'my') {
  return LOCALE_CURRENCY[locale] || PRICE_BASE;
}

export function config(currency: string) {
  const code = currency.toUpperCase();
  if (!CURRENCIES[code]) {
    console.warn(`CurrencyHelper: unknown currency '${code}', presenting as ${PRICE_BASE}`);
    return CURRENCIES[PRICE_BASE];
  }
  return CURRENCIES[code];
}

/**
 * Fetch manual rates from Supabase cached for 300 seconds (or revalidated).
 */
export const getManualRates = unstable_cache(
  async () => {
    // We create a fresh client because unstable_cache doesn't have request context cookies easily
    // Or we use nextjs fetch directly to a serverless function, or we pass data from page.
    // For simplicity, we create an anonymous client (no cookies needed for public settings)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
    const supabase = createSupabaseClient(supabaseUrl, supabaseKey);

    const { data } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'general')
      .single();

    const settings = typeof data?.value === 'string' ? JSON.parse(data.value) : (data?.value || {});
    const finance = settings?.finance || {};

    const myr = parseFloat(finance.exchange_rate_manual_myr || String(DEFAULT_MYR_IDR));
    const sgd = parseFloat(finance.exchange_rate_manual_sgd || String(DEFAULT_SGD_IDR));

    return {
      myr: myr > 0 ? myr : DEFAULT_MYR_IDR,
      sgd: sgd > 0 ? sgd : DEFAULT_SGD_IDR,
    };
  },
  ['currency_manual_rates'],
  { revalidate: 300 }
);

export async function getRate(targetCurrency: string) {
  const target = targetCurrency.toUpperCase();
  if (target === PRICE_BASE) return 1.0;

  const rates = await getManualRates();

  switch (target) {
    case 'IDR':
      return rates.myr;
    case 'SGD':
      return rates.sgd > 0 ? rates.myr / rates.sgd : 0.0;
  }

  console.warn(`CurrencyHelper: unsupported currency '${target}', falling back to ${PRICE_BASE}`);
  return 1.0;
}

export async function toIdr(amountInMyr: number | null | undefined) {
  if (!amountInMyr) return 0;
  const rate = await getRate('IDR');
  return Math.round(amountInMyr * rate * 100) / 100;
}

export function render(amount: number | null | undefined, currency: string, precisionKey: 'decimals' | 'recordDecimals', withSymbol: boolean) {
  if (amount == null || Number.isNaN(amount)) {
    return '-';
  }

  const c = config(currency);
  const decimals = c[precisionKey] ?? c.decimals;

  // Formatting number using JS Intl or custom logic to match PHP behavior
  let formatted = amount.toFixed(decimals);
  const parts = formatted.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, c.thousandsSep);
  formatted = parts.join(c.decPoint);

  return withSymbol ? `${c.symbol}${formatted}` : formatted;
}

export function formatIn(amount: number | null | undefined, currency: string, withSymbol: boolean = true) {
  return render(amount, currency, 'decimals', withSymbol);
}

export function formatRecord(amount: number | null | undefined, currency: string, withSymbol: boolean = true) {
  return render(amount, currency, 'recordDecimals', withSymbol);
}

export async function formatPrice(priceInMyr: number | null | undefined, locale: string = 'my') {
  if (priceInMyr == null) {
    return '-';
  }

  const currency = currencyFor(locale);
  const rate = await getRate(currency);
  return formatIn(priceInMyr * rate, currency);
}
