"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Progress } from "@repo/design-system/components/ui/progress";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

export function ProblemsSidebar() {
  return (
    <aside className="w-80 shrink-0 space-y-4">
      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            Study plan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Top interview 150</span>
            </div>
            <Progress className="h-1.5" value={32} />
            <p className="mt-1 text-muted-foreground text-xs">48/150 solved</p>
          </div>
          <div className="rounded-lg bg-secondary/50 p-3">
            <div className="mb-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="font-medium text-sm">Core 75</span>
            </div>
            <Progress className="h-1.5" value={65} />
            <p className="mt-1 text-muted-foreground text-xs">49/75 solved</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span className="text-sm">Easy</span>
              </div>
              <span className="text-muted-foreground text-sm">156 / 850</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                <span className="text-sm">Medium</span>
              </div>
              <span className="text-muted-foreground text-sm">198 / 1780</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-sm">Hard</span>
              </div>
              <span className="text-muted-foreground text-sm">42 / 770</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <Star className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            Trending topics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "Array",
              "String",
              "Dynamic programming",
              "Binary search",
              "Tree",
              "Graph",
            ].map((topic) => (
              <span
                className="cursor-pointer rounded-full bg-secondary px-2.5 py-1 text-muted-foreground text-xs transition-colors hover:bg-accent hover:text-accent-foreground"
                key={topic}
              >
                {topic}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            Recent AC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { title: "Two sum", time: "2 hours ago" },
              { title: "Valid parentheses", time: "Yesterday" },
              { title: "Merge two sorted lists", time: "2 days ago" },
            ].map((item) => (
              <div
                className="flex items-center justify-between text-sm"
                key={item.title}
              >
                <span className="cursor-pointer truncate pr-2 text-foreground hover:text-primary">
                  {item.title}
                </span>
                <span className="whitespace-nowrap text-muted-foreground text-xs">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 font-medium text-sm">
            <BookOpen className="h-4 w-4 text-primary" />
            Daily challenge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-1 font-medium text-foreground text-sm">
            Maximum subarray
          </p>
          <p className="text-muted-foreground text-xs">Day 142 of 365</p>
        </CardContent>
      </Card>
    </aside>
  );
}
