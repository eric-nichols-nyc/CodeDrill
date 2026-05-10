import { useState } from "react";
import Globe from "../components/globe";

export default function GlobeWithoutLazy() {
  const [showGlobe, setShowGlobe] = useState(false);
  return (
    <div className="code-split-demo">
      <h3>Bad: eager import</h3>
      <p style={{ color: "#888", fontSize: "0.9rem", marginTop: 0 }}>
        Globe is in the main bundle; page load pays the cost even if you never
        show it.
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
        {showGlobe ? <Globe /> : null}
      </div>
    </div>
  );
}
