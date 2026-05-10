"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UsersResponse = {
  users: User[];
  timestamp: string;
};

const fetchUsers = async (): Promise<UsersResponse> => {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

const UsersPage = () => {
  const { data, error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/">
          <Button className="mb-4" variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>TanStack Query Example</CardTitle>
            <CardDescription>
              Data fetching with useQuery — automatic caching, background
              refetch, and error handling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <span className="font-medium text-sm">Status:</span>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </span>
                )}
                {isFetching && !isLoading && (
                  <span className="text-muted-foreground text-sm">
                    Refetching...
                  </span>
                )}
                {error && (
                  <span className="flex items-center gap-1 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    Error loading data
                  </span>
                )}
                {data && !isFetching && (
                  <span className="text-green-500 text-sm">Data loaded</span>
                )}
              </div>
            </div>

            {data && (
              <>
                <div className="rounded-lg border p-3">
                  <p className="text-muted-foreground text-sm">
                    Last updated: {data.timestamp}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-3 font-semibold">Users</h3>
                  <div className="space-y-2">
                    {data.users.map((user) => (
                      <div
                        className="flex items-center justify-between rounded border p-3"
                        key={user.id}
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-muted-foreground text-sm">
                            {user.email}
                          </p>
                        </div>
                        <span className="rounded bg-primary/10 px-2 py-1 text-xs">
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Button
              className="w-full"
              disabled={isFetching}
              onClick={() => refetch()}
              variant="outline"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              Refetch
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UsersPage;
