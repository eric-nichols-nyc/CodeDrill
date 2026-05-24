"use client";

import { Shimmer } from "@repo/design-system/components/ai-elements/shimmer";

export function MessageThinking() {
  return (
    <div
      className="group/message w-full"
      data-role="assistant"
      data-testid="message-assistant-loading"
    >
      <div className="flex h-[calc(13px*1.65)] items-center text-[13px] leading-[1.65]">
        <Shimmer className="font-medium" duration={1}>
          Thinking...
        </Shimmer>
      </div>
    </div>
  );
}
