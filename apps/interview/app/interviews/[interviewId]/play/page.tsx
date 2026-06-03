import { InterviewPlayer } from "@/features/interview-player/components/interview-player";
import { getGate1DemoSession } from "@/features/interview-player/data/gate1-demo-session";
import { InterviewShell } from "@/features/shell/components/interview-shell";

type PlayPageProps = {
  params: Promise<{ interviewId: string }>;
};

export default async function InterviewPlayPage({ params }: PlayPageProps) {
  const { interviewId } = await params;
  const session = getGate1DemoSession(interviewId);

  return (
    <InterviewShell className="[&_main]:p-0">
      <InterviewPlayer session={session} />
    </InterviewShell>
  );
}
