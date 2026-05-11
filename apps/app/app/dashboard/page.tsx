import { getNeonAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { session, user } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="font-semibold text-2xl">Dashboard</h1>

      <p className="text-gray-400">
        Authenticated:{" "}
        <span className={session ? "text-green-500" : "text-red-500"}>
          {session ? "Yes" : "No"}
        </span>
      </p>

      {user &&
      typeof user === "object" &&
      user !== null &&
      "id" in user ? (
        <p className="text-gray-400">
          User ID: {String((user as { id: unknown }).id)}
        </p>
      ) : null}

      <p className="font-medium text-gray-700 dark:text-gray-200">
        Session and User Data:
      </p>

      <pre className="overflow-x-auto rounded bg-gray-100 p-4 text-gray-800 text-sm dark:bg-gray-800 dark:text-gray-200">
        {JSON.stringify({ session, user }, null, 2)}
      </pre>
    </div>
  );
}
