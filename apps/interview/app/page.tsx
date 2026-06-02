import { InterviewShell } from "@/features/shell/components/interview-shell";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import Link from "next/link";
import { Mic, FileText, Sparkles } from "lucide-react";

const prototypeScreens = [
  {
    href: "/create",
    title: "Create Interview",
    description: "Resume upload, job description, difficulty.",
  },
  {
    href: "/overview",
    title: "Interview Overview",
    description: "Role, topics, question count, start.",
  },
  {
    href: "/session",
    title: "Question Player",
    description: "One question at a time, voice recording.",
  },
  {
    href: "/feedback",
    title: "Feedback",
    description: "Score, strengths, weaknesses, suggested answer.",
  },
  {
    href: "/report",
    title: "Final Report",
    description: "Overall score, study topics, retake.",
  },
] as const;

export default function HomePage() {
  return (
    <InterviewShell>
      <section className="mx-auto flex max-w-4xl flex-col gap-10 px-4 py-12">
        <div className="space-y-4 text-center">
          <p className="font-medium text-primary text-sm uppercase tracking-wide">
            Static prototype
          </p>
          <h1 className="font-semibold text-4xl tracking-tight sm:text-5xl">
            AI Interview Coach
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Personalized mock interviews from your resume and a target job
            description — practice speaking answers and get targeted feedback.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/create">Start prototype flow</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a
                href="http://localhost:3010"
                rel="noopener noreferrer"
              >
                Back to CodeDrill
              </a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <FileText className="mb-2 size-5 text-primary" />
              <CardTitle className="text-base">Resume + JD</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tailored questions from your experience and the role.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Mic className="mb-2 size-5 text-primary" />
              <CardTitle className="text-base">Voice practice</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Answer out loud — not a shallow chatbot experience.
              </CardDescription>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Sparkles className="mb-2 size-5 text-primary" />
              <CardTitle className="text-base">Coaching feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Per-question evaluation and a final interview report.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-xl">MVP screens (static)</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {prototypeScreens.map((screen) => (
              <li key={screen.href}>
                <Link
                  className="block rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
                  href={screen.href}
                >
                  <p className="font-medium">{screen.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {screen.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </InterviewShell>
  );
}
