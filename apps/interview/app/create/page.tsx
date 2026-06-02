import { InterviewShell } from "@/features/shell/components/interview-shell";
import { PrototypeScreen } from "@/features/shell/components/prototype-screen";
import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";

export default function CreateInterviewPage() {
  return (
    <InterviewShell>
      <PrototypeScreen
        actions={
          <Button asChild>
            <Link href="/overview">Generate Interview (mock)</Link>
          </Button>
        }
        description="Upload a resume, paste a job description, and choose difficulty."
        step={1}
        title="Create Interview"
      >
        <ul className="list-inside list-disc space-y-2 text-muted-foreground text-sm">
          <li>Resume upload (placeholder)</li>
          <li>Job description textarea (placeholder)</li>
          <li>Difficulty selector (placeholder)</li>
        </ul>
      </PrototypeScreen>
    </InterviewShell>
  );
}
