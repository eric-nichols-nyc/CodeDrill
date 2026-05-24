export const problemChatKeys = {
  all: ["problem-chat"] as const,
  messages: (problemId: string) =>
    [...problemChatKeys.all, "messages", problemId] as const,
};
