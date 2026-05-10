import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "demo_uid";

function makeId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const existing = request.cookies.get(COOKIE_NAME)?.value;
  if (!existing) {
    res.cookies.set(COOKIE_NAME, makeId(), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return res;
}
