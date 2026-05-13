import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import Link from "next/link";

const placeholders = [
  { title: "Data structures", description: "Lists, trees, heaps, and maps." },
  { title: "Algorithms", description: "Search, sort, and graph patterns." },
  {
    title: "Strings & parsing",
    description: "Text processing and validation.",
  },
];

export function ExploreSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-2xl">
          <h2 className="font-semibold text-3xl text-foreground tracking-tight">
            Explore topics
          </h2>
          <p className="mt-2 text-muted-foreground">
            Starter categories for the catalog. More paths will land here as the
            library grows.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {placeholders.map((item) => (
            <Link href="/problems" key={item.title}>
              <Card className="h-full transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
