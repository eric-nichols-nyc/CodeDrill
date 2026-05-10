import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/design-system/components/ui/table";
import {
  BookOpen,
  CheckSquare,
  Database,
  Layers,
  MessageSquare,
  Rocket,
  Target,
  Zap,
} from "lucide-react";

const iconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary";

const GettingStartedPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl space-y-10">
      {/* Introduction */}
      <div>
        <h1 className="font-bold text-4xl">
          Introduction to System Design Interview Preparation
        </h1>
        <p className="mt-2 text-muted-foreground">
          Many candidates feel confident about coding interviews but nervous
          about system design. Preparation can be demystified by working
          backwards from <strong>common problems</strong>, similar to coding
          interview preparation. Focus on which problems to study and in what
          order—covered below.
        </p>
      </div>

      {/* What is a System Design Interview */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Target className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>
                Understanding What a System Design Interview Is
              </CardTitle>
              <CardDescription>
                What you’re being tested on and what to expect
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A system design interview tests your ability to{" "}
            <strong>architect complex, scalable systems</strong> that solve
            real-world problems. It’s typically conducted on a whiteboard: you
            draw boxes and arrows for services and interactions—no coding.
          </p>
          <p className="text-muted-foreground">
            Problems generally fall into two overlapping categories:
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              <strong>Product Design Problems:</strong> User-facing applications
              (e.g. Dropbox, Uber, Netflix).
            </li>
            <li>
              <strong>Infrastructure Design Problems:</strong> Backend systems
              (e.g. rate limiters, message queues, data processing pipelines
              like ad click aggregators).
            </li>
          </ul>
          <p className="text-muted-foreground">
            Expect your interview question to come from one of these two
            buckets.
          </p>
        </CardContent>
      </Card>

      {/* Framework */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>The Importance of Following a Framework</CardTitle>
              <CardDescription>
                A consistent structure keeps you focused and manages time
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Using a consistent <strong>framework</strong> during the interview
            is critical. Recommended steps:
          </p>
          <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
            <li>
              <strong>Outline Requirements:</strong> Functional (e.g. booking a
              ticket) and non-functional (e.g. low latency, scalability). Align
              with the interviewer.
            </li>
            <li>
              <strong>Identify Core Entities:</strong> Map to database tables
              (e.g. user, event, ticket).
            </li>
            <li>
              <strong>Define APIs:</strong> Usually REST; sometimes GraphQL or
              others depending on context.
            </li>
            <li>
              <strong>High-Level Design:</strong> Draw a simple architecture
              that meets functional requirements.
            </li>
            <li>
              <strong>Deep Dive Enhancements:</strong> Address non-functional
              requirements: latency, consistency, scalability.
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Evaluation */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>How Interviewers Evaluate Candidates</CardTitle>
              <CardDescription>
                What interviewers look for in your performance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <strong>Problem Solving:</strong> Identify and prioritize core
              challenges (e.g. focus on booking flow, not auth, when designing
              Ticketmaster).
            </li>
            <li>
              <strong>Solution Design:</strong> Quality and trade-offs in the
              high-level design that meet functional needs.
            </li>
            <li>
              <strong>Technical Excellence:</strong> Depth in deep-dive
              discussions, knowledge of technologies and failure modes.
            </li>
            <li>
              <strong>Communication:</strong> Clear explanation of complex ideas
              over ~35–60 minutes.
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Six Fundamentals */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Six Core Fundamentals to Master</CardTitle>
              <CardDescription>
                These six areas cover 90%+ of what you’ll see in system design
                interviews
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Area</TableHead>
                <TableHead className="whitespace-normal">Key Points</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="align-top font-medium">
                  1. Storage Fundamentals
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Relational vs. document vs. key-value stores; ACID vs. BASE;
                  data models and consistency trade-offs.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top font-medium">
                  2. Scalability
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Vertical (stronger machines) vs. horizontal (more machines);
                  partitioning/sharding; consistent hashing for distribution.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top font-medium">
                  3. Networking
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Key OSI layers: application (REST, GraphQL, gRPC, WebSockets),
                  transport (TCP vs. UDP), network (load balancers, firewalls).
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top font-medium">
                  4. Latency, Throughput, Performance
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Latency numbers for memory, disk, network; bottlenecks;
                  capacity planning; caching to reduce latency.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top font-medium">
                  5. Fault Tolerance and Redundancy
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Replication, failure detection; redundancy at server, rack,
                  and data center level for graceful recovery.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="align-top font-medium">
                  6. CAP Theorem
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Consistency, Availability, Partition Tolerance—a system can
                  only guarantee two of three; choose based on system needs.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="mt-4 text-muted-foreground text-sm">
            Dive deeper with dedicated material on consistent hashing,
            networking essentials, and the CAP theorem.
          </p>
        </CardContent>
      </Card>

      {/* Components */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>
                Database, Cache, Messaging, and Other Components
              </CardTitle>
              <CardDescription>
                Building blocks you’ll use in almost every design
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-1 font-semibold">Databases</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Relational</strong> (e.g. PostgreSQL): structured
                tables, strict schema.
              </li>
              <li>
                <strong>Document stores</strong> (e.g. MongoDB): JSON-like,
                nested data.
              </li>
              <li>
                <strong>Key-value</strong> (e.g. Redis): simple, fast lookups.
              </li>
            </ul>
            <p className="mt-2 text-muted-foreground text-sm">
              Choose by read/write patterns and performance—not by SQL vs NoSQL
              debates.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Cache</h4>
            <p className="text-muted-foreground text-sm">
              Short-term memory for frequent access (e.g. Redis). Improves
              latency but adds complexity: freshness and eviction policies.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Message Queues</h4>
            <p className="text-muted-foreground text-sm">
              Asynchronous communication between services (Kafka, RabbitMQ,
              SQS). Help with traffic spikes and fault tolerance. Consider
              delivery guarantees: once, at-least-once, at-most-once—and how you
              handle duplicates and failures.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Load Balancer</h4>
            <p className="text-muted-foreground text-sm">
              Routes requests across servers to avoid overload and support
              horizontal scaling.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">Blob Storage</h4>
            <p className="text-muted-foreground text-sm">
              Unstructured data (images, videos, large files)—e.g. S3. Keeps
              large objects out of databases.
            </p>
          </div>
          <div>
            <h4 className="mb-1 font-semibold">
              Content Delivery Network (CDN)
            </h4>
            <p className="text-muted-foreground text-sm">
              Global cache for static content (e.g. Cloudflare). Serves content
              closer to users for faster delivery.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Problem Set & Learning */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>
                Recommended Core Problem Set and Learning Approach
              </CardTitle>
              <CardDescription>
                A curated set of problems and how to practice effectively
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Work through <strong>10 core system design problems</strong> in
            order, e.g. Bitly, Dropbox, Ticketmaster, and others through Post
            Search. They cover most interview concepts, and each introduces
            patterns that recur later.
          </p>
          <p className="text-muted-foreground">Suggested cycle:</p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground">
            <li>
              Watch walkthroughs passively for the first few (Bitly, Dropbox,
              Ticketmaster).
            </li>
            <li>
              <strong>Actively practice</strong> on an online whiteboard with a
              timer.
            </li>
            <li>
              Note “known unknowns” and research (Google, ChatGPT, etc.) to fill
              gaps.
            </li>
            <li>
              Watch detailed walkthroughs or read breakdowns for “unknown
              unknowns.”
            </li>
            <li>Repeat for all 10 problems.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Guided Practice */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Guided Practice and Mock Interviews</CardTitle>
              <CardDescription>
                Using platforms to structure and pressure-test your prep
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Platforms like Hello Interview offer guided practice for 25+ system
            design problems: step-by-step use of the framework and inline
            feedback on whiteboard and written answers. Ticketmaster is often
            free; full access may require a subscription.
          </p>
          <p className="text-muted-foreground">
            Preparation isn’t only technical—
            <strong>presentation and communication</strong> matter. Practice
            explaining designs aloud with peers or in mock interviews.
            Professional mocks (e.g. with interviewers from top companies) can
            sharpen both design and delivery.
          </p>
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Rocket className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Key Takeaways</CardTitle>
              <CardDescription>
                Summary of what to remember from this guide
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              System design interviews test your ability to architect scalable,
              real-world systems— product or infrastructure.
            </li>
            <li>
              Use a clear framework: requirements → entities → APIs → high-level
              design → deep dive on non-functional aspects.
            </li>
            <li>
              Master six fundamentals: storage, scalability, networking,
              performance, fault tolerance, and the CAP theorem.
            </li>
            <li>
              Know your components: databases, caches, message queues, load
              balancers, blob storage, CDNs.
            </li>
            <li>
              Practice with a curated problem set; mix passive learning with
              active, timed whiteboard practice.
            </li>
            <li>
              Communication and presentation are as important as technical
              knowledge—practice explaining out loud and in mocks.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default GettingStartedPage;
