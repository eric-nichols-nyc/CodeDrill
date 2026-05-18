import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { DocsMarkdown } from "@/features/docs/components/docs-markdown";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Codedrill app README and documentation.",
};

export default async function DocsPage() {
  const readmePath = join(process.cwd(), "README.md");
  const markdown = await readFile(readmePath, "utf8");

  return (
    <main>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <DocsMarkdown markdown={markdown} />
      </div>
    </main>
  );
}
