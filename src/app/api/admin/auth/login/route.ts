import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import {
  ADMIN_SESSION_COOKIE,
  type AdminRole,
  createSessionCookieValue,
  getSessionCookieOptions,
  hashPassword,
  recordAuditLog,
  verifyPassword,
} from "@/lib/auth";
import { ensureDefaultContentSeeded } from "@/lib/seed";
import { adminLoginRateLimiter } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = adminLoginRateLimiter(req);
  if (!rateLimit.allowed) {
    return fail(
      `Terlalu banyak percobaan login. Coba lagi dalam ${rateLimit.retryAfter} detik.`,
      429,
    );
  }

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

    let user = rows[0];

    // Bootstrap or sync super admin account if logging in with the authoritative default credentials
    const defaultEmail = (
      process.env.ADMIN_DEFAULT_EMAIL || "admin@sumateraexplore.my.id"
    )
      .trim()
      .toLowerCase();
    const defaultPassword =
      process.env.ADMIN_DEFAULT_PASSWORD || "SumateraToba#2026";

    if (email === defaultEmail && password === defaultPassword) {
      if (!user) {
        const hash = hashPassword(defaultPassword);
        const ins = await dbQuery<{
          id: number;
          email: string;
          name: string;
          role: AdminRole;
          password_hash: string;
          is_active: boolean;
        }>(
          `INSERT INTO admin_users (email, name, role, password_hash, is_active)
           VALUES ($1, $2, 'super_admin', $3, TRUE)
           ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_active = TRUE
           RETURNING id, email, name, role, password_hash, is_active`,
          [defaultEmail, "Suja'i (Owner & Admin)", hash],
        );
        user = ins.rows[0];
        // Asynchronously seed default packages, blogs, settings if empty
        ensureDefaultContentSeeded().catch((err) => {
          console.error("Auto-seed error:", err);
        });
      } else if (!verifyPassword(password, user.password_hash)) {
        const hash = hashPassword(defaultPassword);
        await dbQuery(
          `UPDATE admin_users SET password_hash = $2, is_active = TRUE WHERE id = $1`,
          [user.id, hash],
        );
        user.password_hash = hash;
      }
    }

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

