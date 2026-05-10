import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  ArrowDown,
  ArrowRight,
  Cloud,
  Database,
  Image as ImageIcon,
  MessageSquare,
  Server,
  Share2,
  Shield,
} from "lucide-react";

const stepIconClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary";

const steps = [
  {
    step: 1,
    title: "Client Request to the API Gateway",
    icon: Shield,
    description:
      "The client sends a POST request to an API Gateway with the photo as binary data.",
    details: [
      "API Gateway handles routing, rate limiting, authentication, and authorization.",
      "Request body: binary file data; headers include multipart form-data content type and a unique boundary string for the file payload.",
    ],
  },
  {
    step: 2,
    title: "Routing via Load Balancer",
    icon: Server,
    description:
      "The API Gateway forwards the request to a load balancer.",
    details: [
      "Traffic is distributed across horizontally scaled Post Service instances.",
      "Enables high volume and avoids a single point of failure.",
    ],
  },
  {
    step: 3,
    title: "Upload to Object Storage",
    icon: Cloud,
    description:
      "The Post Service uploads the image to object storage (e.g. Amazon S3).",
    details: [
      "For files over a size threshold (e.g. 5 MB), multi-part upload splits the file into chunks for efficiency and resumability.",
    ],
  },
  {
    step: 4,
    title: "CDN Update",
    icon: Share2,
    description:
      "Object storage can trigger a CDN cache update or invalidation (e.g. CloudFront).",
    details: [
      "The image is cached near users’ locations for faster delivery.",
    ],
  },
  {
    step: 5,
    title: "Saving Metadata to the Database",
    icon: Database,
    description:
      "Post Service receives the image URL and writes post metadata to the main Postgres database.",
    details: [
      "Metadata includes caption, creation time, user ID, etc.",
      "An atomic transaction ensures the image upload and metadata write succeed or fail together, avoiding inconsistent state.",
    ],
  },
  {
    step: 6,
    title: "Confirmation Sent to Client",
    icon: ArrowRight,
    description:
      "After metadata is stored, the Post Service returns the image URL to the client.",
    details: ["Client can show success and display the new post."],
  },
  {
    step: 7,
    title: "Asynchronous Message to Kafka",
    icon: MessageSquare,
    description:
      "The Post Service publishes a single, denormalized message with all post data to Kafka.",
    details: [
      "Decouples the core upload path from downstream work.",
      "Keeps the system responsive and scalable.",
    ],
  },
  {
    step: 8,
    title: "Downstream System Updates",
    icon: ArrowDown,
    description:
      "Kafka consumers update their systems from the post message.",
    details: [
      "Graph DB (e.g. Neo4j): new post relationship for social graph analysis.",
      "Search (e.g. Elasticsearch): indexes captions and hashtags so the photo is searchable.",
      "User Feed Service: fetches followers from Neo4j and, using a push model, updates pre-generated feed caches for followers so the new photo appears in their feeds immediately.",
    ],
  },
];

const InstagramPage = () => (
  <main className="min-h-screen bg-background p-8">
    <div className="mx-auto max-w-4xl space-y-10">
      <div>
        <h1 className="font-bold text-4xl">Instagram: Photo Upload Flow</h1>
        <p className="mt-2 text-muted-foreground">
          End-to-end system design flow for what happens when a user uploads a
          new photo—from the client request through API gateway, storage, database,
          and asynchronous downstream updates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={stepIconClass}>
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Overview</CardTitle>
              <CardDescription>
                Eight steps from client POST to feed and search updates
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            The flow combines synchronous handling (gateway → load balancer →
            Post Service → object storage → database → client response) with
            asynchronous processing (Kafka → graph DB, search index, user feeds)
            so the upload stays fast while followers and search stay up to date.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {steps.map(({ step, title, icon: Icon, description, details }) => (
          <Card key={step}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-semibold text-primary">
                  {step}
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div className={stepIconClass}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                {details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </main>
);

export default InstagramPage;
