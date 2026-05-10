"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { CreateUserForm } from "@/components/create-user-form";
import { type DemoUser, UserDetail } from "@/components/user-detail";
import { useCallback, useEffect, useState } from "react";

const apiBase =
  process.env.NEXT_PUBLIC_NEST_API_URL ?? "http://127.0.0.1:3000";

async function loadUsersFromApi(baseUrl: string): Promise<DemoUser[]> {
  const res = await fetch(`${baseUrl}/users`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  const data: unknown = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Unexpected response shape from API.");
  }
  return data as DemoUser[];
}

const UsersDemoPage = () => {
  const [users, setUsers] = useState<DemoUser[] | null>(null);
  const [selectedUser, setSelectedUser] = useState<DemoUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    loadUsersFromApi(apiBase)
      .then((rows) => {
        if (cancelled) {
          return;
        }
        setUsers(rows);
        const first = rows[0];
        setSelectedUser(first === undefined ? null : first);
      })
      .catch((e: unknown) => {
        if (cancelled) {
          return;
        }
        setError(
          e instanceof Error
            ? e.message
            : "Could not reach nest-api. Is it running on port 3000?",
        );
        setUsers(null);
        setSelectedUser(null);
      })
      .finally(() => {
        if (cancelled) {
          return;
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleUserCreated = useCallback((user: DemoUser) => {
    setUsers((prev) => [...(prev ?? []), user]);
    setSelectedUser(user);
  }, []);

  const showList = !loading && error === null && (users?.length ?? 0) > 0;
  const showEmpty = !loading && error === null && users?.length === 0;
  const showWorkspace = !loading && error === null;

  return (
    <main className="p-8">
      <Card className="mx-auto max-w-5xl">
        <CardHeader>
          <CardTitle>Users demo</CardTitle>
          <CardDescription>
            Data from{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground text-xs">
              GET {apiBase}/users
            </code>{" "}
            and{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground text-xs">
              POST {apiBase}/users
            </code>
            . Start{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-foreground text-xs">
              nest-api
            </code>{" "}
            first (
            <code className="rounded bg-muted px-1 py-0.5 text-foreground text-xs">
              pnpm --filter nest-api dev
            </code>
            ). Click a user to view details; the first user loads by default.
            New users appear in the list and are selected after create.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading users…</p>
          ) : null}
          {error !== null ? (
            <p className="text-destructive text-sm" role="alert">
              {error}
            </p>
          ) : null}
          {showWorkspace ? (
            <CreateUserForm apiBase={apiBase} onCreated={handleUserCreated} />
          ) : null}
          {showEmpty ? (
            <p className="text-muted-foreground text-sm">No users returned.</p>
          ) : null}
          {showList ? (
            <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
              <div>
                <h3 className="mb-2 font-medium text-foreground text-sm">
                  Directory
                </h3>
                <ul className="divide-y overflow-hidden rounded-md border">
                  {(users ?? []).map((u) => {
                    const isSelected = selectedUser?.id === u.id;
                    return (
                      <li key={u.id}>
                        <button
                          className={cn(
                            "flex w-full flex-col gap-0.5 px-4 py-3 text-left text-sm transition-colors sm:flex-row sm:items-baseline sm:justify-between",
                            "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            isSelected ? "bg-muted/60" : "",
                          )}
                          onClick={() => setSelectedUser(u)}
                          type="button"
                        >
                          <div>
                            <span className="font-medium text-foreground">
                              {u.name}
                            </span>
                            <span className="text-muted-foreground">
                              {" "}
                              — {u.role}
                            </span>
                          </div>
                          <span className="text-muted-foreground">{u.email}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-foreground text-sm">
                  Selected user
                </h3>
                <UserDetail user={selectedUser} />
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
};

export default UsersDemoPage;
