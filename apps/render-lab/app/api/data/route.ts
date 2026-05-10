import { NextResponse } from "next/server";

export async function GET() {
  // Simulate some processing time
  await new Promise((resolve) => setTimeout(resolve, 500));

  const data = {
    message: "Hello from the API!",
    timestamp: new Date().toISOString(),
    randomNumber: Math.floor(Math.random() * 1000),
  };

  return NextResponse.json(data);
}
