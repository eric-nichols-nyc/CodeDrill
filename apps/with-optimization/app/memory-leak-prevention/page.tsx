import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { AlertTriangle, ShieldCheck, Trash2 } from "lucide-react";

const causes = [
  {
    title: "Event listeners and subscriptions",
    description:
      "Adding listeners (window, document, custom events) or subscribing to observables without removing them when the component unmounts keeps references alive.",
  },
  {
    title: "Timers",
    description:
      "setInterval, setTimeout, or requestAnimationFrame that are not cleared in cleanup continue to run and can hold references to component state or DOM.",
  },
  {
    title: "Closures and refs",
    description:
      "Callbacks or closures that capture state or refs and are stored elsewhere (e.g. in a global store or passed to a long-lived subscriber) prevent GC from reclaiming that state.",
  },
  {
    title: "Uncanceled async work",
    description:
      "Promises or async operations that update state after unmount (setState on an unmounted component) or that never resolve can keep work and references in memory.",
  },
];

const practices = [
  "Return a cleanup function from useEffect: remove listeners, clear timers, cancel subscriptions.",
  "Use AbortController for fetch and pass signal to abort in-flight requests on unmount.",
  "Avoid storing component refs or state in module-level or long-lived objects without a way to clear them.",
  "Use refs for values that should not trigger re-renders and that you need in cleanup (e.g. latest callback without stale closure).",
  "For third-party libs (charts, maps), call their destroy/dispose API in useEffect cleanup.",
];

export default function MemoryLeakPreventionPage() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <CardTitle>Memory Leak Prevention</CardTitle>
            </div>
            <CardDescription>
              Common causes of memory leaks in React and how to prevent them
              with proper cleanup
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground text-sm">
              Memory leaks in single-page apps often come from not releasing
              resources when components unmount. Subscriptions, timers, and
              async work that outlive the component can keep references alive
              and grow memory over time.
            </p>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Common causes</h3>
              </div>
              <ul className="space-y-3">
                {causes.map((item) => (
                  <li
                    className="rounded border bg-muted/30 p-3"
                    key={item.title}
                  >
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="mt-1 text-muted-foreground text-sm">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Prevention and cleanup</h3>
              </div>
              <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
                {practices.map((practice) => (
                  <li key={practice}>{practice}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-muted/50 p-4 text-sm">
              <p className="font-medium">useEffect cleanup example</p>
              <pre className="mt-2 overflow-x-auto rounded bg-background p-3 text-xs">
                {`useEffect(() => {
  const controller = new AbortController();
  fetch(url, { signal: controller.signal }).then(/* ... */);

  const id = setInterval(() => {}, 1000);
  window.addEventListener("resize", handleResize);

  return () => {
    controller.abort();
    clearInterval(id);
    window.removeEventListener("resize", handleResize);
  };
}, [/* deps */]);`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
