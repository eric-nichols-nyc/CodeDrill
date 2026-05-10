"use client";

import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { useEffect, useState } from "react";

/**
 * ❌ BAD: Depends on concrete implementation (localStorage)
 * Hard to test, hard to swap implementations
 */
export const BadUserList = () => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    // Direct dependency on localStorage
    const stored = localStorage.getItem("users");
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  }, []);

  const addUser = (name: string) => {
    const newUsers = [...users, name];
    setUsers(newUsers);
    // Direct dependency on localStorage
    localStorage.setItem("users", JSON.stringify(newUsers));
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <div className="space-y-2">
          {users.map((user, i) => (
            <div className="rounded border p-2" key={i}>
              {user}
            </div>
          ))}
        </div>
        <button
          className="rounded bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => addUser(`User ${users.length + 1}`)}
        >
          Add User
        </button>
      </CardContent>
    </Card>
  );
};
