"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { useCallback } from "react";

type DevAuthFormFillProps = {
  email: string;
  password: string;
  name?: string;
  /** `sign-in` / `sign-up` from auth route — controls which fields we try to fill. */
  authPath: string;
};

function setNativeInputValue(element: HTMLInputElement, value: string) {
  const descriptor = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    "value"
  );
  descriptor?.set?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function queryInput(
  root: Element,
  selectors: string[]
): HTMLInputElement | null {
  for (const sel of selectors) {
    const el = root.querySelector<HTMLInputElement>(sel);
    if (el) {
      return el;
    }
  }
  return null;
}

/**
 * Dev-only helper: fills visible email/password (and optional name) inputs
 * inside `<main>` for Neon Auth `AuthView`. Not rendered in production builds.
 */
export function DevAuthFormFill({
  email,
  password,
  name,
  authPath,
}: DevAuthFormFillProps) {
  const fill = useCallback(() => {
    const root = document.querySelector("main") ?? document.body;

    const emailInput = queryInput(root, [
      'input[type="email"]',
      'input[name="email"]',
      'input[autocomplete="email"]',
      'input[inputmode="email"]',
    ]);

    const passwordInput = queryInput(root, [
      'input[type="password"]',
      'input[name="password"]',
      'input[autocomplete="current-password"]',
      'input[autocomplete="new-password"]',
    ]);

    if (emailInput) {
      setNativeInputValue(emailInput, email);
    }
    if (passwordInput) {
      setNativeInputValue(passwordInput, password);
    }

    if (authPath === "sign-up" && name) {
      const nameInput = queryInput(root, [
        'input[name="name"]',
        'input[autocomplete="name"]',
        'input[type="text"]',
      ]);
      if (nameInput && nameInput !== emailInput) {
        setNativeInputValue(nameInput, name);
      }
    }
  }, [authPath, email, name, password]);

  return (
    <div className="flex flex-col items-center gap-1 border-muted border-dashed pt-2">
      <p className="text-muted-foreground text-xs">Development only</p>
      <Button
        className="text-xs"
        onClick={fill}
        size="sm"
        type="button"
        variant="outline"
      >
        Fill form from env (test user)
      </Button>
    </div>
  );
}
