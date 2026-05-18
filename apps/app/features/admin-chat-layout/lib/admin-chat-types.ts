export type AdminChatRole = "user" | "assistant";

export type AdminChatMessage = {
  id: string;
  role: AdminChatRole;
  content: string;
  createdAt: Date;
};
