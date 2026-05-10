"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Flashcard } from "./flashcard";

/** Shape for a single flashcard. Use this type when importing from JSON. */
export type FlashcardItem = {
  /** Unique id (optional; index is used if omitted) */
  id?: string;
  /** Content shown on the front of the card */
  front: string;
  /** Content shown on the back of the card */
  back: string;
};

/** JSON data file shape: array of flashcards */
export type FlashcardsData = FlashcardItem[];

export type FlashcardsProps = {
  /** Array of flashcard items (e.g. from a JSON file) */
  cards: FlashcardsData;
  /** Optional class name for the container */
  className?: string;
  /** Optional title above the deck */
  title?: string;
};

function Flashcards({ cards, className, title }: FlashcardsProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = cards[index];
  const hasPrev = index > 0;
  const hasNext = index < cards.length - 1;

  const goPrev = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, i + 1));
  }, [cards.length]);

  const flip = useCallback(() => setFlipped((f) => !f), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (hasPrev) {
          goPrev();
        }
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (hasNext) {
          goNext();
        }
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        flip();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasPrev, hasNext, goPrev, goNext, flip]);

  if (!cards.length) {
    return (
      <Card className={cn("mx-auto w-full max-w-lg", className)}>
        <CardContent className="py-12 text-center text-muted-foreground">
          No flashcards. Add items to your data file.
        </CardContent>
      </Card>
    );
  }

  return (
    <section
      aria-label="Flashcards"
      className={cn("mx-auto w-full max-w-xl space-y-4", className)}
    >
      {title ? (
        <h2 className="text-center font-semibold text-lg">{title}</h2>
      ) : null}
      <Flashcard
        back={current.back}
        flipped={flipped}
        front={current.front}
        onFlip={flip}
      />
      <CardFooter className="flex items-center justify-between gap-2 pt-0">
        <Button
          aria-label="Previous card"
          disabled={!hasPrev}
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
          size="icon"
          variant="outline"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-muted-foreground text-sm tabular-nums">
          {index + 1} / {cards.length}
        </span>
        <div className="flex gap-1">
          <Button
            aria-label={flipped ? "Show front" : "Show back"}
            onClick={(e) => {
              e.stopPropagation();
              flip();
            }}
            size="sm"
            variant="ghost"
          >
            <RotateCcw className="mr-1 size-4" />
            Flip
          </Button>
          <Button
            aria-label="Next card"
            disabled={!hasNext}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            size="icon"
            variant="outline"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardFooter>
    </section>
  );
}

export { Flashcards };
