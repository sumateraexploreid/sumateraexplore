import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { dbQuery } from "@/lib/db";
import {
  ADMIN_SESSION_COOKIE,
  type AdminRole,
  signSessionToken,
  verifySessionTokenEdge,
} from "@/lib/auth-edge";

export { ADMIN_SESSION_COOKIE, type AdminRole };

export interface AdminUserRecord {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
}

const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 hari

export function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("ADMIN_SESSION_SECRET must be set (min 16 chars).");
  }
  return secret;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;
  const [, salt, hex] = parts;
  if (!salt || !hex) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hex, "hex");
  if (derived.length !== expected.length) return false;
  return crypto.timingSafeEqual(derived, expected);
}

export async function createSessionCookieValue(user: {
  id: number;
  email: string;
  role: AdminRole;
}): Promise<string> {
  return signSessionToken(
    {
      uid: user.id,
      email: user.email,
      role: user.role,
      exp: Date.now() + SESSION_TTL_MS,
    },
    getSessionSecret(),
  );
}

/** Cookie options matching current scheme (HTTP on localhost vs HTTPS in production). */
export function getSessionCookieOptions(
  req: { nextUrl: { protocol: string }; headers: { get(name: string): string | null } },
  maxAge = 60 * 60 * 24 * 7,
) {
  const isHttps =
    req.nextUrl.protocol === "https:" ||
    req.headers.get("x-forwarded-proto") === "https";
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isHttps,
    path: "/",
    maxAge,
  };
}

export async function getAdminSession(): Promise<AdminUserRecord | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
    const payload = await verifySessionTokenEdge(token, getSessionSecret());
    if (!payload) return null;

    const { rows } = await dbQuery<AdminUserRecord>(
      `SELECT id, email, name, role, is_active, last_login_at
       FROM admin_users
       WHERE id = $1 AND email = $2 AND is_active = TRUE
       LIMIT 1`,
      [payload.uid, payload.email],
    );
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function requireAdminSession(
  allowedRoles?: AdminRole[],
): Promise<
  | { ok: true; user: AdminUserRecord }
  | { ok: false; status: 401 | 403; error: string }
> {
  const user = await getAdminSession();
  if (!user) {
    return { ok: false, status: 401, error: "Sesi admin tidak valid atau telah berakhir." };
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      ok: false,
      status: 403,
      error: `Peran '${user.role}' tidak memiliki izin untuk aksi ini.`,
    };
  }
  return { ok: true, user };
}

export async function recordAuditLog(params: {
  adminEmail: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "SETTINGS";
  entityType: string;
  entityId: string | number;
  summary: string;
}) {
  try {
    await dbQuery(
      `INSERT INTO audit_logs (admin_email, action, entity_type, entity_id, summary)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        params.adminEmail,
        params.action,
        params.entityType,
        String(params.entityId),
        params.summary,
      ],
    );
  } catch {
    // Jangan gagalkan operasi utama hanya karena log gagal ditulis.
  }
}

