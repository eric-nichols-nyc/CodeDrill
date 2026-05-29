/**
 * [S] Renders the accumulated spiral result as chips.
 * [I] Receives number[] only.
 */
export function ResultArray({ result }: { result: number[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {result.map((value, index) => (
        <div
          className="rounded-md bg-primary px-3 py-2 font-semibold text-primary-foreground text-sm"
          key={`result-${String(index)}-${value}`}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
