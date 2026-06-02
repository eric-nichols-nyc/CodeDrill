import { InterviewShell } from "@/features/shell/components/interview-shell";
import { PrototypeScreen } from "@/features/shell/components/prototype-screen";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export default function QuestionPlayerPage() {
  return (
    <InterviewShell>
      <PrototypeScreen
        actions={
          <>
            <Button disabled variant="secondary">
              Start Recording (mock)
            </Button>
            <Button asChild>
              <Link href="/feedback">Submit Answer (mock)</Link>
            </Button>
          </>
        }
        description="Question 3 of 7 — answer out loud, then review your transcript."
        step={3}
        title="Question Player"
      >
        <blockquote className="rounded-lg border bg-muted/40 px-4 py-3 text-lg">
          Tell me about a time you improved frontend performance on a production
          app. What did you measure and what changed?
        </blockquote>
      </PrototypeScreen>
    </InterviewShell>
  );
}
