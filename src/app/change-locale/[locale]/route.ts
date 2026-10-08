import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_COOKIE, isLocale } from "@/i18n/locales";

/** Padanan LocaleController::changeLocale -- simpan cookie lalu kembali ke halaman asal. */
export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/change-locale/[locale]">,
) {
  const { locale } = await ctx.params;

  // Hanya terima rujukan satu-asal agar tidak jadi open redirect.
  const referer = request.headers.get("referer");
  let back = new URL("/", request.url);
  if (referer) {
    try {
      const r = new URL(referer);
      if (r.origin === back.origin) back = r;
    } catch {}
  }

  const res = NextResponse.redirect(back);
  if (isLocale(locale)) {
    res.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }
  return res;
}
