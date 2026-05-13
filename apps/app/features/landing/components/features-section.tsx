import { Code2, Gauge, Library } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "In-browser workspace",
    body: "Read the prompt, sketch a solution, and iterate without leaving the tab.",
  },
  {
    icon: Gauge,
    title: "Instant feedback",
    body: "Run checks against examples and catch edge cases early.",
  },
  {
    icon: Library,
    title: "Curated library",
    body: "Problems grouped by theme so you can drill one skill at a time.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-border border-y bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-10 text-center font-semibold text-3xl text-foreground tracking-tight">
          Why Codedrill
        </h2>
        <ul className="grid gap-8 sm:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <li className="text-center sm:text-left" key={title}>
              <div className="mb-3 flex justify-center sm:justify-start">
                <span className="inline-flex rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon aria-hidden className="size-6" />
                </span>
              </div>
              <h3 className="font-medium text-foreground text-lg">{title}</h3>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
