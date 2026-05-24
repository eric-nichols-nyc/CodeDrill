"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/design-system/components/ui/alert";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";
import { isWorkspaceCodeApiError } from "../queries/workspace-code-errors";

export function WorkspaceCodeStatusBanner({
  loadError,
  saveError,
  onDismissSaveError,
}: {
  loadError: Error | null;
  saveError: Error | null;
  onDismissSaveError?: () => void;
}) {
  const error = saveError ?? loadError;
  if (!error) {
    return null;
  }

  const apiError = isWorkspaceCodeApiError(error) ? error : null;
  const message = apiError?.userMessage ?? error.message;
  const showSignIn = apiError?.code === "NOT_SIGNED_IN";
  const showDismiss =
    saveError !== null && typeof onDismissSaveError === "function";
  const showActions = showSignIn || showDismiss;
  const title = saveError ? "Could not save code" : "Could not load saved code";

  return (
    <Alert className="mb-3 shrink-0" variant="destructive">
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p className="text-sm">{message}</p>
        {showActions ? (
          <div className="flex flex-wrap items-center gap-2">
            {showSignIn ? (
              <Button asChild size="sm" variant="outline">
                <Link href="/auth/sign-in">Sign in</Link>
              </Button>
            ) : null}
            {showDismiss ? (
              <Button onClick={onDismissSaveError} size="sm" variant="ghost">
                Dismiss
              </Button>
            ) : null}
          </div>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}
