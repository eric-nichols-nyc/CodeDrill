import { NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET() {
  await delay(500);

  const users = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User" },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "User",
    },
    {
      id: 4,
      name: "Diana Prince",
      email: "diana@example.com",
      role: "Moderator",
    },
    { id: 5, name: "Eve Wilson", email: "eve@example.com", role: "User" },
  ];

  return NextResponse.json({
    users,
    timestamp: new Date().toISOString(),
  });
}
