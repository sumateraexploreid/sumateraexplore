import "server-only";
import { cookies } from "next/headers";
import en from "./dictionaries/en.json";
import id from "./dictionaries/id.json";
import my from "./dictionaries/my.json";

import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./locales";

export * from "./locales";

type Dictionary = Record<string, string>;
const dictionaries: Record<Locale, Dictionary> = { en, id, my };

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Padanan __() Laravel: kunci = teks sumber; bila tak ada terjemahan,
 * kembalikan kunci apa adanya. Mendukung placeholder `:nama`.
 */
export function translate(
  locale: Locale,
  key: string | null | undefined,
  replace: Record<string, string | number> = {},
): string {
  if (key == null || key === "") return "";
  let out = dictionaries[locale][key] ?? key;
  for (const [name, value] of Object.entries(replace)) {
    out = out.replaceAll(`:${name}`, String(value));
  }
  return out;
}

/** Ambil fungsi t() terikat ke locale aktif (untuk Server Component). */
export async function getTranslator() {
  const locale = await getLocale();
  const t = (key: string | null | undefined, replace?: Record<string, string | number>) =>
    translate(locale, key, replace);
  return { locale, t };
}
