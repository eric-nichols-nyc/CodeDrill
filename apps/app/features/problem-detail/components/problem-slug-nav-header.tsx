"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutGrid,
  Settings,
  Shuffle,
  UserPlus,
} from "lucide-react";
import type { ReactNode } from "react";
import { AppBrandLink } from "@/components/app-brand-link";
import { AppHeaderInner } from "@/components/app-header-inner";
import { NavDrawer } from "@/features/nav-drawer";
import type { Problem } from "@/features/problems-page/lib/types";
import { NavUserMenu } from "@/components/nav-user-menu";
import { TimerMenuButton } from "@/components/timer";

function SparkleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="sparkleGrad" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#60a5fa" />
        </linearGradient>
      </defs>
      <path
        d="M10 1l1.8 5.5H17l-4.3 3.1 1.6 5.4L10 12l-4.3 3 1.6-5.4L3 6.5h5.2L10 1z"
        fill="url(#sparkleGrad)"
      />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        width="14"
        x="3"
        y="2"
      />
      <path
        d="M7 7h6M7 10h6M7 13h4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

type NavIconButtonProps = {
  children: ReactNode;
  label: string;
  active?: boolean;
  teal?: boolean;
  sparkle?: boolean;
  className?: string;
  badge?: string;
  onClick?: () => void;
};

function NavIconButton({
  children,
  label,
  active,
  teal,
  sparkle,
  className,
  badge,
  onClick,
}: NavIconButtonProps) {
  return (
    <button
      aria-label={label}
      className={cn(
        "relative flex h-8 w-8 items-center justify-center rounded transition-colors duration-150",
        "text-[var(--nav-icon)] hover:bg-white/5 hover:text-[var(--nav-icon-hover)]",
        active === true ? "bg-white/5 text-[var(--nav-icon-hover)]" : false,
        teal === true
          ? "text-[var(--teal-accent)] hover:text-[var(--teal-accent)]"
          : false,
        sparkle === true ? "bg-white/5" : false,
        className
      )}
      onClick={onClick}
      type="button"
    >
      {children}
      {badge !== undefined ? (
        <span className="ml-0.5 font-medium text-[var(--nav-icon)] text-xs">
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export type ProblemSlugNavHeaderProps = {
  /** Problem title from API (fallback: slug). */
  title: string;
  problems: Problem[];
  currentSlug: string;
  fetchOk: boolean;
  fetchStatus: number;
  /** When false, prev/next/random controls are disabled (0–1 problems in catalog). */
  canNavigate?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onRandom?: () => void;
};

/**
 * Sticky LeetCode-style nav for `/problems/[slug]`. Problem List opens nav sheet;
 * logo links home; prev/next/random rotate through catalog order (id asc).
 */
export function ProblemSlugNavHeader({
  title,
  problems,
  currentSlug,
  fetchOk,
  fetchStatus,
  canNavigate = false,
  onPrevious,
  onNext,
  onRandom,
}: ProblemSlugNavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full shrink-0 select-none border-[var(--nav-border)] border-b bg-[var(--nav-bg)]">
      <AppHeaderInner className="gap-0">
        <div className="flex min-w-0 items-center gap-1">
          <AppBrandLink className="flex h-10 w-10 shrink-0 items-center justify-center" />

          <div
            aria-hidden="true"
            className="mx-1 h-4 w-px shrink-0 bg-[var(--nav-border)]"
          />

          <NavDrawer
            currentSlug={currentSlug}
            fetchOk={fetchOk}
            fetchStatus={fetchStatus}
            problems={problems}
          />

          <NavIconButton
            className={canNavigate ? undefined : "pointer-events-none opacity-40"}
            label="Previous problem"
            onClick={() => {
              if (canNavigate) {
                onPrevious?.();
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </NavIconButton>
          <NavIconButton
            className={canNavigate ? undefined : "pointer-events-none opacity-40"}
            label="Next problem"
            onClick={() => {
              if (canNavigate) {
                onNext?.();
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </NavIconButton>

          <NavIconButton
            className={canNavigate ? undefined : "pointer-events-none opacity-40"}
            label="Random problem"
            onClick={() => {
              if (canNavigate) {
                onRandom?.();
              }
            }}
          >
            <Shuffle className="h-3.5 w-3.5" />
          </NavIconButton>

          {title.length > 0 ? (
            <>
              <div
                aria-hidden="true"
                className="mx-1 h-4 w-px shrink-0 bg-[var(--nav-border)]"
              />
              <span
                className="max-w-[min(20rem,28vw)] truncate font-medium text-[var(--nav-icon-hover)] text-sm"
                title={title}
              >
                {title}
              </span>
            </>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-center gap-1">
          <NavIconButton label="Notes">
            <NotesIcon />
          </NavIconButton>

          <NavIconButton label="AI Assistant" sparkle>
            <SparkleIcon />
          </NavIconButton>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <NavIconButton label="Layout">
            <LayoutGrid className="h-4 w-4" />
          </NavIconButton>

          <NavIconButton label="Settings">
            <Settings className="h-4 w-4" />
          </NavIconButton>

          <button
            aria-label="Streak: 0"
            className="flex h-8 items-center gap-0.5 rounded px-1 text-[var(--nav-icon)] transition-colors hover:bg-white/5 hover:text-[var(--nav-icon-hover)]"
            type="button"
          >
            <Flame className="h-4 w-4" />
            <span className="font-medium text-xs">0</span>
          </button>

          <TimerMenuButton
            className="relative shrink-0"
            iconClassName="h-4 w-4"
            triggerClassName="h-8 w-8 rounded bg-transparent text-[var(--nav-icon)] transition-colors duration-150 hover:bg-white/5 hover:text-[var(--nav-icon-hover)]"
          />

          <NavIconButton label="Add friend">
            <UserPlus className="h-4 w-4" />
          </NavIconButton>

          <div
            aria-hidden="true"
            className="mx-1 h-4 w-px bg-[var(--nav-border)]"
          />

          <NavUserMenu />
        </div>
      </AppHeaderInner>
    </header>
  );
}
