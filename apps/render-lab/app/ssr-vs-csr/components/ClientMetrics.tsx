"use client";

import * as React from "react";

export function ClientMetrics() {
  const firstClientRenderMs = React.useMemo(
    () => Math.round(performance.now()),
    []
  );

  const [mountedMs, setMountedMs] = React.useState<number | null>(null);

  React.useEffect(() => {
    setMountedMs(Math.round(performance.now()));
  }, []);

  return (
    <div style={{ border: "1px dashed #bbb", padding: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Live timing (client-side)
      </div>

      <ul style={{ paddingLeft: 18, fontSize: 14 }}>
        <li>
          <strong>First client render:</strong> ~{firstClientRenderMs}ms
        </li>
        <li>
          <strong>Mounted (useEffect):</strong>{" "}
          {mountedMs === null ? "…" : `~${mountedMs}ms`}
        </li>
      </ul>

      <div style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
        SSR content is already in the initial HTML. Hydration just activates it.
      </div>
    </div>
  );
}
