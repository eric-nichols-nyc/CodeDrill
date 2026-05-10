"use client";

import * as React from "react";
import type { ActivityItem } from "@/lib/recentActivity";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString();
}

export function RecentActivityCSR() {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<ActivityItem[]>([]);
  const [userId, setUserId] = React.useState<string>("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/render-lab/api/recent-activity", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        if (cancelled) return;

        setUserId(json.userId);
        setItems(json.data);
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section style={{ border: "1px solid #ddd", padding: 16 }}>
      <h2>CSR: Recent Activity</h2>
      {loading && <div>Loading recent activity…</div>}
      {error && <div style={{ color: "red" }}>Error: {error}</div>}

      {!(loading || error) && (
        <>
          <div style={{ fontSize: 12 }}>demo_uid: {userId}</div>
          <ul>
            {items.map((a) => (
              <li key={a.id}>
                <strong>{a.message}</strong>
                <div style={{ fontSize: 12 }}>{formatTime(a.createdAt)}</div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
