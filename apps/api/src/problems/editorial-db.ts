import type { ProblemEditorialDto } from "./dto/create-problem.dto";

export type EditorialDbValue = {
  title?: string;
  content: string;
  embeds: { type: "youtube"; videoId: string }[];
};

export function editorialDtoToDb(
  dto: ProblemEditorialDto | undefined
): EditorialDbValue | null {
  if (!dto) {
    return null;
  }
  const titleRaw = dto.title?.trim();
  const title = titleRaw && titleRaw.length > 0 ? titleRaw : undefined;
  const content = dto.content ?? "";
  const embeds = (dto.embeds ?? [])
    .filter((e) => e?.type === "youtube" && e.videoId?.trim())
    .map((e) => ({ type: "youtube" as const, videoId: e.videoId.trim() }));
  const hasTitle = Boolean(title);
  const hasContent = content.trim().length > 0;
  if (!hasTitle && !hasContent && embeds.length === 0) {
    return null;
  }
  return {
    ...(title ? { title } : {}),
    content,
    embeds,
  };
}

/** Persist as `text`: JSON object or omit when empty. */
export function editorialDtoToDbText(
  dto: ProblemEditorialDto | undefined
): string | null {
  const value = editorialDtoToDb(dto);
  return value ? JSON.stringify(value) : null;
}
