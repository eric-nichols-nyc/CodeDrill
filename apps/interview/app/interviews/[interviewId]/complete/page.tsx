import Link from "next/link";
import { InterviewShell } from "@/features/shell/components/interview-shell";
import { Button } from "@repo/design-system/components/ui/button";
import { CheckCircle2 } from "lucide-react";

type CompletePageProps = {
  params: Promise<{ interviewId: string }>;
};

export default async function InterviewCompletePage({ params }: CompletePageProps) {
  const { interviewId } = await params;

  return (
    <InterviewShell>
      <section className="container mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-16 text-center">
        <CheckCircle2 className="size-14 text-emerald-600" />
        <div className="space-y-2">
          <h1 className="font-semibold text-2xl tracking-tight">
            Interview complete
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            All answers for session{" "}
            <span className="font-mono text-foreground text-xs">{interviewId}</span>{" "}
            are saved. The final report will be available when that system ships.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="default">
            <Link href="/">Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/interviews/start">Start another interview</Link>
          </Button>
        </div>
      </section>
    </InterviewShell>
  );
}
