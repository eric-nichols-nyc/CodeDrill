import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsMarkdown } from "@/features/docs/components/docs-markdown";
import { getAllowedDocSlugs, getDocNavLabel } from "@/lib/docs/nav";

type DocsSlugPageProps = {
  params: Promise<{ slug: string[] }>;
};

function toDocSlug(segments: string[]): string {
  return segments.join("/");
}

export function generateStaticParams() {
  return getAllowedDocSlugs().map((slug) => ({
    slug: slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: DocsSlugPageProps): Promise<Metadata> {
  const { slug: segments } = await params;
  const slug = toDocSlug(segments);
  const label = getDocNavLabel(slug);
  if (!label) {
    return { title: "Documentation" };
  }
  return {
    title: label,
    description: `${label} — CodeDrill documentation.`,
  };
}

export default async function DocsSlugPage({ params }: DocsSlugPageProps) {
  const { slug: segments } = await params;
  const slug = toDocSlug(segments);

  if (!getAllowedDocSlugs().includes(slug) || slug.includes("..")) {
    notFound();
  }

  const filePath = join(process.cwd(), "docs", `${slug}.md`);
  let markdown: string;
  try {
    markdown = await readFile(filePath, "utf8");
  } catch {
    notFound();
  }

  return (
    <main>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
        <DocsMarkdown markdown={markdown} />
      </div>
    </main>
  );
}
