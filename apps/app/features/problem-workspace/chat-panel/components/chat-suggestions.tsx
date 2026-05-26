"use client";

import { Suggestion } from "@repo/design-system/components/ai-elements/suggestion";
import { cn } from "@repo/design-system/lib/utils";
import { useCallback } from "react";

export type ChatSuggestionsProps = {
  suggestions: readonly string[];
  onSuggestionClick: (text: string) => void;
  disabled?: boolean;
};

const suggestionClassName = cn(
  "border-orange-500 bg-orange-500/10 text-orange-700",
  "hover:bg-orange-500/20 hover:text-orange-800",
  "dark:border-orange-400 dark:bg-orange-500/15 dark:text-orange-300",
  "dark:hover:bg-orange-500/25 dark:hover:text-orange-200"
);

function SuggestionItem({
  suggestion,
  onClick,
  disabled,
}: {
  suggestion: string;
  onClick: (text: string) => void;
  disabled?: boolean;
}) {
  const handleClick = useCallback(() => {
    onClick(suggestion);
  }, [onClick, suggestion]);

  return (
    <Suggestion
      className={suggestionClassName}
      disabled={disabled}
      onClick={handleClick}
      suggestion={suggestion}
    />
  );
}

export function ChatSuggestions({
  suggestions,
  onSuggestionClick,
  disabled = false,
}: ChatSuggestionsProps) {
  return (
    <nav aria-label="Suggested prompts" className="mx-2 mb-2 shrink-0">
      <div className="flex flex-wrap items-center gap-2">
        {suggestions.map((suggestion) => (
          <SuggestionItem
            disabled={disabled}
            key={suggestion}
            onClick={onSuggestionClick}
            suggestion={suggestion}
          />
        ))}
      </div>
    </nav>
  );
}
