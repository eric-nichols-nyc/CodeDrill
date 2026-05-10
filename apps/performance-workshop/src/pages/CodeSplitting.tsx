import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const introStyles = {
  padding: "1rem 1.25rem",
  marginBottom: "1.5rem",
  background: "rgba(100, 108, 255, 0.08)",
  border: "1px solid rgba(100, 108, 255, 0.25)",
  borderRadius: 8,
  fontSize: "0.95rem",
  lineHeight: 1.6,
} as const;

export function CodeSplitting() {
  return (
    <div className="page">
      <h1>Code Splitting</h1>
      <div style={introStyles}>
        <p style={{ margin: "0 0 0.75rem" }}>
          👨‍💼 Our app has a neat Globe component that shows the user where they
          are on the globe. Cool right? It&apos;s super duper fun.
        </p>
        <p style={{ margin: "0 0 0.75rem" }}>
          But one day users started complaining the app is taking too long to
          load. We&apos;re using several sizeable libraries to have the really
          cool globe, but users only need to load it if they click the
          &quot;show globe&quot; button and loading it ahead of time makes the
          app load slower.
        </p>
        <p style={{ margin: "0 0 0.75rem" }}>
          So your job as a performance professional is to load the code
          on-demand so the user doesn&apos;t have to wait to see the checkbox.
        </p>
        <p style={{ margin: 0 }}>
          For this one, you&apos;ll need to open the solution in isolation and
          open the Chrome DevTools Network tab to watch the JavaScript chunks
          load when you click &quot;show globe.&quot; Your objective is to have
          the network load those same chunks so they&apos;re not in the bundle
          to begin with.
        </p>
        <p style={{ margin: "0.75rem 0 0", fontWeight: 600 }}>
          💰 Here&apos;s a quick tip: In the Network tab, there&apos;s a
          dropdown for artificially throttling your network speed. It defaults
          to &quot;Online&quot; but you can change it to &quot;Fast 3G&quot;,
          &quot;Slow 3G&quot;, etc.
        </p>
      </div>
      <Outlet />
    </div>
  );
}

export function CodeSplittingIndex() {
  return (
    <>
      <p>
        Lazy loading and dynamic imports for smaller bundles. Choose a version to compare:
      </p>
      <ul style={{ marginTop: "1rem", listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "0.5rem" }}>
          <Link to="/code-splitting/with-lazy" style={{ color: "#646cff" }}>
            With lazy — globe loads only when you check the box (new chunk in Network tab)
          </Link>
        </li>
        <li>
          <Link to="/code-splitting/no-lazy" style={{ color: "#646cff" }}>
            No lazy — globe is in the bundle from the start (heavier initial load)
          </Link>
        </li>
      </ul>
    </>
  );
}
