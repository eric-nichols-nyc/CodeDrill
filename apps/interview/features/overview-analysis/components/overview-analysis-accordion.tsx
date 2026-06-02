"use client";

import {
  mockCandidateProfile,
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

export function OverviewAnalysisAccordion() {
  return (
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
  );
}
