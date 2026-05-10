import { NextResponse } from "next/server";
import { getProductById } from "@/app/lib/mock-data";

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock cart data (in a real app, this would be user-specific from a database)
export async function GET() {
  await delay(200); // Simulate network delay

  // Mock cart with a couple items
  const product1 = getProductById("1");
  const product2 = getProductById("3");

  const items = [
    {
      id: "1",
      name: product1?.name || "Product 1",
      image: product1?.image || "",
      price: product1?.price || 0,
      quantity: 1,
    },
    {
      id: "3",
      name: product2?.name || "Product 3",
      image: product2?.image || "",
      price: product2?.price || 0,
      quantity: 2,
    },
  ];

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return NextResponse.json({
    items,
    total,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    timestamp: new Date().toISOString(),
  });
}
