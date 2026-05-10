import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { Eraser } from "lucide-react";

export default function SanitizingInputsPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="font-bold text-4xl">Sanitizing inputs and HTML</h1>
          <p className="mt-2 text-muted-foreground">
            Reducing XSS and injection by escaping and allowlisting
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Eraser className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Why sanitize?</CardTitle>
            </div>
            <CardDescription>
              User input can contain script tags, HTML, or SQL-like strings. If you echo it into the page without escaping, an attacker can run JavaScript (XSS). If you insert it into HTML with allowed tags (e.g. rich text), you need to allowlist safe tags and attributes instead of blocking “bad” ones.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              <strong>Escape on output:</strong> When rendering plain text, encode <code className="rounded bg-muted px-1 py-0.5 text-sm">&lt;</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">&gt;</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">&amp;</code>, <code className="rounded bg-muted px-1 py-0.5 text-sm">&quot;</code> so the browser doesn’t interpret them as HTML/JS. <strong>HTML sanitization:</strong> When you must allow some HTML (e.g. a WYSIWYG), use a library that strips or allowlists tags and attributes (e.g. DOMPurify, or a server-side equivalent). Always validate and sanitize on the server; client-side is for UX only.
            </p>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Escaping plain text (output)</CardTitle>
            <CardDescription>
              Before inserting a string into HTML, escape so it is treated as text, not markup.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// In React, use {userInput} in JSX — React escapes by default.
// Only use dangerouslySetInnerHTML when you control or sanitize the source.
<div>{escapeHtml(userSuppliedName)}</div>`}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>HTML sanitization (allowlist)</CardTitle>
            <CardDescription>
              For rich text, use a sanitizer that only allows safe tags/attributes. Run it on the server before storing or rendering.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-sm">
{`// npm install isomorphic-dompurify
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["b", "i", "em", "strong", "a", "p", "br"];
const ALLOWED_ATTR = ["href"];

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

// In API route or server action:
const body = await req.json();
const safe = sanitizeHtml(body.content ?? "");
// Store or return \`safe\`; never store raw \`body.content\` and render as HTML.`}
            </pre>
            <p className="mt-4 text-muted-foreground text-sm">
              Validate shape and length with Zod (or similar) first; then sanitize. Never rely on client-side sanitization alone — always do it on the server.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
