"use client";

import { mockInterview } from "@/features/prototype/data/mock-data";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";

type ScreenOverviewProps = {
  onNext: () => void;
};

export function ScreenOverview({ onNext }: ScreenOverviewProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Step 2
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Interview Overview
        </h1>
        <p className="text-muted-foreground">
          Review your personalized plan before you begin.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{mockInterview.jobTitle}</CardTitle>
          <CardDescription>{mockInterview.company}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Questions</dt>
              <dd className="font-medium">{mockInterview.totalQuestions}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estimated duration</dt>
              <dd className="font-medium">{mockInterview.estimatedTime}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Difficulty</dt>
              <dd className="font-medium">{mockInterview.difficulty}</dd>
            </div>
          </dl>
          <div>
            <p className="mb-2 font-medium text-sm">Topics covered</p>
            <div className="flex flex-wrap gap-2">
              {mockInterview.topics.map((topic) => (
                <Badge key={topic} variant="secondary">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full sm:w-auto" onClick={onNext} size="lg">
        Start Interview
      </Button>
    </section>
  );
}
