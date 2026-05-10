import { NextResponse } from "next/server";
import { getAllCategories } from "@/app/lib/mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(100); // Simulate network delay

  const categories = getAllCategories();

  return NextResponse.json({
    categories,
    timestamp: new Date().toISOString(),
  });
}
