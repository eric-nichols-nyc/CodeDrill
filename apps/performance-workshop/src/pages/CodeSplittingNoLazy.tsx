import GlobeWithoutLazy from "./GlobeWithoutLazy";

export function CodeSplittingNoLazy() {
  return (
    <>
      <p style={{ color: "#888", fontSize: "0.9rem" }}>
        Globe is in the bundle from the start; no new chunk when you check the box.
      </p>
      <GlobeWithoutLazy />
    </>
  );
}
