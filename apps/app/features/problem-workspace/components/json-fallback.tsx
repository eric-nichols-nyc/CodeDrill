export function JsonFallback({ data }: { data: unknown }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-muted p-3 text-xs">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
