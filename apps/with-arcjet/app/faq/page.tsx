"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/design-system/components/ui/accordion";

type FaqItem =
  | { id: string; question: string; answer: string }
  | {
      id: string;
      question: string;
      sections: { title: string; items: string[] }[];
    };

const faqs: FaqItem[] = [
  {
    id: "attacks",
    question: "What common web attacks should we defend against and how?",
    sections: [
      {
        title: "Common attacks",
        items: [
          "DDoS and brute force—mitigate with rate limiting and circuit breakers.",
          "Injection (SQL, XSS, command)—use parameterized queries, output encoding, and input validation/sanitization.",
          "CSRF—use SameSite cookies, CSRF tokens, and strict origin checks.",
          "Session fixation/hijacking—use secure, HttpOnly, SameSite cookies and short-lived tokens.",
          "Broken access control—enforce authorization on every request and avoid exposing internal IDs.",
        ],
      },
      {
        title: "Defenses",
        items: [
          "Rate limiting at the edge.",
          "Validation and sanitization in the app.",
          "Secure headers (CSP, HSTS, etc.).",
        ],
      },
    ],
  },
  {
    id: "rate-limiting",
    question: "How does rate limiting work and what strategies do you use?",
    answer:
      "Rate limiting caps how many requests a client can make in a time window (e.g., 100 req/min per IP or per user). Strategies: (1) Fixed window—count requests per window; simple but can allow bursts at boundaries. (2) Sliding window—smooth limits over time. (3) Token bucket—allow bursts up to a cap with a refill rate. (4) Leaky bucket—smooth output rate. I use different limits per endpoint (e.g., stricter for login/signup, looser for reads). Identify clients by IP, user ID, or API key; apply limits in middleware or at the edge so abusive traffic is rejected before hitting app logic. Return 429 with Retry-After when limits are exceeded.",
  },
  {
    id: "cors",
    question: "What is CORS and how do you configure it securely?",
    sections: [
      {
        title: "Overview",
        items: [
          "CORS (Cross-Origin Resource Sharing) lets a browser allow a page from origin A to call an API on origin B. The server sends Access-Control-Allow-Origin (and related headers) to say which origins may access the resource.",
        ],
      },
      {
        title: "Secure config",
        items: [
          "Whitelist specific origins—never use '*' for credentials.",
          "Use Access-Control-Allow-Credentials: true only when you need cookies/auth and your Allow-Origin is a single origin.",
          "Restrict allowed methods and headers to what the app needs.",
          "Use preflight (OPTIONS) to validate before the real request.",
        ],
      },
      {
        title: "Risk",
        items: [
          "Misconfiguration can allow other sites to read responses or perform authenticated actions on behalf of users.",
        ],
      },
    ],
  },
  {
    id: "http-cookies",
    question: "How do you secure HTTP cookies (flags and best practices)?",
    answer:
      "Use these flags: Secure—sent only over HTTPS. HttpOnly—not readable by JavaScript (reduces XSS stealing cookies). SameSite=Strict or Lax—reduces CSRF; Strict blocks cross-site sends, Lax allows top-level navigations (e.g. links). Set a reasonable path and, for session cookies, an expiry or Max-Age. For sensitive cookies, prefer short lifetimes and refresh on activity. Don't put sensitive data in cookies if you can store it server-side and keep only a session ID. Domain should be as specific as possible; avoid setting for parent domains unless needed.",
  },
  {
    id: "csrf-cookies",
    question: "What are CSRF cookies and how do they prevent CSRF attacks?",
    answer:
      "CSRF (Cross-Site Request Forgery) is when a malicious site triggers a request from the user's browser to your app, reusing the user's cookies. CSRF cookies (and tokens) mitigate this: (1) Server issues a cryptographically random token, often in a cookie (e.g. double-submit cookie) or in the page. (2) The client sends that token (e.g. in a header or form field) with state-changing requests. (3) Server rejects the request if the token is missing or doesn't match. SameSite=Strict or Lax on session cookies reduces CSRF by limiting when the browser sends cookies on cross-site requests. For APIs, use SameSite, and optionally a custom header or token that the attacker's page cannot read or send.",
  },
  {
    id: "sensitive-data",
    question:
      "How do you handle sensitive data (storage, transport, and logging)?",
    sections: [
      {
        title: "In transit",
        items: ["Use TLS (HTTPS) everywhere; enforce HSTS."],
      },
      {
        title: "At rest",
        items: [
          "Encrypt sensitive fields in the DB or use a secrets store.",
          "Hash passwords with a strong algorithm (e.g. bcrypt/argon2).",
        ],
      },
      {
        title: "In the app",
        items: [
          "Avoid putting secrets in client bundles or env exposed to the client.",
          "Use server-only code or env for API keys and DB URLs.",
        ],
      },
      {
        title: "In logging",
        items: [
          "Never log passwords, tokens, full cards, or PII in plain text; redact or omit.",
        ],
      },
      {
        title: "In responses",
        items: [
          "Don't return sensitive fields (e.g. internal IDs, emails) unless authorized; use allowlists for serialization.",
        ],
      },
      {
        title: "General",
        items: [
          "Apply least privilege for DB and service accounts; rotate secrets and tokens periodically.",
        ],
      },
    ],
  },
];

function isFaqWithSections(
  item: FaqItem
): item is FaqItem & { sections: { title: string; items: string[] }[] } {
  return "sections" in item;
}

const FaqPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="font-bold text-4xl">FAQ</h1>
        <p className="mt-2 text-muted-foreground">
          Interview-style Q&A on attacks, rate limiting, CORS, cookies, CSRF,
          and sensitive data
        </p>
      </div>

      <Accordion className="w-full" collapsible type="single">
        {faqs.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-left font-light text-lg [&>svg]:shrink-0">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              {isFaqWithSections(item) ? (
                <div className="space-y-4 font-light text-base text-muted-foreground">
                  {item.sections.map((section) => (
                    <div key={section.title}>
                      <h4 className="mb-1.5 font-medium text-foreground">
                        {section.title}
                      </h4>
                      <ul className="list-disc space-y-1 pl-6">
                        {section.items.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="font-light text-base text-muted-foreground">
                  {item.answer}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </main>
);

export default FaqPage;
