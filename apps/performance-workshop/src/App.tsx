import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Calculations } from "./pages/Calculations";
import { CodeSplitting, CodeSplittingIndex } from "./pages/CodeSplitting";
import { CodeSplittingWithLazy } from "./pages/CodeSplittingWithLazy";
import { ConcurrentRendering } from "./pages/ConcurrentRendering";
import { Context } from "./pages/Context";
import { Elements } from "./pages/Elements";
import { Home } from "./pages/Home";
import { Rerenders } from "./pages/Rerenders";
import { Windowing } from "./pages/Windowing";

// Lazy-load the no-lazy route so globe + JSON aren't in the main bundle when you're on with-lazy
const CodeSplittingNoLazy = lazy(() =>
  import("./pages/CodeSplittingNoLazy").then((m) => ({
    default: m.CodeSplittingNoLazy,
  }))
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Home />} index />
          <Route element={<Elements />} path="elements" />
          <Route element={<Context />} path="context" />
          <Route
            element={<ConcurrentRendering />}
            path="concurrent-rendering"
          />
          <Route element={<CodeSplitting />} path="code-splitting">
            <Route element={<CodeSplittingIndex />} index />
            <Route element={<CodeSplittingWithLazy />} path="with-lazy" />
            <Route
              element={
                <Suspense
                  fallback={<div style={{ padding: "1rem" }}>Loading...</div>}
                >
                  <CodeSplittingNoLazy />
                </Suspense>
              }
              path="no-lazy"
            />
          </Route>
          <Route element={<Calculations />} path="calculations" />
          <Route element={<Windowing />} path="windowing" />
          <Route element={<Rerenders />} path="rerenders" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
