import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  ClipboardList,
  Database,
  Layers,
  Lightbulb,
  ListOrdered,
  Plug,
  Target,
} from "lucide-react";

const stepIconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary";

const FiveStepFrameworkPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="font-bold text-4xl">Five Step Framework</h1>
        <p className="mt-2 text-muted-foreground">
          A highly effective system design framework that follows a linear,
          step-by-step process. This structure helps you methodically build a
          system from basic features to a fully scaled architecture, without
          getting bogged down in complex details too early.
        </p>
      </div>

      {/* Step 1: Define Requirements */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-primary">
              1
            </div>
            <div className={stepIconClass}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Define the Requirements</CardTitle>
              <CardDescription>
                Clarify exactly what you are building before designing
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Break requirements into two categories:
          </p>
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">Functional Requirements</h4>
              <p className="text-muted-foreground text-sm">
                Core features of the system—often phrased as &quot;users should
                be able to...&quot; For a URL shortener: users can submit a long
                URL to get a short one, and visiting the short URL redirects to
                the original. For Instagram: uploading media, following users,
                searching posts.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                Non-Functional Requirements
              </h4>
              <p className="text-muted-foreground text-sm">
                Qualities and constraints (the &quot;ilities&quot;): scalability
                (e.g. 100M daily active users), latency targets (e.g. redirects
                under 200 ms), high availability, fault tolerance, durability.
                This is also where to discuss the <strong>CAP theorem</strong>—
                whether the system needs strong consistency or if eventual
                consistency is acceptable.
              </p>
            </div>
          </div>
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="flex gap-3 pt-6">
              <Lightbulb className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-sm">Critical tip</p>
                <p className="text-muted-foreground text-sm">
                  Do not do &quot;back-of-the-envelope&quot; math upfront. Storage
                  or latency estimates matter, but at the very beginning they are
                  often useless unless they directly inform an immediate design
                  decision. Save the math for the high-level design or deep
                  dives when you need it to justify an architectural choice.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Step 2: Core Entities */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-primary">
              2
            </div>
            <div className={stepIconClass}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Outline Core Entities</CardTitle>
              <CardDescription>
                Identify what will be persisted and exchanged
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            List the high-level entities your system will persist and exchange.
            You don&apos;t need the exact database schema yet—just the primary
            &quot;tables&quot; or &quot;collections&quot; the system relies on.
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>URL shortener:</strong> Original URL, Short URL, User.
            </li>
            <li>
              <strong>Instagram:</strong> Users, Followers, Media, Posts.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Step 3: Define API */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-primary">
              3
            </div>
            <div className={stepIconClass}>
              <Plug className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Define the API</CardTitle>
              <CardDescription>
                Establish the contract between clients and backend
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Map your functional requirements directly to API endpoints. Define
            HTTP methods (GET, POST, etc.), route paths, parameters, and
            expected responses.
          </p>
          <p className="text-muted-foreground text-sm">
            Example: if a functional requirement is to upload a photo, define a{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              POST
            </code>{" "}
            endpoint that accepts the binary file and metadata and returns a
            success code.
          </p>
        </CardContent>
      </Card>

      {/* Step 4: High-Level Design */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-primary">
              4
            </div>
            <div className={stepIconClass}>
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>High-Level Design</CardTitle>
              <CardDescription>
                Draw the basic architecture that satisfies functional needs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Go to the whiteboard and draw the basic architecture: e.g. client
            → server → database. The only goal here is to{" "}
            <strong>satisfy the functional requirements</strong>. Build a
            simple, &quot;black box&quot; system that works in theory but does
            not yet scale or handle bottlenecks.
          </p>
          <p className="text-muted-foreground text-sm">
            Example: draw the flow of a user request hitting a server, saving to
            a database, and returning a result.
          </p>
        </CardContent>
      </Card>

      {/* Step 5: Deep Dives */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-primary">
              5
            </div>
            <div className={stepIconClass}>
              <ClipboardList className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Deep Dives</CardTitle>
              <CardDescription>
                Evolve the design to meet non-functional requirements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            This is where the real system design happens. Go one-by-one through
            the <strong>non-functional requirements</strong> from Step 1 and
            evolve your high-level design to satisfy them.
          </p>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li>
              <strong>Scaling:</strong> If the system must support massive
              traffic, split a monolith into a microservice architecture (e.g.
              separate read and write services), horizontally scale with
              multiple instances behind a Load Balancer and API Gateway.
            </li>
            <li>
              <strong>Latency:</strong> Add an in-memory cache (e.g. Redis) for
              heavy read traffic, database indexes for faster lookups, or a CDN
              to serve media closer to users.
            </li>
            <li>
              <strong>Asynchronous Processing:</strong> Use a message broker
              (e.g. Kafka) for downstream work (updating search indexes, user
              feeds) so the main system stays responsive under load.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={stepIconClass}>
              <ListOrdered className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Framework at a Glance</CardTitle>
              <CardDescription>
                Five steps: requirements → entities → API → high-level design
                → deep dives
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="list-inside list-decimal space-y-1 text-muted-foreground text-sm">
            <li>Define the Requirements (functional + non-functional)</li>
            <li>Outline Core Entities</li>
            <li>Define the API</li>
            <li>High-Level Design (functional only)</li>
            <li>Deep Dives (non-functional: scale, latency, async)</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default FiveStepFrameworkPage;
