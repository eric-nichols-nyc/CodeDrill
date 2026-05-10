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
import { ArrowRight, Scale, Shield, ShieldCheck, Workflow } from "lucide-react";

const iconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary";

const LoadBalancersAndGatewaysPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="font-bold text-4xl">Load Balancers and Gateways</h1>
        <p className="mt-2 text-muted-foreground">
          How load balancers and API gateways work, how they differ, and how
          they fit together in modern architectures.
        </p>
      </div>

      {/* What is a Load Balancer */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>What Is a Load Balancer?</CardTitle>
              <CardDescription>
                The &quot;traffic cop&quot; for your servers
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A load balancer is a device or software that sits between incoming
            client requests and a group of backend servers. It distributes the
            workload so no single server is overwhelmed, maximizing speed,
            improving availability, and allowing the system to scale as traffic
            grows.
          </p>
          <div>
            <h4 className="mb-2 font-semibold">How It Works</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Monitors health:</strong> Continuously checks backend
                servers to ensure they are online and responding.
              </li>
              <li>
                <strong>Selects a server:</strong> Uses an algorithm to choose
                the best server for each request.
              </li>
              <li>
                <strong>Routes traffic:</strong> Forwards the request to that
                server and relays the response back to the user.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Key Benefits</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>High availability:</strong> If one server fails, traffic
                is redirected to healthy servers.
              </li>
              <li>
                <strong>Scalability:</strong> Add or remove servers to handle
                traffic changes without disrupting users.
              </li>
              <li>
                <strong>Performance:</strong> Spreading load reduces response
                times and bottlenecks.
              </li>
              <li>
                <strong>Security:</strong> Hides backend IPs and can help defend
                against DDoS.
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Common Types</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="whitespace-normal">
                    Operating Layer (OSI)
                  </TableHead>
                  <TableHead className="whitespace-normal">
                    Typical Use Case
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Network (NLB)</TableCell>
                  <TableCell className="whitespace-normal">
                    Layer 4 (Transport)
                  </TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    High-performance, low-latency routing by IP and ports.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Application (ALB)
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    Layer 7 (Application)
                  </TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    Routing by content: URLs, HTTP headers, or cookies.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Global (GSLB)</TableCell>
                  <TableCell className="whitespace-normal">DNS Level</TableCell>
                  <TableCell className="whitespace-normal text-muted-foreground">
                    Distributing traffic across data centers in different
                    regions.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Popular Algorithms</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Round Robin:</strong> Requests sent to servers in
                sequential rotation.
              </li>
              <li>
                <strong>Least Connections:</strong> New requests go to the
                server with the fewest active connections.
              </li>
              <li>
                <strong>IP Hash:</strong> Client IP used to route the same
                client to the same server (session persistence).
              </li>
              <li>
                <strong>Weighted:</strong> More traffic to higher-capacity
                servers.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Load Balancer vs API Gateway */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Load Balancer vs API Gateway</CardTitle>
              <CardDescription>
                Different roles: traffic cop vs security desk and concierge
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Both sit in front of backend services and route traffic, but with
            different goals. A load balancer focuses on{" "}
            <strong>availability and performance</strong>; an API gateway
            focuses on <strong>API management and security</strong>—auth, rate
            limiting, and request transformation.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Feature</TableHead>
                <TableHead>Load Balancer</TableHead>
                <TableHead>API Gateway</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Primary Goal</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Distribute traffic evenly
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Protect and manage API access
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  &quot;Intelligence&quot;
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Low (routes by IP or URL)
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  High (reads headers, tokens, data)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Key Features</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Health checks, failover
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Auth, rate limiting, caching, SDK generation
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Best For</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Scaling same-service pools
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Orchestrating different microservices
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <p className="text-muted-foreground text-sm">
            Some API gateways include basic load balancing. In large systems you
            usually use both: the load balancer at the &quot;front door&quot;
            handles raw traffic, then passes to the API gateway for security and
            business rules.
          </p>
        </CardContent>
      </Card>

      {/* Do You Need Both */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <Workflow className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Do You Need Both?</CardTitle>
              <CardDescription>
                In most modern systems, yes—they solve different problems
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            A typical setup uses a layered approach: the load balancer sits in
            front of the API gateway.
          </p>
          <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
            <li>
              <strong>External Load Balancer:</strong> The &quot;front
              door.&quot; Takes raw internet traffic and spreads it across
              multiple API Gateway instances so the gateway doesn’t overload.
            </li>
            <li>
              <strong>API Gateway:</strong> Does the &quot;smart&quot; work:
              auth, rate limits, routing to the right microservice.
            </li>
            <li>
              <strong>Internal Load Balancer (optional):</strong> In large
              systems, the gateway may send requests to another load balancer in
              front of backend servers.
            </li>
          </ul>
          <div>
            <h4 className="mb-2 font-semibold">When Can You Skip One?</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Load balancer only:</strong> Simple monolith with no
                complex API features (e.g. rate limiting, JWT)—a load balancer
                alone can be enough.
              </li>
              <li>
                <strong>API Gateway only:</strong> Low traffic or serverless
                (e.g. Lambda); the managed gateway’s built-in scaling may make a
                separate load balancer unnecessary.
              </li>
            </ul>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Feature</TableHead>
                <TableHead>Load Balancer</TableHead>
                <TableHead>API Gateway</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Focus</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Infrastructure (uptime, speed)
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Application (security, logic)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Routing</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  By &quot;where&quot; (IP/Port)
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  By &quot;what&quot; (URL/Headers)
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Metaphor</TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Air traffic controller
                </TableCell>
                <TableCell className="whitespace-normal text-muted-foreground">
                  Airport check-in / security
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Which Is Hit First */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <ArrowRight className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Which Is Hit First?</CardTitle>
              <CardDescription>
                In high-traffic architectures, the load balancer is the entry
                point
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The load balancer is the edge: it receives all raw internet traffic
            before it reaches your internal infrastructure.
          </p>
          <div>
            <h4 className="mb-2 font-semibold">Typical Request Flow</h4>
            <ol className="list-inside list-decimal space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Load Balancer (Layer 4/7):</strong> Receives the initial
                request; distributes it across API Gateway instances.
              </li>
              <li>
                <strong>API Gateway (Layer 7):</strong> Handles auth, rate
                limiting, and request transformation; routes to the right
                microservice.
              </li>
              <li>
                <strong>Backend services:</strong> Process the request and
                return the response.
              </li>
            </ol>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Why This Order?</h4>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>
                <strong>Availability:</strong> Multiple gateway instances behind
                the load balancer; if one fails, traffic goes to the others.
              </li>
              <li>
                <strong>Security:</strong> Backend and gateway IPs stay hidden;
                the load balancer is the single public contact point.
              </li>
              <li>
                <strong>Efficiency:</strong> The load balancer can do SSL
                termination so the gateway can focus on application logic.
              </li>
            </ul>
          </div>
          <p className="text-muted-foreground text-sm">
            In simple or low-traffic setups you might see the API gateway first
            (or alone) when the cloud provider handles scaling. For systems
            built to scale, the load balancer is almost always the first stop.
          </p>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={iconClass}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Summary</CardTitle>
              <CardDescription>
                Load balancers and API gateways in a nutshell
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-muted-foreground text-sm">
            <li>
              <strong>Load balancer:</strong> Distributes traffic for
              availability and performance; operates at Layer 4 or 7; health
              checks, failover, algorithms (round robin, least connections,
              etc.).
            </li>
            <li>
              <strong>API gateway:</strong> Manages and secures APIs; auth, rate
              limiting, transformation; routes by URL/headers to microservices.
            </li>
            <li>
              <strong>Together:</strong> LB at the front door → Gateway for
              smart routing and security → optional internal LB → backend
              services.
            </li>
            <li>
              <strong>Order:</strong> In scalable systems, the load balancer is
              hit first; the gateway then applies application-level rules.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  </main>
);

export default LoadBalancersAndGatewaysPage;
