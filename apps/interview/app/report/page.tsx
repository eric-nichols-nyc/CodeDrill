import { InterviewShell } from "@/features/shell/components/interview-shell";
import { PrototypeScreen } from "@/features/shell/components/prototype-screen";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export default function FinalReportPage() {
  return (
    <InterviewShell>
      <PrototypeScreen
        actions={
          <>
            <Button asChild>
              <Link href="/create">Retake Interview (mock)</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </>
        }
        description="Summary of strong areas, gaps, and what to study next."
        step={5}
        title="Final Report"
      >
        <div className="space-y-4 text-sm">
          <p>
            <span className="font-medium">Overall score:</span>{" "}
            <span className="text-primary">72%</span>
          </p>
          <div>
            <p className="font-medium">Strong areas</p>
            <p className="text-muted-foreground">
              React patterns, collaboration stories
            </p>
          </div>
          <div>
            <p className="font-medium">Study recommendations</p>
            <p className="text-muted-foreground">
              Browser rendering pipeline, caching strategies, system design
              tradeoffs
            </p>
          </div>
        </div>
      </PrototypeScreen>
    </InterviewShell>
  );
}
