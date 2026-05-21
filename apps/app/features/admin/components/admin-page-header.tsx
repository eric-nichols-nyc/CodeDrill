"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";

type AdminPageHeaderProps = {
  variant: "browse" | "add";
  canEdit?: boolean;
  isEditing?: boolean;
  onToggleEdit?: () => void;
};

export function AdminPageHeader({
  variant,
  canEdit = false,
  isEditing = false,
  onToggleEdit,
}: AdminPageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-border border-b bg-background/95 px-6 py-4 backdrop-blur">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/problems">Problems</Link>
          </Button>
          {variant === "add" ? (
            <Button asChild size="sm" variant="outline">
              <Link href="/admin">Admin</Link>
            </Button>
          ) : null}
        </div>
        <div className="flex justify-center">
          {variant === "browse" ? (
            <Button aria-label="Add a problem" asChild size="icon">
              <Link href="/admin/add">
                <Plus />
              </Link>
            </Button>
          ) : (
            <p className="font-medium text-sm">Add a problem</p>
          )}
        </div>
        <div className="flex justify-end">
          {variant === "browse" && canEdit && onToggleEdit ? (
            <Button
              onClick={onToggleEdit}
              size="sm"
              type="button"
              variant="outline"
            >
              {isEditing ? null : <Pencil />}
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          ) : (
            <div />
          )}
        </div>
      </div>
    </header>
  );
}
