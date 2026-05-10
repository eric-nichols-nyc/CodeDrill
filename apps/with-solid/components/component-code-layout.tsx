"use client";

import {
  CodeBlock,
  CodeBlockCopyButton,
} from "@repo/design-system/components/ai-elements/code-block";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import type { ReactNode } from "react";

type ComponentCodeLayoutProps = {
  readonly component: ReactNode;
  readonly code: string;
  readonly title: string;
  readonly description?: string;
  readonly language?: "typescript" | "tsx";
};

export const ComponentCodeLayout = ({
  component,
  code,
  title,
  description,
  language = "tsx",
}: ComponentCodeLayoutProps) => (
  <div className="flex h-full flex-col">
    <div className="max-h-[40%] flex-shrink-0 overflow-auto border-b p-4 lg:max-h-[50%]">
      <Card>
        <CardHeader>
          <CardTitle className="text-base lg:text-lg">{title}</CardTitle>
          {description && (
            <p className="text-muted-foreground text-xs lg:text-sm">
              {description}
            </p>
          )}
        </CardHeader>
        <CardContent className="p-4 lg:p-6">{component}</CardContent>
      </Card>
    </div>
    <div className="min-h-0 flex-1 overflow-auto">
      <CodeBlock code={code} language={language} showLineNumbers>
        <CodeBlockCopyButton />
      </CodeBlock>
    </div>
  </div>
);
