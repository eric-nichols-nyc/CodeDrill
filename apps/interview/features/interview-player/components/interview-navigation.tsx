import { Button } from "@repo/design-system/components/ui/button";
import { ChevronLeft, Loader2, Send } from "lucide-react";

type InterviewNavigationProps = {
  canGoPrevious: boolean;
  showSubmit: boolean;
  submitDisabled: boolean;
  isSubmitting: boolean;
  onPrevious: () => void;
  onSubmit: () => void;
};

export function InterviewNavigation({
  canGoPrevious,
  showSubmit,
  submitDisabled,
  isSubmitting,
  onPrevious,
  onSubmit,
}: InterviewNavigationProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        disabled={!canGoPrevious || isSubmitting}
        onClick={onPrevious}
        type="button"
        variant="outline"
      >
        <ChevronLeft className="mr-1 size-4" />
        Previous
      </Button>

      {showSubmit ? (
        <Button
          className="rounded-2xl"
          disabled={submitDisabled || isSubmitting}
          onClick={onSubmit}
          type="button"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Submitting…
            </>
          ) : (
            <>
              <Send className="mr-2 size-4" />
              Submit answer
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
}
