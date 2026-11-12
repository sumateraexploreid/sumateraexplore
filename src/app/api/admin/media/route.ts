import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";
import { dbQuery } from "@/lib/db";
import { okItem, fail } from "@/lib/admin-api";
import { recordAuditLog, requireAdminSession } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/webp",
  "image/jpeg",
  "image/png",
  "image/avif",
]);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

function scanStaticAssets() {
  const dirs = ["sumut", "legal", "partners"];
  const results: Array<{
    id: string;
    url: string;
    filename: string;
    folder: string;
    source: "static";
  }> = [];

  for (const dir of dirs) {
    const absDir = path.join(process.cwd(), "public", "images", dir);
    if (!fs.existsSync(absDir)) continue;
    const files = fs.readdirSync(absDir).sort();
    for (const file of files) {
      if (!/\.(webp|png|jpg|jpeg|avif)$/i.test(file)) continue;
      results.push({
        id: `static-${dir}-${file}`,
        url: `/images/${dir}/${file}`,
        filename: file,
        folder: dir,
        source: "static",
      });
    }
  }
  return results;
}

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const { rows } = await dbQuery<{
      id: number;
      filename: string;
      mime_type: string;
      byte_size: number;
      alt_text: string;
      folder: string;
      created_at: string;
    }>(`
      SELECT id, filename, mime_type, byte_size, alt_text, folder, created_at
      FROM media_assets
      ORDER BY created_at DESC, id DESC
    `);

    const uploaded = rows.map((r) => ({
      id: `upload-${r.id}`,
      dbId: r.id,
      url: `/api/media/${r.id}`,
      filename: r.filename,
      mimeType: r.mime_type,
      byteSize: r.byte_size,
      altText: r.alt_text,
      folder: r.folder,
      source: "uploaded" as const,
      createdAt: r.created_at,
    }));

    return okItem({
      uploaded,
      staticAssets: scanStaticAssets(),
    });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal memuat daftar media.",
      500,
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin", "editor"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const altText = String(formData.get("altText") || "").trim();
    const folder = String(formData.get("folder") || "gallery").trim();

    if (!(file instanceof File)) {
      return fail("Pilih file gambar untuk diunggah.", 400);
    }
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return fail(
        "Format gambar harus WebP, JPG, PNG, atau AVIF.",
        400,
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return fail("Ukuran file maksimal 5 MB.", 400);
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const dataBase64 = buf.toString("base64");
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);

    const { rows } = await dbQuery<{
      id: number;
      filename: string;
      mime_type: string;
      byte_size: number;
      alt_text: string;
      folder: string;
      created_at: string;
    }>(
      `INSERT INTO media_assets (filename, mime_type, byte_size, data_base64, alt_text, folder)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, filename, mime_type, byte_size, alt_text, folder, created_at`,
      [safeName, file.type, file.size, dataBase64, altText || safeName, folder],
    );

    const asset = rows[0];
    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "CREATE",
      entityType: "media_asset",
      entityId: asset.id,
      summary: `Upload gambar baru: ${asset.filename} (${Math.round(asset.byte_size / 1024)} KB)`,
    });

    return okItem(
      {
        id: `upload-${asset.id}`,
        dbId: asset.id,
        url: `/api/media/${asset.id}`,
        filename: asset.filename,
        mimeType: asset.mime_type,
        byteSize: asset.byte_size,
        altText: asset.alt_text,
        folder: asset.folder,
        source: "uploaded" as const,
      },
      201,
    );
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal mengunggah gambar.",
      500,
    );
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminSession(["super_admin"]);
  if (!auth.ok) return fail(auth.error, auth.status);

  try {
    const dbId = Number(new URL(req.url).searchParams.get("id"));
    if (!dbId) return fail("ID media tidak valid.", 400);

    const { rowCount } = await dbQuery(
      `DELETE FROM media_assets WHERE id = $1`,
      [dbId],
    );
    if (!rowCount) return fail("Asset tidak ditemukan.", 404);

    await recordAuditLog({
      adminEmail: auth.user.email,
      action: "DELETE",
      entityType: "media_asset",
      entityId: dbId,
      summary: `Hapus media asset #${dbId}`,
    });

    return okItem({ deletedId: dbId });
  } catch (err) {
    return fail(
      err instanceof Error ? err.message : "Gagal menghapus asset.",
      500,
    );
  }
}

