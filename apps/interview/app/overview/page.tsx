import { InterviewShell } from "@/features/shell/components/interview-shell";
import { PrototypeScreen } from "@/features/shell/components/prototype-screen";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export default function InterviewOverviewPage() {
  return (
    <InterviewShell>
      <PrototypeScreen
        actions={
          <Button asChild>
            <Link href="/session">Start Interview (mock)</Link>
          </Button>
        }
        description="Review the generated plan before you begin."
        step={2}
        title="Interview Overview"
      >
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">Company</dt>
            <dd className="font-medium">Acme Corp (mock)</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-medium">Senior Frontend Engineer</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Topics</dt>
            <dd className="font-medium">React, system design, leadership</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Questions</dt>
            <dd className="font-medium">7 · ~35 min</dd>
          </div>
        </dl>
      </PrototypeScreen>
    </InterviewShell>
  );
}
