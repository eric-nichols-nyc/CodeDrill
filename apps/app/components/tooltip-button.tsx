"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import type { ComponentProps, ReactNode } from "react";

type TooltipButtonProps = {
  buttonText: string;
  content: ReactNode;
  buttonVariant?: ComponentProps<typeof Button>["variant"];
  buttonSize?: ComponentProps<typeof Button>["size"];
  side?: "top" | "right" | "bottom" | "left";
};

export function TooltipButton({
  buttonText,
  content,
  buttonVariant = "outline",
  buttonSize,
  side,
}: TooltipButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size={buttonSize} type="button" variant={buttonVariant}>
          {buttonText}
        </Button>
      </TooltipTrigger>
      <TooltipContent side={side}>
        {typeof content === "string" ? <p>{content}</p> : <span>{content}</span>}
      </TooltipContent>
    </Tooltip>
  );
}
