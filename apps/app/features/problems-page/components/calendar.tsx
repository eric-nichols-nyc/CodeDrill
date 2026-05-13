"use client";

import { Calendar as ShadcnCalendar } from "@repo/design-system/components/ui/calendar";
import { useState } from "react";

export function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="rounded-lg border border-border bg-card p-2 shadow-xs">
      <ShadcnCalendar
        className="w-full max-w-full"
        mode="single"
        onSelect={setDate}
        selected={date}
      />
    </div>
  );
}
