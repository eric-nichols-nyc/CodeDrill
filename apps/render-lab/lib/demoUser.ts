import { cookies } from "next/headers";

const COOKIE_NAME = "demo_uid";

function makeId() {
  return `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

/**
 * Returns the demo user id from the cookie. The cookie is set by middleware
 * when missing, so we only read here (cookie mutation is not allowed in RSC).
 */
export async function getOrCreateDemoUserId(): Promise<string> {
  const store = await cookies();

  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = makeId();

  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  // Fallback if cookie not yet set (e.g. edge case); do not set in RSC.
  return id;
}
