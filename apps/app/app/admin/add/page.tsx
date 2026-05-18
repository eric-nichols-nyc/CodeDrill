import { redirect } from "next/navigation";
import { AdminAddProblemPage } from "@/features/admin/components/admin-add-problem-page";
import { getNeonAuth } from "@/lib/auth/server";

export default async function AdminAddPage() {
  const { session } = await getNeonAuth();

  if (!session) {
    redirect("/auth/sign-in?next=/admin/add");
  }

  return <AdminAddProblemPage />;
}
