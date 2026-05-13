"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import { cn } from "@repo/design-system/lib/utils";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  FileText,
  Lock,
  Minus,
} from "lucide-react";
import Link from "next/link";
import type { Problem, SortDirection, SortField, Status } from "../lib/types";

type ProblemTableProps = {
  problems: Problem[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
};

const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 } as const;

function difficultyTextClass(d: Problem["difficulty"]) {
  if (d === "Easy") {
    return "text-emerald-600 dark:text-emerald-400";
  }
  if (d === "Hard") {
    return "text-red-600 dark:text-red-400";
  }
  return "text-amber-600 dark:text-amber-400";
}

function TableSortIcon({
  field,
  sortField,
  sortDirection,
}: {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}) {
  if (sortField !== field) {
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
  }
  if (sortDirection === "asc") {
    return <ArrowUp className="ml-1 h-4 w-4" />;
  }
  return <ArrowDown className="ml-1 h-4 w-4" />;
}

function statusCellIcon(status: Status) {
  if (status === "solved") {
    return <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
  }
  if (status === "attempted") {
    return <Minus className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
  }
  return null;
}

export function ProblemTable({
  problems,
  sortField,
  sortDirection,
  onSort,
}: ProblemTableProps) {
  const sortedProblems = [...problems].sort((a, b) => {
    let comparison = 0;
    switch (sortField) {
      case "id":
        comparison = a.id - b.id;
        break;
      case "title":
        comparison = a.title.localeCompare(b.title);
        break;
      case "acceptance":
        comparison = a.acceptance - b.acceptance;
        break;
      case "difficulty":
        comparison =
          difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        break;
      default:
        break;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow className="border-border hover:bg-transparent">
          <TableHead className="w-[50px] text-muted-foreground">
            Status
          </TableHead>
          <TableHead
            className="w-[72px] cursor-pointer select-none text-muted-foreground"
            onClick={() => onSort("id")}
          >
            <div className="flex items-center">
              #
              <TableSortIcon
                field="id"
                sortDirection={sortDirection}
                sortField={sortField}
              />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer select-none text-muted-foreground"
            onClick={() => onSort("title")}
          >
            <div className="flex items-center">
              Title
              <TableSortIcon
                field="title"
                sortDirection={sortDirection}
                sortField={sortField}
              />
            </div>
          </TableHead>
          <TableHead className="w-[80px] text-muted-foreground">
            Solution
          </TableHead>
          <TableHead
            className="w-[120px] cursor-pointer select-none text-muted-foreground"
            onClick={() => onSort("acceptance")}
          >
            <div className="flex items-center">
              Acceptance
              <TableSortIcon
                field="acceptance"
                sortDirection={sortDirection}
                sortField={sortField}
              />
            </div>
          </TableHead>
          <TableHead
            className="w-[100px] cursor-pointer select-none text-muted-foreground"
            onClick={() => onSort("difficulty")}
          >
            <div className="flex items-center">
              Difficulty
              <TableSortIcon
                field="difficulty"
                sortDirection={sortDirection}
                sortField={sortField}
              />
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedProblems.map((problem, index) => (
          <TableRow
            className={cn(
              "cursor-pointer border-border",
              index % 2 === 0 ? "bg-transparent" : "bg-secondary/30"
            )}
            key={problem.slug}
          >
            <TableCell>{statusCellIcon(problem.status)}</TableCell>
            <TableCell className="text-muted-foreground">
              {problem.id}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Link
                  className="text-foreground transition-colors hover:text-primary"
                  href={`/problems/${encodeURIComponent(problem.slug)}`}
                >
                  {problem.title}
                </Link>
                {problem.isPremium ? (
                  <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              {problem.status === "solved" ? (
                <FileText className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" />
              ) : null}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {problem.acceptance.toFixed(1)}%
            </TableCell>
            <TableCell>
              <span className={difficultyTextClass(problem.difficulty)}>
                {problem.difficulty}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
