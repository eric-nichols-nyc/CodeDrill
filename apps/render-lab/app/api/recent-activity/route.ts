import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getRecentActivityServer } from "@/lib/recentActivity";

export async function GET() {
  const store = await cookies();
  const userId = store.get("demo_uid")?.value ?? "unknown-demo-user";
  const data = await getRecentActivityServer(userId);
  return NextResponse.json({ userId, data });
}