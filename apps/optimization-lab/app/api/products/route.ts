import { NextResponse } from "next/server";
import { mockProducts, searchProducts } from "@/app/lib/mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request) {
  await delay(200); // Simulate network delay

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");

  let products = mockProducts;

  // Search functionality
  if (query) {
    products = searchProducts(query);
  }

  // Filter by category
  if (category) {
    products = products.filter((p) => p.categorySlug === category);
  }

  return NextResponse.json({
    products,
    count: products.length,
    timestamp: new Date().toISOString(),
  });
}
