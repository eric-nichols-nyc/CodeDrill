import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const ITEMS: Record<number, { id: number; name: string; description: string }> =
  {
    1: { id: 1, name: "Item Alpha", description: "First item" },
    2: { id: 2, name: "Item Beta", description: "Second item" },
    3: { id: 3, name: "Item Gamma", description: "Third item" },
    4: { id: 4, name: "Item Delta", description: "Fourth item" },
    5: { id: 5, name: "Item Epsilon", description: "Fifth item" },
  };

/**
 * Simulates a slow per-item API (e.g. 600ms each).
 * In DevTools Network tab you'll see sequential requests (waterfall) vs parallel.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);
  if (Number.isNaN(numId) || !ITEMS[numId]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await delay(600); // Simulate slow backend/database
  return NextResponse.json(ITEMS[numId]);
}
