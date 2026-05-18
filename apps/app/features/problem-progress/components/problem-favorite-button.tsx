"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import { Star } from "lucide-react";
import { useCallback, type MouseEvent } from "react";
import { usePatchProblemProgressMutation } from "../hooks/use-patch-problem-progress-mutation";
import { useProblemProgressQuery } from "../hooks/use-problem-progress-query";

type ProblemFavoriteButtonProps = {
  problemId: string;
  className?: string;
};

/**
 * Toggle favorite for one problem. Pass `problemId` from the page or list row.
 * Wire into problems nav / problem header when the BFF route is live.
 */
export function ProblemFavoriteButton({
  problemId,
  className,
}: ProblemFavoriteButtonProps) {
  const { data, isPending: isLoading } = useProblemProgressQuery(problemId);
  const { mutate, isPending: isSaving } = usePatchProblemProgressMutation(
    problemId
  );

  const isFavorite = data?.isFavorite ?? false;
  const disabled = isLoading || isSaving;

  const stopLinkNavigation = useCallback((event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleToggleFavorite = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      stopLinkNavigation(event);
      mutate({ isFavorite: !isFavorite });
    },
    [isFavorite, mutate, stopLinkNavigation]
  );

  return (
    <Button
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      className={cn("size-8 shrink-0", className)}
      disabled={disabled}
      onClick={handleToggleFavorite}
      onPointerDown={stopLinkNavigation}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Star
        className={cn(
          "size-4",
          isFavorite
            ? "fill-yellow-400 text-yellow-500"
            : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
