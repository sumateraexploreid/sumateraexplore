import { NextRequest, NextResponse } from "next/server";
import { fetchLatestRates } from "@/lib/currency-cron";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const result = await fetchLatestRates();

  if (result.ok) {
    return NextResponse.json({ message: "Currency rates updated successfully", data: result.data });
  } else {
    return NextResponse.json({ message: "Failed to update currency rates", error: result.error }, { status: 500 });
  }
}
