"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/design-system/components/ui/select";
import type { DemoUser } from "@/components/user-detail";
import { type FormEvent, useState } from "react";

const ROLE_OPTIONS = ["INTERN", "ENGINEER", "ADMIN"] as const;

type CreateUserFormProps = {
  readonly apiBase: string;
  readonly onCreated: (user: DemoUser) => void;
};

async function createUserRequest(
  baseUrl: string,
  input: { name: string; email: string; role: string },
): Promise<DemoUser> {
  const res = await fetch(`${baseUrl}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    let message = res.statusText;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message: unknown }).message === "string"
    ) {
      message = (data as { message: string }).message;
    } else if (
      Array.isArray((data as { message?: unknown })?.message) &&
      typeof (data as { message: string[] }).message[0] === "string"
    ) {
      message = (data as { message: string[] }).message[0];
    }
    throw new Error(message);
  }
  if (
    typeof data !== "object" ||
    data === null ||
    typeof (data as DemoUser).id !== "number"
  ) {
    throw new Error("Unexpected response from API.");
  }
  return data as DemoUser;
}

export const CreateUserForm = ({ apiBase, onCreated }: CreateUserFormProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>(ROLE_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    createUserRequest(apiBase, { name, email, role })
      .then((user) => {
        onCreated(user);
        setName("");
        setEmail("");
        setRole(ROLE_OPTIONS[0]);
      })
      .catch((err: unknown) => {
        setFormError(err instanceof Error ? err.message : "Request failed");
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <form
      className="space-y-4 rounded-md border bg-muted/10 p-4"
      onSubmit={handleSubmit}
    >
      <h3 className="font-medium text-foreground text-sm">Create user</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="create-user-name">Name</Label>
          <Input
            autoComplete="name"
            id="create-user-name"
            name="name"
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Ada Lovelace"
            required
            value={name}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="create-user-email">Email</Label>
          <Input
            autoComplete="email"
            id="create-user-email"
            inputMode="email"
            name="email"
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="ada@example.com"
            required
            type="email"
            value={email}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="create-user-role">Role</Label>
          <Select onValueChange={setRole} value={role}>
            <SelectTrigger className="w-full" id="create-user-role">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {formError !== null ? (
        <p className="text-destructive text-sm" role="alert">
          {formError}
        </p>
      ) : null}
      <Button disabled={submitting} type="submit">
        {submitting ? "Creating…" : "Create user"}
      </Button>
    </form>
  );
};
