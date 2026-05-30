"use client";

import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";

export function TanstackDevtools() {
  return (
    <TanStackDevtools
      config={{
        hideUntilHover: true,
        position: "bottom-right",
      }}
      plugins={[
        {
          defaultOpen: true,
          name: "TanStack Query",
          render: <ReactQueryDevtoolsPanel />,
        },
      ]}
    />
  );
}
