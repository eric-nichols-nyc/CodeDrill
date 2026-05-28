"use client";

import { createContext, type ReactNode, useContext } from "react";

type ClerkAuthSnapshot = {
  userId: string | null;
};

const ClerkAuthSnapshotContext = createContext<ClerkAuthSnapshot>({
  userId: null,
});

/** Server `auth().userId` from the root layout — used until Clerk client hydrates. */
export function ClerkAuthProvider({
  initialUserId,
  children,
}: {
  initialUserId: string | null;
  children: ReactNode;
}) {
  return (
    <ClerkAuthSnapshotContext.Provider value={{ userId: initialUserId }}>
      {children}
    </ClerkAuthSnapshotContext.Provider>
  );
}

export function useClerkAuthSnapshot(): ClerkAuthSnapshot {
  return useContext(ClerkAuthSnapshotContext);
}
