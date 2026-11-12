import { NextResponse } from "next/server";

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type ApiEnvelope<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export interface ListPayload<T> {
  items: T[];
  meta: PaginationMeta;
}

export function okItem<T>(data: T, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}

export function okList<T>(
  items: T[],
  total: number,
  page: number,
  pageSize: number,
) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  return NextResponse.json({
    ok: true,
    data: {
      items,
      meta: { total, page, pageSize, totalPages },
    },
  });
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export function parsePagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const pageSize = Math.min(
    100,
    Math.max(1, Number.parseInt(searchParams.get("pageSize") || "20", 10) || 20),
  );
  const q = (searchParams.get("q") || "").trim();
  const offset = (page - 1) * pageSize;
  return { page, pageSize, offset, q };
}

