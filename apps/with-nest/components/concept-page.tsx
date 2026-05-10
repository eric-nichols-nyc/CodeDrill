import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { ReactNode } from "react";

type ConceptPageProps = {
  readonly title: string;
  readonly description: string;
  readonly children: ReactNode;
};

export const ConceptPage = ({
  title,
  description,
  children,
}: ConceptPageProps) => (
  <main className="p-8">
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-muted-foreground text-sm leading-relaxed">
        {children}
      </CardContent>
    </Card>
  </main>
);
