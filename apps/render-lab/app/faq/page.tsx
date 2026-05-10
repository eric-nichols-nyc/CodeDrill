import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { HelpCircle } from "lucide-react";

const faqItems: { id: string; question: string; answer: string; hint?: string }[] = [
  {
    id: "what-is-isr",
    question: "What is ISR and why would you use it?",
    answer:
      "ISR (Incremental Static Regeneration) is a Next.js feature that lets you create or update static pages after you've built your site. Pages are generated at build time and then revalidated in the background after a set time (or on demand), so users get fast cached responses while content stays fresh. I would use ISR when I want static speed and CDN caching but need content to update periodically—for example, product listings, blog indexes, or dashboards that change every few minutes or hours.",
  },
  {
    id: "what-is-ssg",
    question: "What is SSG and when would you use it?",
    answer:
      "SSG (Static Site Generation) means pages are pre-rendered at build time into HTML and assets, so every user gets the same fast, cached response from a CDN. I would use SSG for content that rarely or never changes after deploy—like marketing pages, docs, blog posts, or portfolios—when I want the best performance and don't need per-request or frequently updated data.",
  },
  {
    id: "what-is-ssr",
    question: "What is SSR? What are the benefits and tradeoffs?",
    answer:
      "SSR (Server-Side Rendering) means the server renders the page to HTML on each request, then sends that HTML to the client. Benefits: you always get fresh, per-request data; great for SEO since crawlers see full content; no flash of empty or loading state; and you can keep secrets or user-specific logic on the server. Tradeoffs: time to first byte (TTFB) is higher than static or ISR, so pages can feel slower; the server does more work on every request; and full-page caching is harder, so you often need more server capacity.",
  },
  {
    id: "when-used-ssr",
    question: "Name a time you used SSR and why?",
    answer:
      "I’d use SSR for something like a user’s order history or account page: personalized and different per request, but not “live.” The server renders the page once with that user’s data so the first paint has content (good for SEO and no loading flash), and we don’t need to re-render on the server for every price tick or inventory change. So: SSR for the initial, per-request render; CSR when the page has to stay live and updating.",
  },
  {
    id: "what-is-csr",
    question: "What is CSR and how does it work?",
    answer:
      "CSR (Client-Side Rendering) means the server sends a minimal HTML shell and the JavaScript bundle; the browser downloads and runs the app, then React (or your framework) fetches data and renders the UI in the client. The user often sees a loading or blank state until JS runs and data arrives. It works well for highly interactive, app-like experiences where you don't need crawlers to see full content and you want fast navigation without full page reloads.",
  },
  {
    id: "when-used-csr",
    question: "Name a time you used CSR and why?",
    answer:
      "I used CSR for an internal admin dashboard: lots of filters, tables, and real-time updates, and it didn't need to be indexed by search engines. Keeping all rendering and data fetching on the client made the UI feel like a single app, with instant navigation and no full page reloads, and we could keep the server simple.",
  },
  {
    id: "rsc-1",
    question: "What is a React Server Component?",
    hint: "Think about where the code runs and what gets sent to the client.",
    answer:
      "A component that runs only on the server, never ships its JS to the browser, and sends a serialized UI tree to the client.",
  },
  {
    id: "rsc-2",
    question: "What is streamed in React Server Components?",
    hint: "The format has a specific name.",
    answer:
      "A serialized component tree called the Flight payload. Initial load also includes HTML for fast paint.",
  },
  {
    id: "rsc-3",
    question: "How does Suspense work with Server Components?",
    hint: "What appears first when a component is slow?",
    answer:
      "If a server component suspends, React streams the fallback first and later streams the resolved UI chunk.",
  },
  {
    id: "rsc-4",
    question: "How does Suspense differ for Client Components?",
    hint: "Where does the waiting happen — server or client?",
    answer:
      "In client components, Suspense waits for JS bundles or client-side data in the browser — no server streaming.",
  },
  {
    id: "rsc-5",
    question: "Why are Server Components more performant?",
    hint: "Consider bundle size, hydration, and where work runs.",
    answer:
      "They reduce JS bundle size, eliminate hydration for server-only UI, avoid client fetch waterfalls, and shift work to the server.",
  },
  {
    id: "rsc-6",
    question: "When can RSC hurt performance?",
    hint: "Think about interaction, latency, and caching.",
    answer:
      "For highly interactive UI, poor caching setups, high server latency, or when server rendering becomes a bottleneck.",
  },
  {
    id: "rsc-7",
    question: "How is RSC different from traditional SSR?",
    hint: "Compare what gets sent and what gets hydrated.",
    answer:
      "SSR sends HTML and hydrates everything. RSC sends a serialized tree and hydrates only client components.",
  },
  {
    id: "rsc-8",
    question: "How do you inspect RSC in DevTools?",
    hint: "Check the Network tab for a specific request pattern.",
    answer:
      "Look for '_rsc' requests during client navigation. The response contains the Flight payload.",
  },
  {
    id: "rsc-9",
    question: "Why don't Server Components hydrate?",
    hint: "Does their code run in the browser?",
    answer:
      "Because their JS never reaches the browser — they render once on the server and stay static.",
  },
  {
    id: "rsc-10",
    question: "When should you use Server vs Client Components?",
    hint: "Data vs interactivity.",
    answer:
      "Use Server Components for data-heavy or static UI. Use Client Components for interactivity and local state.",
  },
];

export default function FaqPage() {
  return (
    <div className="p-8">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-muted-foreground" />
              <CardTitle>FAQ</CardTitle>
            </div>
            <CardDescription>
              Frequently asked questions about Next.js rendering and this lab
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger className="text-left [&>svg]:shrink-0">
                    <span className="flex flex-col items-start gap-0.5">
                      <span>{item.question}</span>
                      {item.hint ? (
                        <span className="font-normal text-muted-foreground text-xs">
                          {item.hint}
                        </span>
                      ) : null}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
