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
import { ArrowDownUp } from "lucide-react";
import type { SortDirection, SortField } from "../../lib/types";

type ProblemsListSortPopoverProps = {
  sortField: SortField;
  sortDirection: SortDirection;
  onSortChange: (field: SortField, direction: SortDirection) => void;
};

const FIELD_LABELS: Record<SortField, string> = {
  id: "Problem #",
  title: "Title",
  acceptance: "Acceptance",
  difficulty: "Difficulty",
};

export function ProblemsListSortPopover({
  sortField,
  sortDirection,
  onSortChange,
}: ProblemsListSortPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="size-10 shrink-0 rounded-full border bg-muted/60 text-muted-foreground shadow-none hover:bg-muted hover:text-foreground"
          size="icon"
          type="button"
          variant="outline"
        >
          <ArrowDownUp className="h-4 w-4" />
          <span className="sr-only">Sort</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-60 border-border/80 bg-popover p-3 shadow-xl"
        sideOffset={8}
      >
        <p className="mb-2 font-medium text-foreground text-xs">Sort by</p>
        <div className="flex gap-2">
          <Select
            onValueChange={(v) => onSortChange(v as SortField, sortDirection)}
            value={sortField}
          >
            <SelectTrigger className="h-9 flex-1 rounded-md bg-background shadow-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(FIELD_LABELS) as SortField[]).map((field) => (
                <SelectItem key={field} value={field}>
                  {FIELD_LABELS[field]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(v) => onSortChange(sortField, v as SortDirection)}
            value={sortDirection}
          >
            <SelectTrigger className="h-9 w-[110px] shrink-0 rounded-md bg-background shadow-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
