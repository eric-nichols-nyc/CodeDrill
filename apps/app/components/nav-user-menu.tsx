"use client";

import { UserButton } from "@neondatabase/neon-js/auth/react/ui";
import { CircleUser } from "lucide-react";

const navTriggerClassName =
  "flex h-8 w-8 items-center justify-center rounded transition-colors duration-150 text-[var(--nav-icon)] hover:bg-white/5 hover:text-[var(--nav-icon-hover)]";

/**
 * Account menu for dark problem nav: Lucide trigger + Neon Auth dropdown.
 */
export function NavUserMenu() {
  return (
    <UserButton
      align="end"
      sideOffset={6}
      size="icon"
      trigger={
        <button
          aria-label="Account menu"
          className={navTriggerClassName}
          type="button"
        >
          <CircleUser className="h-4 w-4" />
        </button>
      }
    />
  );
}
