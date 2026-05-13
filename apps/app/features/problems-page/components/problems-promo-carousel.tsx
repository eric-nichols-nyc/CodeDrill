"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/design-system/components/ui/carousel";
import { cn } from "@repo/design-system/lib/utils";
import { Code2, GitBranch, Network, Sparkles } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PromoSlide = {
  id: string;
  href: string;
  className: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  decoration?: ReactNode;
};

const SLIDES: PromoSlide[] = [
  {
    id: "app",
    href: "/",
    className:
      "relative overflow-hidden bg-gradient-to-br from-zinc-950 via-indigo-950/90 to-zinc-900 text-white ring-1 ring-white/10",
    title: "Codedrill at your fingertips",
    subtitle: "Practice anywhere with instant feedback.",
    decoration: (
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(99,102,241,0.35),transparent_55%)]" />
    ),
  },
  {
    id: "system-design",
    href: "/problems",
    className:
      "bg-gradient-to-br from-emerald-950 via-green-900 to-emerald-800 text-white ring-1 ring-white/10",
    eyebrow: "Interview crash course",
    title: "System design for interviews",
    subtitle: "Patterns, tradeoffs, and real-world architecture.",
    decoration: (
      <Network className="pointer-events-none absolute top-3 right-3 size-24 text-white/10" />
    ),
  },
  {
    id: "dsa",
    href: "/problems",
    className:
      "bg-gradient-to-br from-violet-900 via-purple-800 to-blue-800 text-white ring-1 ring-white/10",
    eyebrow: "Interview crash course",
    title: "Data structures & algorithms",
    subtitle: "Sharpen problem-solving with curated drills.",
    decoration: (
      <GitBranch className="pointer-events-none absolute top-3 right-3 size-24 text-white/10" />
    ),
  },
  {
    id: "top",
    href: "/problems",
    className:
      "bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white ring-1 ring-white/10",
    title: "Top interview questions",
    subtitle: "High-signal problems companies ask again and again.",
    decoration: (
      <Sparkles className="pointer-events-none absolute top-3 right-3 size-24 text-white/10" />
    ),
  },
];

type PromoCardProps = {
  slide: PromoSlide;
};

function PromoCard({ slide }: PromoCardProps) {
  return (
    <Link
      className={cn(
        "relative flex h-36 flex-col justify-between rounded-2xl p-4 shadow-sm transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        slide.className,
      )}
      href={slide.href}
    >
      {slide.decoration}
      <div className="relative z-10 flex items-start gap-2">
        {slide.id === "app" ? (
          <span className="rounded-md bg-white/10 p-1.5">
            <Code2 className="size-5" />
          </span>
        ) : null}
        {slide.eyebrow ? (
          <p className="font-medium text-[11px] text-white/80 uppercase tracking-wide">
            {slide.eyebrow}
          </p>
        ) : null}
      </div>
      <div className="relative z-10 space-y-1">
        <p className="text-balance font-semibold text-sm leading-snug sm:text-base">
          {slide.title}
        </p>
        {slide.subtitle ? (
          <p className="line-clamp-2 text-white/75 text-xs sm:text-sm">
            {slide.subtitle}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function ProblemsPromoCarousel() {
  return (
    <div className="mb-4 w-full">
      <Carousel
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {SLIDES.map((slide) => (
            <CarouselItem
              className="basis-[88%] pl-2 sm:basis-1/2 md:basis-1/3 md:pl-4 lg:basis-1/4"
              key={slide.id}
            >
              <PromoCard slide={slide} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className="-translate-y-1/2 top-1/2 left-1 z-10 size-9 border-0 bg-background/85 text-foreground shadow-md backdrop-blur-sm hover:bg-background"
          variant="secondary"
        />
        <CarouselNext
          className="-translate-y-1/2 top-1/2 right-1 z-10 size-9 border-0 bg-background/85 text-foreground shadow-md backdrop-blur-sm hover:bg-background"
          variant="secondary"
        />
      </Carousel>
    </div>
  );
}
