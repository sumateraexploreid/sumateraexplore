import { okItem, fail } from "@/lib/admin-api";
import { requireAdminSession } from "@/lib/auth";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.ok) return fail(auth.error, auth.status);
  return okItem({ user: auth.user });
}

