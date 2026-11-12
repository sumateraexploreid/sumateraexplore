import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, okList, fail, parsePagination } from "@/lib/admin-api";
import { hashPassword, recordAuditLog, requireAdminSession } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  const { page, pageSize, offset, q } = parsePagination(req.nextUrl.searchParams);
  const params: unknown[] = [];
  const where = q
    ? (() => {
        params.push(`%${q.toLowerCase()}%`);
        return `WHERE LOWER(name) LIKE $1 OR LOWER(email) LIKE $1`;
      })()
    : "";

  const countRes = await dbQuery<{ total: number }>(
    `SELECT COUNT(*)::int AS total FROM admin_users ${where}`,
    params,
  );
  params.push(pageSize, offset);

  const { rows } = await dbQuery(
    `SELECT id, email, name, role, is_active, last_login_at, created_at
     FROM admin_users
     ${where}
     ORDER BY id ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return okList(rows, countRes.rows[0]?.total || 0, page, pageSize);
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const name = String(body.name || "").trim();
    const password = String(body.password || "");
    const role = String(body.role || "cs_operator");

    if (!email || !name || password.length < 8) {
      return fail("Email, nama, dan password minimal 8 karakter wajib diisi.", 400);
    }
    if (!["super_admin", "editor", "cs_operator"].includes(role)) {
      return fail("Role admin tidak valid.", 400);
    }

    const { rows } = await dbQuery(
      `INSERT INTO admin_users (email, name, role, password_hash, is_active)
       VALUES ($1, $2, $3, $4, TRUE)
       RETURNING id, email, name, role, is_active, last_login_at, created_at`,
      [email, name, role, hashPassword(password)],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "admin_user",
      entityId: rows[0].id,
      summary: `Tambah operator admin: ${rows[0].email} (${rows[0].role})`,
    });

    return okItem(rows[0], 201);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Gagal menambah operator.";
    if (msg.includes("duplicate key")) {
      return fail("Email admin sudah terdaftar.", 409);
    }
    return fail(msg, 500);
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) return fail("ID user tidak valid.", 400);

    const { rows: curRows } = await dbQuery(
      `SELECT id, email, name, role, is_active FROM admin_users WHERE id = $1 LIMIT 1`,
      [id],
    );
    const cur = curRows[0];
    if (!cur) return fail("User tidak ditemukan.", 404);

    if (id === auth.user.id && body.is_active === false) {
      return fail("Anda tidak dapat menonaktifkan akun yang sedang digunakan.", 400);
    }

    if (body.password && String(body.password).length >= 8) {
      await dbQuery(`UPDATE admin_users SET password_hash = $2 WHERE id = $1`, [
        id,
        hashPassword(String(body.password)),
      ]);
    }

    const { rows } = await dbQuery(
      `UPDATE admin_users SET
        name = $2,
        role = $3,
        is_active = $4
       WHERE id = $1
       RETURNING id, email, name, role, is_active, last_login_at, created_at`,
      [
        id,
        body.name ?? cur.name,
        body.role ?? cur.role,
        body.is_active !== undefined ? Boolean(body.is_active) : cur.is_active,
      ],
    );

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "UPDATE",
      entityType: "admin_user",
      entityId: id,
      summary: `Update akun ${rows[0].email}: role=${rows[0].role}, active=${rows[0].is_active}`,
    });

    return okItem(rows[0]);
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memperbarui operator.",
      500,
    );
  }
}

