"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type AuthStatus = "loading" | "authorized" | "unauthorized";

export default function ProtectedPage() {
  const [user, setUser] = useState<{ userId: number; email?: string } | null>(
    null
  );
  const [status, setStatus] = useState<AuthStatus>("loading");

  useEffect(() => {
    async function fetchProtected() {
      const res = await fetch("http://localhost:4000/api/protected", {
        credentials: "include",
      });

      if (!res.ok) {
        setStatus("unauthorized");
        return;
      }

      const data = await res.json();
      setUser(data.user);
      setStatus("authorized");
    }

    fetchProtected();
  }, []);

  if (status === "loading") {
    return (
      <div>
        <h1>Protected Page</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div>
        <Link href="/">Go to Home</Link>
        <h1>Protected Page</h1>
        <p>User is not authorized.</p>
        <Link href="/sign-in">Sign in</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>Protected Page</h1>
      {user ? <p>User ID: {user.userId}</p> : null}
      <Link href="/">Go to Home</Link>
    </div>
  );
}
