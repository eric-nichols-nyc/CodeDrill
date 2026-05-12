export function ProblemOutputPanel() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4 pl-3">
      <h2 className="shrink-0 font-medium text-muted-foreground text-sm">
        Output
      </h2>
      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border border-dashed bg-muted/20 p-3">
        <p className="text-muted-foreground text-sm">
          Run results and logs will show here.
        </p>
      </div>
    </div>
  );
}
