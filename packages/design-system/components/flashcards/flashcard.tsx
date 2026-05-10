"use client";

import {
  Card,
  CardContent,
  CardHeader,
} from "@repo/design-system/components/ui/card";

export type FlashcardProps = {
  /** Content shown on the front of the card */
  front: string;
  /** Content shown on the back of the card */
  back: string;
  /** Whether the card is showing the back (flipped) */
  flipped: boolean;
  /** Called when the user requests a flip (click or keyboard) */
  onFlip: () => void;
};

function Flashcard({ front, back, flipped, onFlip }: FlashcardProps) {
  return (
    <Card
      className="cursor-pointer touch-manipulation select-none overflow-hidden"
      data-slot="flashcard"
      onClick={onFlip}
    >
      <div
        className="relative min-h-[180px] transition-transform duration-300"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <CardHeader className="pb-2">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Front
            </span>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <p className="text-lg">{front}</p>
          </CardContent>
        </div>
        <div
          className="absolute inset-0 flex flex-col bg-muted/50"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardHeader className="pb-2">
            <span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
              Back
            </span>
          </CardHeader>
          <CardContent className="flex flex-1 items-center">
            <p className="text-lg">{back}</p>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}

export { Flashcard };
