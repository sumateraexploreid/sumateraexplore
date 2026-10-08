/**
 * Konstanta locale yang aman dipakai di server maupun client.
 * Padanan dari LocaleCurrencyMiddleware / LocaleController Laravel.
 * - 'my' = Malaysia (mata uang MYR), bahasa Melayu. BAWAAN, sama seperti Laravel.
 * - URL tidak diberi prefix bahasa; pilihan disimpan di cookie.
 */
export const LOCALES = ["my", "id", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "my";
export const LOCALE_COOKIE = "locale";

/** Kode locale internal -> kode bahasa HTML / Intl / OpenGraph. */
export const HTML_LANG: Record<Locale, string> = { my: "ms", id: "id", en: "en" };
export const INTL_LOCALE: Record<Locale, string> = { my: "ms-MY", id: "id-ID", en: "en-US" };
export const OG_LOCALE: Record<Locale, string> = { my: "ms_MY", id: "id_ID", en: "en_US" };

export const isLocale = (v: unknown): v is Locale =>
  typeof v === "string" && (LOCALES as readonly string[]).includes(v);
