import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DOCS_PROSE_CLASS } from "@/features/docs/docs-prose";

type DocsMarkdownProps = {
  markdown: string;
};

/** Server-rendered markdown body for docs pages. */
export function DocsMarkdown({ markdown }: DocsMarkdownProps) {
  return (
    <article className={DOCS_PROSE_CLASS}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </article>
  );
}
