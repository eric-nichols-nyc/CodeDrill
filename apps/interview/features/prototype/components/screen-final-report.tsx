"use client";

import { mockFinalReport } from "@/features/prototype/data/mock-data";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

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
          <CardTitle>Overall score: {mockFinalReport.overallScore}%</CardTitle>
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
            <p className="mb-1 font-medium">Red flags</p>
            <p className="text-muted-foreground">
              {mockFinalReport.redFlags.join(" · ")}
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium">Questions to revisit</p>
            <p className="text-muted-foreground">
              {mockFinalReport.questionsToRevisit.join(", ")}
            </p>
          </div>
          <div>
            <p className="mb-1 font-medium">Recommended study topics</p>
            <ul className="list-inside list-disc text-muted-foreground">
              {mockFinalReport.studyRecommendations.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full sm:w-auto" onClick={onRetake} size="lg">
        Retake Interview
      </Button>
    </section>
  );
}
