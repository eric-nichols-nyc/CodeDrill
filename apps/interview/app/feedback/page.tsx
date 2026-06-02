import { InterviewShell } from "@/features/shell/components/interview-shell";
import { PrototypeScreen } from "@/features/shell/components/prototype-screen";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export default function FeedbackPage() {
  return (
    <InterviewShell>
      <PrototypeScreen
        actions={
          <Button asChild>
            <Link href="/session">Next Question (mock)</Link>
          </Button>
        }
        description="Per-question coaching — not a generic chat reply."
        step={4}
        title="Feedback"
      >
        <div className="space-y-4 text-sm">
          <p>
            <span className="font-medium">Score:</span>{" "}
            <span className="text-primary">7 / 10</span>
          </p>
          <div>
            <p className="font-medium">Strengths</p>
            <p className="text-muted-foreground">
              Clear STAR structure; mentioned Core Web Vitals.
            </p>
          </div>
          <div>
            <p className="font-medium">Weaknesses</p>
            <p className="text-muted-foreground">
              Light on before/after metrics; missed caching tradeoffs.
            </p>
          </div>
        </div>
      </PrototypeScreen>
    </InterviewShell>
  );
}
