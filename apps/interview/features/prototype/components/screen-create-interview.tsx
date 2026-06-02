"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import { Textarea } from "@repo/design-system/components/ui/textarea";
import { Upload } from "lucide-react";

type ScreenCreateInterviewProps = {
  onNext: () => void;
};

export function ScreenCreateInterview({ onNext }: ScreenCreateInterviewProps) {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-12">
      <div className="space-y-2">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
          Step 1
        </p>
        <h1 className="font-semibold text-3xl tracking-tight">
          Create Interview
        </h1>
        <p className="text-muted-foreground">
          Upload your resume and paste the job description to generate a
          tailored mock interview.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resume</CardTitle>
          <CardDescription>PDF or DOCX (prototype — no upload yet)</CardDescription>
        </CardHeader>
        <CardContent>
          <button
            className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-muted/30 px-6 py-10 text-center transition-colors hover:bg-muted/50"
            type="button"
          >
            <Upload className="size-8 text-muted-foreground" />
            <span className="font-medium text-sm">Drop resume here or browse</span>
            <span className="text-muted-foreground text-xs">
              alex-chen-resume.pdf (mock)
            </span>
          </button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Job description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Label htmlFor="job-description">Paste the role requirements</Label>
          <Textarea
            className="min-h-32"
            defaultValue="Senior Frontend Engineer at Stripe — React, TypeScript, Next.js, accessibility, testing, performance at scale, mentoring. Build customer-facing UI with high quality bar..."
            id="job-description"
            placeholder="Paste job description..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Difficulty</CardTitle>
        </CardHeader>
        <CardContent>
          <Select defaultValue="mid">
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="entry">Entry level</SelectItem>
              <SelectItem value="mid">Mid level</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
              <SelectItem value="staff">Staff+</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Button className="w-full sm:w-auto" onClick={onNext} size="lg">
        Generate Interview
      </Button>
    </section>
  );
}
