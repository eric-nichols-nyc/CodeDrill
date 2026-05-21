"use client";

import type { ReactNode } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { AdminProblemCatalogPane } from "@/features/admin/components/admin-problem-catalog-pane";
import type { AdminProblemListItem } from "@/features/admin/lib/problem-form-values";

type AdminProblemListTabsProps = {
  dbProblems: AdminProblemListItem[];
  databaseList: ReactNode;
};

export function AdminProblemListTabs({
  dbProblems,
  databaseList,
}: AdminProblemListTabsProps) {
  return (
    <Tabs className="flex h-full min-h-0 flex-col" defaultValue="catalog">
      <div className="border-border border-b px-4 pt-3">
        <TabsList className="w-full">
          <TabsTrigger className="flex-1" value="catalog">
            Catalog
          </TabsTrigger>
          <TabsTrigger className="flex-1" value="database">
            In database
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent
        className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
        value="catalog"
      >
        <AdminProblemCatalogPane dbProblems={dbProblems} />
      </TabsContent>

      <TabsContent
        className="mt-0 min-h-0 flex-1 data-[state=inactive]:hidden"
        value="database"
      >
        {databaseList}
      </TabsContent>
    </Tabs>
  );
}
