export const problemChatKeys = {
  all: ["problem-chat"] as const,
  threads: (problemId: string) =>
    [...problemChatKeys.all, "threads", problemId] as const,
  messages: (problemId: string, threadId?: string) =>
    [
      ...problemChatKeys.all,
      "messages",
      problemId,
      threadId ?? "latest",
    ] as const,
};
