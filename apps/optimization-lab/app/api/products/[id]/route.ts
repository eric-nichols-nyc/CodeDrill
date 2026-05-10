import { NextResponse } from "next/server";
import { getProductById } from "@/app/lib/mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await delay(150); // Simulate network delay

  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({
    product,
    timestamp: new Date().toISOString(),
  });
}
