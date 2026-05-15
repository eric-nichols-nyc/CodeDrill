"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { cn } from "@repo/design-system/lib/utils";
import { Filter, Minus, Plus, RotateCcw } from "lucide-react";
import type {
  ProblemListFilterField,
  ProblemListFilterRow,
} from "../lib/types";

type ProblemsListFilterPopoverProps = {
  rows: ProblemListFilterRow[];
  availableTopics: string[];
  onAddRow: () => void;
  onRemoveRow: (id: string) => void;
  onUpdateRow: (
    id: string,
    patch: Partial<Omit<ProblemListFilterRow, "id">>
  ) => void;
  onReset: () => void;
  activeCount: number;
  className?: string;
};

const FIELD_OPTIONS: { value: ProblemListFilterField; label: string }[] = [
  { value: "difficulty", label: "Difficulty" },
  { value: "status", label: "Status" },
  { value: "topic", label: "Topic" },
];

function valueOptions(field: ProblemListFilterField, topics: string[]) {
  if (field === "difficulty") {
    return ["Easy", "Medium", "Hard"];
  }
  if (field === "status") {
    return ["solved", "attempted", "unsolved"];
  }
  return topics;
}

function filterValueLabel(field: ProblemListFilterField, value: string) {
  if (field === "status") {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
  }
  return value;
}

export function ProblemsListFilterPopover({
  rows,
  availableTopics,
  onAddRow,
  onRemoveRow,
  onUpdateRow,
  onReset,
  activeCount,
  className,
}: ProblemsListFilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-10 gap-2 rounded-full border bg-muted/60 px-3.5 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground",
            activeCount > 0 && "border-primary/40 text-primary",
            className
          )}
          size="sm"
          type="button"
          variant="outline"
        >
          <span className="relative inline-flex">
            <Filter className="h-4 w-4 shrink-0" />
            {activeCount > 0 ? (
              <span className="-top-1 -right-1 absolute size-1.5 rounded-full bg-primary" />
            ) : null}
          </span>
          <span className="tabular-nums">{activeCount}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-[min(100vw-2rem,28rem)] gap-0 border-border/80 bg-popover p-0 shadow-xl"
        sideOffset={8}
      >
        <div className="border-border/80 border-b px-4 py-3">
          <p className="font-medium text-foreground text-sm">Filter problems</p>
          <p className="text-muted-foreground text-xs">
            Rows combine with <span className="text-foreground/90">&amp;</span>{" "}
            (all must match).
          </p>
        </div>

        <div className="max-h-[min(50vh,20rem)] space-y-2 overflow-y-auto px-4 py-3">
          {rows.map((row) => {
            const values = valueOptions(row.field, availableTopics);
            const topicSelectEmpty =
              row.field === "topic" && values.length === 0;
            return (
              <div
                className="flex items-center gap-2 rounded-lg bg-muted/30 px-2 py-2 dark:bg-muted/15"
                key={row.id}
              >
                <Select
                  onValueChange={(v) =>
                    onUpdateRow(row.id, {
                      field: v as ProblemListFilterField,
                    })
                  }
                  value={row.field}
                >
                  <SelectTrigger className="h-9 w-[120px] shrink-0 rounded-md bg-background shadow-xs">
                    <SelectValue placeholder="Field" />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(v) =>
                    onUpdateRow(row.id, {
                      operator: v as ProblemListFilterRow["operator"],
                    })
                  }
                  value={row.operator}
                >
                  <SelectTrigger className="h-9 w-[72px] shrink-0 rounded-md bg-background px-2 shadow-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="is">is</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  disabled={topicSelectEmpty}
                  onValueChange={(v) => onUpdateRow(row.id, { value: v })}
                  value={row.value || undefined}
                >
                  <SelectTrigger className="h-9 min-w-0 flex-1 rounded-md bg-background shadow-xs">
                    <SelectValue
                      placeholder={topicSelectEmpty ? "No topics" : "Value"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {topicSelectEmpty ? (
                      <SelectItem disabled value="__empty__">
                        No topics loaded
                      </SelectItem>
                    ) : (
                      values.map((v) => (
                        <SelectItem key={v} value={v}>
                          {filterValueLabel(row.field, v)}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>

                <Button
                  aria-label="Remove filter row"
                  className="size-8 shrink-0 rounded-md text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveRow(row.id)}
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-2 border-border/80 border-t px-4 py-3">
          <Button
            className="gap-1.5 rounded-full"
            onClick={onAddRow}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Plus className="h-4 w-4" />
            Add filter
          </Button>
          <Button
            className="gap-1.5 rounded-full text-muted-foreground"
            onClick={onReset}
            size="sm"
            type="button"
            variant="ghost"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
