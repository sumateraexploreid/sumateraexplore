import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getSessionSecret } from "@/lib/auth";

const CSRF_COOKIE = "se_csrf_token";
const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function getCsrfToken(): Promise<string> {
  const cookieStore = await cookies();
  let token = cookieStore.get(CSRF_COOKIE)?.value;
  if (!token) {
    token = generateCsrfToken();
    const secret = getSessionSecret();
    const isHttps = process.env.NODE_ENV === "production";
    cookieStore.set(CSRF_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: isHttps,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }
  return token;
}

export async function validateCsrfToken(
  req: Request,
): Promise<{ ok: boolean; error?: string }> {
  const cookieStore = await cookies();
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get(CSRF_HEADER);

  if (!cookieToken || !headerToken) {
    return { ok: false, error: "CSRF token tidak ditemukan." };
  }

  if (!crypto.timingSafeEqual(Buffer.from(cookieToken), Buffer.from(headerToken))) {
    return { ok: false, error: "CSRF token tidak valid." };
  }

  return { ok: true };
}

export async function requireCsrf(req: Request): Promise<{ ok: boolean; error?: string }> {
  const method = req.method.toUpperCase();
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { ok: true };
  }
  return validateCsrfToken(req);
}

export function getCsrfHeaderName(): string {
  return CSRF_HEADER;
}