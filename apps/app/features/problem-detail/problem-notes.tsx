import { JsonFallback } from "@/features/problem-detail/json-fallback";

export function ProblemNotes({ learningNotes }: { learningNotes?: unknown }) {
  return (
    <div className="space-y-6 p-1">
      <section className="space-y-2">
        <h2 className="font-medium text-muted-foreground text-sm">
          Learning notes
        </h2>
        <JsonFallback data={learningNotes ?? null} />
      </section>
    </div>
  );
}
