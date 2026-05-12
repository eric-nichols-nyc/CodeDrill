"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/design-system/components/ui/dialog";
import { Plus } from "lucide-react";
import Link from "next/link";
import { NewProblemForm } from "./new-problem-form";

export function AdminPageShell() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <header className="-mx-6 sticky top-0 z-20 mb-6 border-border border-b bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-semibold text-2xl">Admin</h1>
            <p className="text-muted-foreground text-sm">
              Create and manage coding problems for the practice platform.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/problems">Problems</Link>
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus />
                  New problem
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden p-0">
                <div className="flex max-h-[90vh] flex-col overflow-hidden">
                  <DialogHeader className="border-border border-b px-6 py-4">
                    <DialogTitle>Create problem</DialogTitle>
                    <DialogDescription>
                      Add a full problem with starter code, hints, solutions,
                      tags, and testcases.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="overflow-y-auto px-6 py-6">
                    <NewProblemForm />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Creates a problem via the Nest API (
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            POST /problems
          </code>
          ). Set{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            NEON_JWT_API_URL
          </code>{" "}
          if the API is not on{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            http://localhost:3030
          </code>
          . Neon Auth does not send Better Auth cookies to that API, so set the
          same{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            INTERNAL_PROBLEMS_SECRET
          </code>{" "}
          in this app and in{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            neon-jwt-api
          </code>{" "}
          (see{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            .env.example
          </code>{" "}
          in both).
        </p>

        <div className="rounded-lg border border-border border-dashed bg-muted/20 p-6">
          <h2 className="font-medium text-lg">Problem creation</h2>
          <p className="mt-2 text-muted-foreground text-sm">
            Use the{" "}
            <span className="font-medium text-foreground">New problem</span>{" "}
            button in the header to open the authoring dialog.
          </p>
        </div>
      </div>
    </div>
  );
}
