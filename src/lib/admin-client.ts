"use client";

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ListResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export async function adminFetch<T>(
  url: string,
  init?: RequestInit,
): Promise<T> {
  const headers = new Headers(init?.headers || {});
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    headers,
    credentials: "same-origin",
  });

  if (res.status === 401 && typeof window !== "undefined") {
    if (!window.location.pathname.startsWith("/admin/login")) {
      window.location.href = `/admin/login?next=${encodeURIComponent(window.location.pathname)}`;
    }
    throw new Error("Sesi admin berakhir. Silakan login kembali.");
  }

  const json = (await res.json()) as {
    ok: boolean;
    data?: T;
    error?: string;
  };

  if (!res.ok || !json.ok || json.data === undefined) {
    throw new Error(json.error || `Gagal memproses permintaan (${res.status}).`);
  }

  return json.data;
}

