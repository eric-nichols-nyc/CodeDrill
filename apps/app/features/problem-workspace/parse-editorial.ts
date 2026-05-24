import type { ProblemEditorial } from "@/features/problem-detail/problem-detail-types";

const YOUTUBE_WATCH_RE =
  /^https?:\/\/(?:www\.)?youtube\.com\/watch\?(?:[^&\s]+&)*v=([a-zA-Z0-9_-]{6,})/i;
const YOUTUBE_SHORT_RE =
  /^https?:\/\/(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{6,})/i;

function legacyStringEditorial(s: string): ProblemEditorial {
  const trimmed = s.trim();
  if (!trimmed) {
    return { content: "", embeds: [] };
  }
  const watch = trimmed.match(YOUTUBE_WATCH_RE);
  if (watch) {
    return { content: "", embeds: [{ type: "youtube", videoId: watch[1] }] };
  }
  const short = trimmed.match(YOUTUBE_SHORT_RE);
  if (short) {
    return { content: "", embeds: [{ type: "youtube", videoId: short[1] }] };
  }
  if (/^https?:\/\/\S+$/i.test(trimmed)) {
    return {
      content: `<p><a href="${trimmed}" rel="noopener noreferrer" target="_blank">Open link</a></p>`,
      embeds: [],
    };
  }
  return { content: trimmed, embeds: [] };
}

/** Normalizes API / DB JSON (and legacy string URLs) into a ProblemEditorial. */
export function parseProblemEditorial(raw: unknown): ProblemEditorial {
  if (raw === null || raw === undefined) {
    return { content: "", embeds: [] };
  }
  if (typeof raw === "string") {
    const s = raw.trim();
    if (
      (s.startsWith("{") && s.endsWith("}")) ||
      (s.startsWith("[") && s.endsWith("]"))
    ) {
      try {
        return parseProblemEditorial(JSON.parse(raw) as unknown);
      } catch {
        /* fall through to legacy string handling */
      }
    }
    return legacyStringEditorial(raw);
  }
  if (typeof raw !== "object") {
    return { content: "", embeds: [] };
  }
  const o = raw as Record<string, unknown>;
  const title = typeof o.title === "string" ? o.title : undefined;
  const content = typeof o.content === "string" ? o.content : "";
  const embedsRaw = Array.isArray(o.embeds) ? o.embeds : [];
  const embeds = embedsRaw.flatMap((item): ProblemEditorial["embeds"] => {
    if (!item || typeof item !== "object") {
      return [];
    }
    const e = item as Record<string, unknown>;
    if (e.type !== "youtube") {
      return [];
    }
    const videoId = typeof e.videoId === "string" ? e.videoId.trim() : "";
    if (!videoId) {
      return [];
    }
    return [{ type: "youtube", videoId }];
  });
  return {
    ...(title !== undefined && title.length > 0 ? { title } : {}),
    content,
    embeds,
  };
}

export function isProblemEditorialEmpty(e: ProblemEditorial): boolean {
  return (
    !e.title?.trim() &&
    !e.content.trim() &&
    e.embeds.length === 0
  );
}
