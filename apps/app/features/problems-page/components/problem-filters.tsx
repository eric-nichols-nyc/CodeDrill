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
import { Shuffle } from "lucide-react";
import type { Difficulty, Status } from "../lib/types";

type ProblemFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  difficulty: Difficulty | "all";
  onDifficultyChange: (value: Difficulty | "all") => void;
  status: Status | "all";
  onStatusChange: (value: Status | "all") => void;
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  availableTags: string[];
  onRandomProblem: () => void;
};

export function ProblemFilters({
  search,
  onSearchChange,
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  selectedTags,
  onTagsChange,
  availableTags,
  onRandomProblem,
}: ProblemFiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card/40 p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <Input
          className="max-w-md bg-background"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search problems…"
          value={search}
        />
        <Button
          className="shrink-0 gap-2"
          onClick={onRandomProblem}
          size="sm"
          variant="outline"
        >
          <Shuffle className="h-4 w-4" />
          Random
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          onValueChange={(v) => onDifficultyChange(v as Difficulty | "all")}
          value={difficulty}
        >
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All difficulties</SelectItem>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(v) => onStatusChange(v as Status | "all")}
          value={status}
        >
          <SelectTrigger className="w-[140px] bg-background">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="solved">Solved</SelectItem>
            <SelectItem value="attempted">Attempted</SelectItem>
            <SelectItem value="unsolved">Unsolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {availableTags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                key={tag}
                onClick={() => toggleTag(tag)}
                type="button"
              >
                {tag}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
