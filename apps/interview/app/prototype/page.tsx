import { InterviewCoach } from "@/features/prototype/components/interview-coach";
import { InterviewShell } from "@/features/shell/components/interview-shell";

export default function PrototypePage() {
  return (
    <InterviewShell>
      <InterviewCoach />
    </InterviewShell>
  );
}
