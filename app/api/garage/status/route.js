import { NextResponse } from "next/server";

import { getGarageStatus } from "@/lib/garage-api";

export async function GET() {
  const status = await getGarageStatus();

  return NextResponse.json(
    {
      status: status.available ? "connected" : "disconnected",
      available: status.available,
      data: status.payload,
      error: status.error,
    },
    {
      status: status.available ? 200 : 503,
    },
  );
}
