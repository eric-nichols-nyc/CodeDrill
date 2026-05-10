"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type CodeBlockProperties = {
  readonly code: string;
};

export const CodeBlock = ({ code }: CodeBlockProperties) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm">
        <code>{code}</code>
      </pre>
      <Button
        className="absolute top-2 right-2"
        onClick={handleCopy}
        size="sm"
        variant="ghost"
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
};
