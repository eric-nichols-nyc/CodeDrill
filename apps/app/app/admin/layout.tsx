import type { ReactNode } from "react";
import { AdminChatLayout } from "@/features/admin-chat-layout/components/admin-chat-layout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): ReactNode {
  return <AdminChatLayout>{children}</AdminChatLayout>;
}
