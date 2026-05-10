"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/design-system/components/ui/tabs";
import { ComponentCodeLayout } from "@/components/component-code-layout";
import { SplitLayout } from "@/components/split-layout";
import { AdvancedBadApi } from "./components/advanced-bad-api";
import { AdvancedGoodApi } from "./components/advanced-good-api";
import { BadUserList } from "./components/bad-user-list";
import { GoodUserList } from "./components/good-user-list";

const badCode = `"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@repo/design-system/components/ui/card";

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
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {users.map((user, i) => (
            <div key={i} className="p-2 border rounded">
              {user}
            </div>
          ))}
        </div>
        <button
          onClick={() => addUser(\`User \${users.length + 1}\`)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
        >
          Add User
        </button>
      </CardContent>
    </Card>
  );
};`;

const goodCode = `"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@repo/design-system/components/ui/card";

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
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          {users.map((user, i) => (
            <div key={i} className="p-2 border rounded">
              {user}
            </div>
          ))}
        </div>
        <button
          onClick={() => addUser(\`User \${users.length + 1}\`)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded"
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
};`;

const advancedBadCode = `"use client";

/**
 * ❌ BAD: Depends on concrete implementation (fetch API)
 * Hard to test, hard to swap implementations
 */
export const AdvancedBadApi = () => {
  const fetchData = async () => {
    // Direct dependency on fetch API
    const response = await fetch("https://api.example.com/data");
    const json = await response.json();
    setData(JSON.stringify(json));
  };

  return <div>...</div>;
};`;

const advancedGoodCode = `// HttpAdapter Interface (abstraction)
type HttpAdapter = {
  get: (url: string) => Promise<any>;
  post: (url: string, data: any) => Promise<any>;
};

// HttpClient depends on abstraction
export class HttpClient {
  constructor(private adapter: HttpAdapter) {}

  async get(url: string) {
    return this.adapter.get(url);
  }
}

// FetchAdapter - concrete implementation
export class FetchAdapter implements HttpAdapter {
  async get(url: string) {
    const response = await fetch(url);
    return response.json();
  }

  async post(url: string, data: any) {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// MockAdapter - for testing
export class MockAdapter implements HttpAdapter {
  async get(url: string) {
    return { data: "Mock data", timestamp: Date.now() };
  }

  async post(url: string, data: any) {
    return { success: true, data };
  }
}

// Usage - can swap implementations easily
const httpClient = new HttpClient(new FetchAdapter());
// or
const mockClient = new HttpClient(new MockAdapter());`;

const DIPPage = () => (
  <div className="flex min-h-[calc(100vh-4rem)] flex-col">
    <div className="shrink-0 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dependency Inversion Principle</CardTitle>
          <CardDescription>
            Depend on abstractions, not concretions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="mb-2 font-semibold">Definition</h3>
            <p className="text-muted-foreground text-sm">
              The Dependency Inversion Principle states that high-level modules
              should not depend on low-level modules. Both should depend on
              abstractions. Abstractions should not depend on details; details
              should depend on abstractions.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">Benefits</h3>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground text-sm">
              <li>Reduced coupling between modules</li>
              <li>Easier to test and mock</li>
              <li>More flexible architecture</li>
              <li>Better code reusability</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="flex-1 p-6 pt-0">
      <Tabs className="flex h-full flex-col" defaultValue="basic">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Examples</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Examples</TabsTrigger>
        </TabsList>
        <TabsContent className="min-h-0 flex-1" value="basic">
          <SplitLayout
            left={
              <ComponentCodeLayout
                code={badCode}
                component={<BadUserList />}
                description="Directly depends on localStorage - hard to test or swap"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={goodCode}
                component={<GoodUserList />}
                description="Depends on Storage abstraction - easy to test and swap implementations"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
        <TabsContent className="min-h-0 flex-1" value="advanced">
          <SplitLayout
            left={
              <ComponentCodeLayout
                code={advancedBadCode}
                component={<AdvancedBadApi />}
                description="Direct dependency on fetch API - hard to test or swap"
                title="❌ Bad Component"
              />
            }
            right={
              <ComponentCodeLayout
                code={advancedGoodCode}
                component={<AdvancedGoodApi />}
                description="Depends on HttpAdapter abstraction - easy to test and swap implementations"
                title="✅ Good Component"
              />
            }
          />
        </TabsContent>
      </Tabs>
    </div>
  </div>
);

export default DIPPage;
