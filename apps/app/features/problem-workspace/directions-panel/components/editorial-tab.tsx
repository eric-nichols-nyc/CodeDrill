import type { ProblemEditorial } from "../lib/problem-detail-types";

function YoutubeEmbed({ videoId }: { videoId: string }) {
  const src = `https://www.youtube.com/embed/${encodeURIComponent(videoId)}`;
  return (
    <div className="aspect-video w-full max-w-2xl overflow-hidden rounded-md border border-border">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
        src={src}
        title="YouTube video player"
      />
    </div>
  );
}

function EditorialPanel({ editorial }: { editorial: ProblemEditorial }) {
  return (
    <div className="w-full min-w-0 max-w-full space-y-6 pb-4">
      {editorial.title?.trim() ? (
        <h2 className="wrap-break-word break-normal font-semibold text-foreground text-lg tracking-tight">
          {editorial.title}
        </h2>
      ) : null}
      {editorial.content.trim() ? (
        <div
          className="prose prose-sm wrap-break-word w-full min-w-0 max-w-none text-pretty break-normal [&_a]:text-primary [&_blockquote]:whitespace-normal [&_h1]:whitespace-normal [&_h2]:whitespace-normal [&_h3]:whitespace-normal [&_img]:max-w-full [&_li]:whitespace-normal [&_ol]:whitespace-normal [&_p]:whitespace-normal [&_p]:text-foreground [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre [&_ul]:whitespace-normal"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: admin-authored editorial HTML (Quill)
          dangerouslySetInnerHTML={{ __html: editorial.content }}
        />
      ) : null}
      {editorial.embeds.length > 0 ? (
        <div className="flex flex-col gap-4">
          {editorial.embeds.map((embed, index) => (
            <YoutubeEmbed
              key={`${embed.videoId}-${String(index)}`}
              videoId={embed.videoId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function EditorialTab({
  editorial,
}: {
  editorial: ProblemEditorial | null;
}) {
  if (!editorial) {
    return (
      <p className="text-muted-foreground text-sm">
        No editorial has been added for this problem yet.
      </p>
    );
  }

  return <EditorialPanel editorial={editorial} />;
}
