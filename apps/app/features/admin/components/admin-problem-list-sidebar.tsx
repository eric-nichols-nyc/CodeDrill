"use client";

import { AdminProblemDatabaseListPane } from "@/features/admin/components/admin-problem-database-list-pane";
import { AdminProblemListTabs } from "@/features/admin/components/admin-problem-list-tabs";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";

type AdminProblemListSidebarProps = {
  dbProblems: AdminProblemListItem[];
  selectedId?: string | null;
  onSelectProblem?: (id: string) => void;
};

export function AdminProblemListSidebar({
  dbProblems,
  selectedId = null,
  onSelectProblem,
}: AdminProblemListSidebarProps) {
  return (
    <div className="flex h-full min-h-0 flex-col border-border border-r bg-muted/10">
      <AdminProblemListTabs
        dbProblems={dbProblems}
        databaseList={
          <AdminProblemDatabaseListPane
            onSelect={onSelectProblem}
            problems={dbProblems}
            selectedId={selectedId}
          />
        }
      />
    </div>
  );
}
