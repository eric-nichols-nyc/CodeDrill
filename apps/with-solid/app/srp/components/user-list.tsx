type User = {
  id: string;
  displayName?: string;
  email: string;
};

type UserListProps = {
  users: User[];
};

/**
 * Component responsible ONLY for displaying the user list
 */
export function UserList({ users }: UserListProps) {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Users</h3>
      {users.map((user) => (
        <div className="rounded border p-2" key={user.id}>
          <p className="font-medium">{user.displayName}</p>
          <p className="text-muted-foreground text-sm">{user.email}</p>
        </div>
      ))}
    </div>
  );
}
