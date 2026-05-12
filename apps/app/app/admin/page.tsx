import { AdminPageShell } from "./admin-page-shell";
import { getNeonAuth } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const { session } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/admin");
  }

  return (
    <AdminPageShell />
  );
}
