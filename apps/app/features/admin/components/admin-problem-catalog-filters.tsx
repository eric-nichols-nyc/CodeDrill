"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import type {
  CatalogDifficultyFilter,
  CatalogStatusFilter,
} from "@/features/admin/hooks/use-admin-problem-catalog-filter";

type AdminProblemCatalogFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: CatalogDifficultyFilter;
  onDifficultyChange: (value: CatalogDifficultyFilter) => void;
  status: CatalogStatusFilter;
  onStatusChange: (value: CatalogStatusFilter) => void;
  visibleCount: number;
  totalCount: number;
};

const STATUS_OPTIONS: { value: CatalogStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not-added", label: "Not added" },
  { value: "added", label: "Added" },
];

export function AdminProblemCatalogFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  visibleCount,
  totalCount,
}: AdminProblemCatalogFiltersProps) {
  return (
    <div className="space-y-3 border-border border-b px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">Template catalog</p>
          <p className="text-muted-foreground text-xs">
            {visibleCount} of {totalCount} templates
          </p>
        </div>
      </div>

      <Input
        aria-label="Search catalog templates"
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search title, key, or LC #"
        value={search}
      />

      <Select
        onValueChange={(value) =>
          onDifficultyChange(value as CatalogDifficultyFilter)
        }
        value={difficulty}
      >
        <SelectTrigger aria-label="Filter by difficulty" className="w-full">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All difficulties</SelectItem>
          <SelectItem value="easy">Easy</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="hard">Hard</SelectItem>
        </SelectContent>
      </Select>

      <div
        className="flex flex-wrap gap-1"
        role="group"
        aria-label="Filter by added status"
      >
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            size="sm"
            type="button"
            variant={status === option.value ? "default" : "outline"}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
