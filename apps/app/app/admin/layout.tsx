import { AdminChatLayout } from "@/features/admin-chat-layout/components/admin-chat-layout";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminChatLayout>{children}</AdminChatLayout>;
}
