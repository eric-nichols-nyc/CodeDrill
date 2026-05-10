import { NextResponse } from "next/server";

/**
 * Returns a list of item IDs only.
 * Fast — use this to simulate "get list, then fetch each item" (waterfall).
 */
export async function GET() {
  const ids = [1, 2, 3, 4, 5];
  return NextResponse.json({ ids });
}
