"use client";

import { mockFinalReport } from "@/features/prototype/data/mock-data";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Flag } from "lucide-react";

type ScreenFinalReportProps = {
  onRetake: () => void;
};

export function ScreenFinalReport({ onRetake }: ScreenFinalReportProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Complete
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">Final Report</h1>
        <p className="text-muted-foreground">
          Summary of your mock interview and what to study next.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Overall score: {mockFinalReport.overallScore}% ({mockFinalReport.grade})
          </CardTitle>
          <CardDescription>Mock interview complete</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <p className="mb-1 font-medium">Strong areas</p>
            <p className="text-muted-foreground">
              {mockFinalReport.strongAreas.join(" · ")}
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium">Weak areas</p>
            <p className="text-muted-foreground">
              {mockFinalReport.weakAreas.join(" · ")}
            </p>
          </div>
          <div>
            <p className="mb-2 font-medium">Question breakdown</p>
            <ul className="space-y-2">
              {mockFinalReport.questionSummary.map((item) => (
                <li
                  className="flex items-center justify-between gap-2 rounded-lg border bg-muted/30 px-3 py-2"
                  key={item.id}
                >
                  <span className="text-foreground">{item.topic}</span>
                  <span className="flex items-center gap-2">
                    {item.flagged ? (
                      <Flag className="size-3.5 text-amber-600" />
                    ) : null}
                    <Badge variant="secondary">{item.score}</Badge>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-1 font-medium">Recommendation</p>
            <p className="text-muted-foreground leading-relaxed">
              {mockFinalReport.recommendation}
            </p>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full sm:w-auto" onClick={onRetake} size="lg">
        Retake Interview
      </Button>
    </section>
  );
}
