"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { NewProblemForm } from "@/features/admin/components/new-problem-form";
import { parseAdminProblemListItem } from "@/features/admin/lib/problem-form-values";

export function AdminAddProblemPage() {
  const router = useRouter();

  const handleSubmitted = useCallback(
    (body: unknown) => {
      const item = parseAdminProblemListItem(body);
      if (item) {
        router.push(`/admin?id=${encodeURIComponent(item.id)}`);
        return;
      }
      router.push("/admin");
    },
    [router]
  );

  return (
    <div className="h-[calc(100dvh-1rem)] p-4">
      <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-background">
        <header className="sticky top-0 z-20 shrink-0 border-border border-b bg-background/95 px-6 py-4 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/admin">
                  <ArrowLeft />
                  Admin
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/problems">Problems</Link>
              </Button>
            </div>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <h1 className="font-semibold text-2xl">New problem</h1>
              <p className="text-muted-foreground text-sm">
                Fill out the authoring form below. After you create a problem,
                you will return to the admin list with it selected.
              </p>
            </div>
            <NewProblemForm onSubmitted={handleSubmitted} />
          </div>
        </div>
      </div>
    </div>
  );
}
