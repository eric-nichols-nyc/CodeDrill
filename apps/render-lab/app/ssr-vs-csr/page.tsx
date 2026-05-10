import { getOrCreateDemoUserId } from "@/lib/demoUser";
import { getRecentActivityServer } from "@/lib/recentActivity";
import { ClientMetrics } from "./components/ClientMetrics";
import { RecentActivityCSR } from "./components/RecentActivityCSR";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString();
}

export default async function DashboardPage() {
  const userId = await getOrCreateDemoUserId();
  const ssrItems = await getRecentActivityServer(userId);

  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "40px auto",
        display: "grid",
        gap: 32,
      }}
    >
      <h1>SSR vs CSR Demo</h1>

      <section
        style={{
          border: "1px solid #ddd",
          padding: 20,
        }}
      >
        <h2>The Real Difference</h2>
        <div>====================================================</div>

        <h3>With CSR, the browser must:</h3>
        <ul>
          <li>Download JavaScript bundle</li>
          <li>Parse it</li>
          <li>Execute it</li>
          <li>Render React</li>
          <li>Fetch data</li>
          <li>Re-render</li>
        </ul>

        <p>That adds extra steps before meaningful content appears.</p>
        <div>====================================================</div>
        <div>====================================================</div>

        <h3>With SSR, the browser:</h3>
        <ul>
          <li>Gets ready-made HTML</li>
          <li>Paints it immediately</li>
          <li>Hydrates after</li>
        </ul>

        <p>SSR usually improves:</p>
        <ul>
          <li>
            <strong>FCP</strong>
          </li>
          <li>
            <strong>TTFB → Content gap</strong>
          </li>
          <li>
            <strong>Perceived performance</strong>
          </li>
        </ul>
        <div>====================================================</div>
      </section>

      <ClientMetrics />

      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <section style={{ border: "1px solid #ddd", padding: 16 }}>
          <h2>SSR: Recent Activity</h2>
          <div style={{ fontSize: 12 }}>demo_uid (server): {userId}</div>

          <ul>
            {ssrItems.map((a) => (
              <li key={a.id}>
                <strong>{a.message}</strong>
                <div style={{ fontSize: 12 }}>{formatTime(a.createdAt)}</div>
              </li>
            ))}
          </ul>
        </section>

        <RecentActivityCSR />
      </div>
    </main>
  );
}
