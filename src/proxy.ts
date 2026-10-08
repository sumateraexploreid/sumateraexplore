import type { NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

// Next 16: konvensi "middleware" diganti nama menjadi "proxy".
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    // Lewati aset statis dan berkas gambar.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2|json|txt|js)$).*)",
  ],
};
