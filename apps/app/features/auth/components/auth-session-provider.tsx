"use client";

import type { ApiAuthState } from "@/lib/auth/types";
import { createContext, type ReactNode, useContext } from "react";

const AuthSessionContext = createContext<ApiAuthState | null>(null);

export function AuthSessionProvider({
  initialAuth,
  children,
}: {
  initialAuth: ApiAuthState;
  children: ReactNode;
}) {
  return (
    <AuthSessionContext.Provider value={initialAuth}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useInitialAuthSession(): ApiAuthState | null {
  return useContext(AuthSessionContext);
}
