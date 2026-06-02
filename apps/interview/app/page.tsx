import { Button } from "@repo/design-system/components/ui/button";
import { Mic, Sparkles, Target } from "lucide-react";
import Link from "next/link";
import { InterviewShell } from "@/features/shell/components/interview-shell";

export default function HomePage() {
  return (
    <InterviewShell>
      <section className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-3xl flex-col justify-center gap-10 px-4 py-16">
        <div className="space-y-4 text-center">
          <p className="font-medium text-primary text-sm uppercase tracking-wide">
            AI Interview Coach
          </p>
          <h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">
            Practice interviews tailored to your resume and the role
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Generate a realistic mock interview, answer out loud, and get
            actionable feedback — not a generic chatbot.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Button asChild size="lg">
              <Link href="/interview">Start interview</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="http://localhost:3010">Back to CodeDrill</a>
            </Button>
          </div>
        </div>

        <ul className="grid gap-4 sm:grid-cols-3">
          <li className="rounded-lg border bg-card p-4 text-center">
            <Target className="mx-auto mb-2 size-5 text-primary" />
            <p className="font-medium text-sm">Resume + job description</p>
          </li>
          <li className="rounded-lg border bg-card p-4 text-center">
            <Mic className="mx-auto mb-2 size-5 text-primary" />
            <p className="font-medium text-sm">Voice practice</p>
          </li>
          <li className="rounded-lg border bg-card p-4 text-center">
            <Sparkles className="mx-auto mb-2 size-5 text-primary" />
            <p className="font-medium text-sm">Targeted feedback</p>
          </li>
        </ul>
      </section>
    </InterviewShell>
  );
}
