"use client";

import {
  mockCandidateProfile,
  mockInterview,
  mockJobAnalysis,
  mockQuestionPlan,
} from "@/features/prototype/data/mock-data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
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
          Personalized for {mockCandidateProfile.name} · {mockInterview.company}{" "}
          · {mockInterview.jobTitle}
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

      <Accordion className="rounded-xl border bg-card px-4" type="multiple">
        <AccordionItem value="resume">
          <AccordionTrigger>From your resume</AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">{mockCandidateProfile.summary}</p>
            <div>
              <p className="mb-2 font-medium">Skills</p>
              <div className="flex flex-wrap gap-2">
                {mockCandidateProfile.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">Highlights</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {mockCandidateProfile.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium">We&apos;ll verify</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {mockCandidateProfile.claimsToVerify.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 font-medium text-amber-700 dark:text-amber-400">
                Possible gaps
              </p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {mockCandidateProfile.potentialGaps.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="job">
          <AccordionTrigger>From the job description</AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm">
            <p className="text-muted-foreground">
              {mockJobAnalysis.role} at {mockJobAnalysis.company} ·{" "}
              {mockJobAnalysis.seniority}
            </p>
            <div>
              <p className="mb-2 font-medium">Required skills</p>
              <div className="flex flex-wrap gap-2">
                {mockJobAnalysis.requiredSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 font-medium">Interview focus</p>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {mockJobAnalysis.focusAreas.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="rounded-lg bg-muted/50 px-3 py-2 text-muted-foreground">
              {mockJobAnalysis.interviewEmphasis}
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="plan">
          <AccordionTrigger>Why these questions</AccordionTrigger>
          <AccordionContent>
            <ol className="space-y-3 text-sm">
              {mockQuestionPlan.map((item, index) => (
                <li
                  className="rounded-lg border bg-muted/30 px-3 py-2.5"
                  key={`${item.topic}-${index}`}
                >
                  <p className="font-medium">
                    {index + 1}. {item.topic}
                  </p>
                  <p className="mt-1 text-muted-foreground">{item.reason}</p>
                </li>
              ))}
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full sm:w-auto" onClick={onNext} size="lg">
        Start Interview
      </Button>
    </section>
  );
}
