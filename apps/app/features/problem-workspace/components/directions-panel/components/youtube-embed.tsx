export function YoutubeEmbed({ videoId }: { videoId: string }) {
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
