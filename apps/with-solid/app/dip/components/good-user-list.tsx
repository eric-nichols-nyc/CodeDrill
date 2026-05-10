"use client";

import { Card, CardContent } from "@repo/design-system/components/ui/card";
import { useEffect, useState } from "react";

/**
 * ✅ GOOD: Depends on abstraction (Storage interface)
 * Easy to test, easy to swap implementations
 */
type Storage = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
};

type GoodUserListProps = {
  storage?: Storage;
};

export const GoodUserList = ({ storage = localStorage }: GoodUserListProps) => {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    // Depends on abstraction, not concrete implementation
    const stored = storage.getItem("users");
    if (stored) {
      setUsers(JSON.parse(stored));
    }
  }, [storage]);

  const addUser = (name: string) => {
    const newUsers = [...users, name];
    setUsers(newUsers);
    // Depends on abstraction
    storage.setItem("users", JSON.stringify(newUsers));
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

// Easy to create mock storage for testing
export const createMockStorage = (): Storage => {
  const data: Record<string, string> = {};
  return {
    getItem: (key: string) => data[key] || null,
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
  };
};
