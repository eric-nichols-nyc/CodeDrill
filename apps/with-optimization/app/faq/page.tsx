"use client";

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

const faqs = [
  {
    question: "What's the best way to handle images in React applications?",
    answer:
      "Use a modern image component like Next.js Image or a CDN-based solution (Cloudinary, Imgix). Key requirements: automatic WebP/AVIF conversion, responsive sizes, lazy loading for below-fold images, explicit dimensions to prevent layout shift, and compressed quality (80-85%). For user-uploaded images, process them server-side during upload rather than client-side. This delivers 50-70% smaller file sizes and eliminates client-side processing overhead.",
  },
  {
    question:
      "How do I balance performance optimization with development speed?",
    answer:
      "Focus on high-impact, low-effort optimizations first: React Compiler, code splitting, image optimization, and proper state management architecture. These four changes deliver 60-80% of potential performance improvements with minimal development overhead. Save complex optimizations (Web Workers, advanced SSR, micro-optimizations) for specific bottlenecks identified through profiling. Similar to building production-ready systems, start with solid architecture and optimize based on metrics.",
  },
  {
    question: "How do you optimize databases and APIs?",
    answer:
      "I start by measuring performance to identify the bottleneck. On the database side, I optimize indexing strategy, eliminate N+1 queries, reduce over-fetching, and analyze execution plans. On the API side, I focus on pagination, payload reduction, caching, and rate limiting. For heavy workloads, I introduce background processing and caching layers like Redis. The key is optimizing for read-heavy vs write-heavy patterns and scaling appropriately.",
  },
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              <CardTitle>FAQ</CardTitle>
            </div>
            <CardDescription>
              Frequently asked questions about optimization and performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion className="w-full" collapsible type="single">
              {faqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
