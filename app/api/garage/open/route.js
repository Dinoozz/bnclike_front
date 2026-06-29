import { NextResponse } from "next/server";

import { GarageApiError, runGarageAction } from "@/lib/garage-api";

export async function POST() {
  try {
    const result = await runGarageAction("open");

    return NextResponse.json({
      ok: true,
      data: result.payload,
    });
  } catch (error) {
    const status = error instanceof GarageApiError ? error.statusCode : 502;

    return NextResponse.json(
      {
        ok: false,
        error: error.message || "Impossible d'envoyer la commande d'ouverture.",
      },
      { status },
    );
  }
}
