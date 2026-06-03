import { Button } from "@repo/design-system/components/ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

type FeedbackPlaceholderProps = {
  onNext: () => void;
  isLastQuestion: boolean;
};

export function FeedbackPlaceholder({
  onNext,
  isLastQuestion,
}: FeedbackPlaceholderProps) {
  return (
    <div className="w-full rounded-2xl border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <CheckCircle2 className="size-5 text-emerald-600" />
        <h2 className="font-semibold text-foreground text-lg">Answer saved</h2>
      </div>
      <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
        Your response was saved. Detailed AI feedback and scoring will appear
        here after the evaluation system ships.
      </p>
      <Button className="rounded-2xl" onClick={onNext} type="button">
        {isLastQuestion ? "Finish interview" : "Next question"}
        <ChevronRight className="ml-1 size-4" />
      </Button>
    </div>
  );
}
