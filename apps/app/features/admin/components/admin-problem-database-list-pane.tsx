"use client";

import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";

type AdminProblemDatabaseListPaneProps = {
  problems: AdminProblemListItem[];
  selectedId: string | null;
  onSelect?: (id: string) => void;
};

function databaseItemClass(isActive: boolean): string {
  return `w-full rounded-lg border px-3 py-3 text-left transition-colors ${
    isActive
      ? "border-primary bg-primary/5"
      : "border-border bg-background hover:bg-muted/40"
  }`;
}

function AdminProblemDatabaseListItem({
  problem,
  isActive,
  onSelect,
}: {
  problem: AdminProblemListItem;
  isActive: boolean;
  onSelect?: (id: string) => void;
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-sm">{problem.title}</p>
          <p className="truncate text-muted-foreground text-xs">{problem.slug}</p>
        </div>
        <Badge variant="outline">{problem.difficulty}</Badge>
      </div>
      <div className="mt-2">
        <Badge variant="outline">
          {problem.isPublished ? "published" : "draft"}
        </Badge>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button
        className={databaseItemClass(isActive)}
        onClick={() => onSelect(problem.id)}
        type="button"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      className={databaseItemClass(isActive)}
      href={`/admin?id=${encodeURIComponent(problem.id)}`}
    >
      {content}
    </Link>
  );
}

export function AdminProblemDatabaseListPane({
  problems,
  selectedId,
  onSelect,
}: AdminProblemDatabaseListPaneProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-border border-b px-4 py-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-medium text-sm">In database</p>
            <p className="text-muted-foreground text-xs">
              {problems.length} total problem{problems.length === 1 ? "" : "s"}
            </p>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/admin/add">
              <Plus />
              Add
            </Link>
          </Button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {problems.length === 0 ? (
          <p className="px-2 py-4 text-muted-foreground text-sm">
            No problems in the database yet.
          </p>
        ) : (
          <div className="space-y-2">
            {problems.map((problem) => (
              <AdminProblemDatabaseListItem
                isActive={problem.id === selectedId}
                key={problem.id}
                onSelect={onSelect}
                problem={problem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
