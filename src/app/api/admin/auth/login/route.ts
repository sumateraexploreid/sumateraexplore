import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import {
  ADMIN_SESSION_COOKIE,
  type AdminRole,
  createSessionCookieValue,
  getSessionCookieOptions,
  recordAuditLog,
  verifyPassword,
} from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => null)) as {
      email?: string;
      password?: string;
    } | null;

    const email = (body?.email || "").trim().toLowerCase();
    const password = body?.password || "";

    if (!email || !password) {
      return fail("Email dan password wajib diisi.", 400);
    }

    const { rows } = await dbQuery<{
      id: number;
      email: string;
      name: string;
      role: AdminRole;
      password_hash: string;
      is_active: boolean;
    }>(
      `SELECT id, email, name, role, password_hash, is_active
       FROM admin_users
       WHERE LOWER(email) = $1
       LIMIT 1`,
      [email],
    );

    const user = rows[0];
    if (!user || !verifyPassword(password, user.password_hash)) {
      return fail("Email atau password salah.", 401);
    }
    if (!user.is_active) {
      return fail("Akun admin dinonaktifkan. Hubungi Super Admin.", 403);
    }

    await dbQuery(`UPDATE admin_users SET last_login_at = NOW() WHERE id = $1`, [
      user.id,
    ]);

    const token = await createSessionCookieValue({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await recordAuditLog({
      adminEmail: user.email,
      action: "LOGIN",
      entityType: "admin_user",
      entityId: user.id,
      summary: `${user.name} (${user.role}) masuk ke Admin Panel`,
    });

    const response = okItem({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set(
      ADMIN_SESSION_COOKIE,
      token,
      getSessionCookieOptions(req),
    );

    return response;
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memproses login.",
      500,
    );
  }
}

