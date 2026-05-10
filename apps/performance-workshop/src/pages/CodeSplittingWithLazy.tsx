import { lazy, Suspense, useState } from "react";

const LazyGlobe = lazy(() => import("../components/globe"));

export function CodeSplittingWithLazy() {
  const [showGlobe, setShowGlobe] = useState(false);
  return (
    <>
      <p style={{ color: "#888", fontSize: "0.9rem" }}>
        Globe loads only when you check the box. Open Network tab and watch for
        a new JS chunk.
      </p>
      <label style={{ marginBottom: "1rem", display: "block" }}>
        <input
          checked={showGlobe}
          onChange={(e) => setShowGlobe(e.currentTarget.checked)}
          type="checkbox"
        />
        {" show globe"}
      </label>
      <div
        style={{
          width: 400,
          height: 400,
          border: "1px solid var(--border, #333)",
        }}
      >
        <Suspense
          fallback={
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#888" }}
            >
              loading...
            </div>
          }
        >
          {showGlobe ? <LazyGlobe /> : null}
        </Suspense>
      </div>
    </>
  );
}
