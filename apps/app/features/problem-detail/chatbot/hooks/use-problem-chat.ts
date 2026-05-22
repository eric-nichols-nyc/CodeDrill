"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import {
  getProblemChatMessages,
  postProblemChatMessage,
} from "../lib/problem-chat-api";
import { isProblemChatApiError } from "../lib/problem-chat-errors";
import { problemChatKeys } from "../lib/problem-chat-keys";
import type {
  GetProblemChatMessagesResponse,
  ProblemChatUiMessage,
} from "../lib/problem-chat-types";

function toUiMessages(
  messages: GetProblemChatMessagesResponse["messages"]
): ProblemChatUiMessage[] {
  return messages.flatMap((message) => {
    if (message.role !== "user" && message.role !== "assistant") {
      return [];
    }
    return [
      { id: message.id, role: message.role, content: message.content },
    ];
  });
}

function errorMessage(error: unknown): string {
  if (isProblemChatApiError(error)) {
    return error.userMessage;
  }
  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }
  return "Something went wrong. Try again.";
}

export function useProblemChat(
  problemId: string | undefined,
  options?: {
    initialData?: GetProblemChatMessagesResponse;
  }
) {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: problemChatKeys.messages(problemId ?? ""),
    queryFn: () => getProblemChatMessages(problemId!),
    enabled: Boolean(problemId),
    initialData: options?.initialData,
    retry: (failureCount) => failureCount < 1,
  });

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      postProblemChatMessage(problemId!, { content }),
    onSuccess: (response) => {
      if (!problemId) {
        return;
      }
      queryClient.setQueryData<GetProblemChatMessagesResponse>(
        problemChatKeys.messages(problemId),
        (prev) => ({
          thread: response.thread,
          messages: [
            ...(prev?.messages ?? []),
            response.userMessage,
            response.assistantMessage,
          ],
        })
      );
    },
  });

  const messages = useMemo(
    () => toUiMessages(historyQuery.data?.messages ?? []),
    [historyQuery.data?.messages]
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text || !problemId || sendMutation.isPending) {
        return;
      }
      await sendMutation.mutateAsync(text);
    },
    [problemId, sendMutation]
  );

  const activeError = sendMutation.error ?? historyQuery.error;

  const submitStatus = sendMutation.isPending
    ? ("submitted" as const)
    : sendMutation.isError
      ? ("error" as const)
      : undefined;

  const canSend = Boolean(problemId) && !sendMutation.isPending;

  return {
    messages,
    isLoadingHistory: historyQuery.isPending && !historyQuery.data,
    isSending: sendMutation.isPending,
    error: activeError ? errorMessage(activeError) : null,
    sendMessage,
    submitStatus,
    canSend,
    hasProblemId: Boolean(problemId),
  };
}
