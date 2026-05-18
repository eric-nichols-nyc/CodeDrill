export type AdminChatStatus =
  | "submitted"
  | "streaming"
  | "ready"
  | "error";

export type AdminChatToolState =
  | "input-streaming"
  | "input-available"
  | "output-available"
  | "output-error";

export type AdminChatToolType = `tool-${string}`;

export type AdminChatMessageVersion = {
  id: string;
  content: string;
};

export type AdminChatSource = {
  href: string;
  title: string;
};

export type AdminChatTool = {
  name: string;
  description: string;
  status: AdminChatToolState;
  parameters: Record<string, unknown>;
  result: string | undefined;
  error: string | undefined;
};

export type AdminChatReasoning = {
  content: string;
  duration: number;
};

export type AdminChatMessage = {
  key: string;
  from: "user" | "assistant";
  sources?: AdminChatSource[];
  versions: AdminChatMessageVersion[];
  reasoning?: AdminChatReasoning;
  tools?: AdminChatTool[];
};

export type AdminChatModel = {
  id: string;
  name: string;
  chef: string;
  chefSlug: string;
  providers: string[];
};
