export type SlugDirection = "prev" | "next";

/**
 * Rotates through `slugs` with wrap-around. Returns null when the catalog is empty.
 */
export function getAdjacentSlug(
  slugs: readonly string[],
  currentSlug: string,
  direction: SlugDirection
): string | null {
  if (slugs.length === 0) {
    return null;
  }
  if (slugs.length === 1) {
    return slugs[0] ?? null;
  }

  const index = slugs.indexOf(currentSlug);
  if (index === -1) {
    return direction === "next" ? (slugs[0] ?? null) : (slugs.at(-1) ?? null);
  }

  const delta = direction === "next" ? 1 : -1;
  const nextIndex = (index + delta + slugs.length) % slugs.length;
  return slugs[nextIndex] ?? null;
}

export function getRandomSlug(
  slugs: readonly string[],
  currentSlug: string
): string | null {
  if (slugs.length === 0) {
    return null;
  }
  if (slugs.length === 1) {
    return slugs[0] ?? null;
  }

  const others = slugs.filter((s) => s !== currentSlug);
  const pool = others.length > 0 ? others : [...slugs];
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? null;
}
