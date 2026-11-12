import type { NextRequest } from "next/server";
import { okItem } from "@/lib/admin-api";
import { getSessionCookieOptions } from "@/lib/auth";
import { ADMIN_SESSION_COOKIE } from "@/lib/auth-edge";

export async function POST(req: NextRequest) {
  const response = okItem({ loggedOut: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    getSessionCookieOptions(req, 0),
  );
  return response;
}

