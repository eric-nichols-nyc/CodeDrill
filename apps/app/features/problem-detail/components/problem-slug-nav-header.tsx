"use client";

import { cn } from "@repo/design-system/lib/utils";
import {
  AlignLeft,
  ChevronLeft,
  ChevronRight,
  Flame,
  LayoutGrid,
  Settings,
  Shuffle,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { TimerMenuButton } from "@/components/timer";

function LogoIcon() {
  return (
    <svg
      className="h-7 w-7 shrink-0"
      fill="none"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Logo</title>
      <path
        d="M16 3C8.82 3 3 8.82 3 16s5.82 13 13 13 13-5.82 13-13S23.18 3 16 3zm-1.5 18.5L8 16l1.5-1.5 5 5 9-9L25 12l-10.5 9.5z"
        fill="#FFA116"
      />
    </svg>
  );
}

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
};

/**
 * Sticky LeetCode-style nav for `/problems/[slug]`. Home + Problem list are real
 * routes; other controls are visual placeholders until wired.
 */
export function ProblemSlugNavHeader({ title }: ProblemSlugNavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 flex h-12 w-full shrink-0 select-none items-center gap-0 border-[var(--nav-border)] border-b bg-[var(--nav-bg)] px-3">
      <div className="flex min-w-0 items-center gap-1">
        <Link
          aria-label="Home"
          className="flex h-8 w-8 shrink-0 items-center justify-center"
          href="/"
        >
          <LogoIcon />
        </Link>

        <div
          aria-hidden="true"
          className="mx-1 h-4 w-px shrink-0 bg-[var(--nav-border)]"
        />

        <Link
          aria-label="Problem List"
          className="group flex h-8 shrink-0 items-center gap-1.5 rounded px-1.5 transition-colors hover:bg-white/5"
          href="/problems"
        >
          <AlignLeft className="h-4 w-4 text-[var(--nav-icon)] group-hover:text-[var(--nav-icon-hover)]" />
          <span className="whitespace-nowrap font-medium text-[var(--nav-icon-hover)] text-sm">
            Problem List
          </span>
        </Link>

        <NavIconButton label="Previous problem">
          <ChevronLeft className="h-4 w-4" />
        </NavIconButton>
        <NavIconButton label="Next problem">
          <ChevronRight className="h-4 w-4" />
        </NavIconButton>

        <NavIconButton label="Random problem">
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

      <div className="flex flex-1 items-center justify-center gap-1">
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

        <button
          aria-label="Profile"
          className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-bold text-white text-xs transition-all hover:ring-2 hover:ring-white/20"
          type="button"
        >
          <span aria-hidden="true">U</span>
        </button>
      </div>
    </header>
  );
}
