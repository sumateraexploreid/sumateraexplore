import { NextRequest, NextResponse } from "next/server";
import { dbQuery } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  const numericId = Number.parseInt(id, 10);
  if (!Number.isFinite(numericId) || numericId <= 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { rows } = await dbQuery<{
      mime_type: string;
      data_base64: string;
      filename: string;
    }>(
      `SELECT mime_type, data_base64, filename FROM media_assets WHERE id = $1 LIMIT 1`,
      [numericId],
    );

    const row = rows[0];
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const bytes = Buffer.from(row.data_base64, "base64");
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": row.mime_type,
        "Content-Disposition": `inline; filename="${row.filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Error loading media" }, { status: 500 });
  }
}
