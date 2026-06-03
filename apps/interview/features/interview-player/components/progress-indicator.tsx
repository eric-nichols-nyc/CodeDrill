type ProgressIndicatorProps = {
  interviewTitle: string;
  jobSubtitle?: string;
  currentOrder: number;
  questionCount: number;
};

export function ProgressIndicator({
  interviewTitle,
  jobSubtitle,
  currentOrder,
  questionCount,
}: ProgressIndicatorProps) {
  const progress = (currentOrder / questionCount) * 100;

  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 px-4 py-3 backdrop-blur">
      <div className="mx-auto max-w-2xl space-y-2">
        <div>
          <p className="truncate font-medium text-foreground text-sm">
            {interviewTitle}
          </p>
          {jobSubtitle ? (
            <p className="truncate text-muted-foreground text-xs">{jobSubtitle}</p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="whitespace-nowrap font-medium text-muted-foreground text-xs">
            Question {currentOrder} of {questionCount}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="whitespace-nowrap font-semibold text-primary text-xs">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </header>
  );
}
