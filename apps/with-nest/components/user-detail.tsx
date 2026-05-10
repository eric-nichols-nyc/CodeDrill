import { cn } from "@repo/design-system/lib/utils";

export type DemoUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type UserDetailProps = {
  readonly user: DemoUser | null;
};

export const UserDetail = ({ user }: UserDetailProps) => {
  if (user === null) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center">
        <p className="text-muted-foreground text-sm">
          No user selected. Click a row in the list.
        </p>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="user-detail-name"
      className="space-y-4 rounded-md border bg-muted/20 p-6"
    >
      <div>
        <h2
          className="font-semibold text-foreground text-lg tracking-tight"
          id="user-detail-name"
        >
          {user.name}
        </h2>
        <p className="text-muted-foreground text-sm">{user.role}</p>
      </div>
      <dl className="space-y-3 text-sm">
        <div className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
            ID
          </dt>
          <dd className="font-mono text-foreground">{user.id}</dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
            Email
          </dt>
          <dd>
            <a
              className={cn(
                "text-foreground underline-offset-4 hover:underline",
                "break-all",
              )}
              href={`mailto:${user.email}`}
            >
              {user.email}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="text-muted-foreground text-xs uppercase tracking-wide">
            Role
          </dt>
          <dd className="text-foreground">{user.role}</dd>
        </div>
      </dl>
    </section>
  );
};
