"use client";

import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport } from "ai";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { getProblemChatMessages } from "../lib/problem-chat-api";
import { isProblemChatApiError } from "../lib/problem-chat-errors";
import { problemChatKeys } from "../lib/problem-chat-keys";
import {
  historyDtoToUiMessages,
  problemChatStreamApiPath,
} from "../lib/problem-chat-ui-messages";
import type { GetProblemChatMessagesResponse } from "../lib/problem-chat-types";

function mapSubmitStatus(
  status: "submitted" | "streaming" | "ready" | "error"
): "submitted" | "streaming" | "error" | undefined {
  if (status === "submitted") {
    return "submitted";
  }
  if (status === "streaming") {
    return "streaming";
  }
  if (status === "error") {
    return "error";
  }
  return;
}

function canSendMessage(
  problemId: string | undefined,
  status: "submitted" | "streaming" | "ready" | "error"
): boolean {
  if (!problemId) {
    return false;
  }
  return status !== "submitted" && status !== "streaming";
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
  const hydratedProblemIdRef = useRef<string | null>(null);

  const historyQuery = useQuery({
    queryKey: problemChatKeys.messages(problemId ?? ""),
    queryFn: () => {
      if (!problemId) {
        throw new Error("Missing problem id");
      }
      return getProblemChatMessages(problemId);
    },
    enabled: Boolean(problemId),
    initialData: options?.initialData,
    retry: (failureCount) => failureCount < 1,
  });

  const transport = useMemo(() => {
    if (!problemId) {
      return new DefaultChatTransport({
        api: "/api/problems/__missing__/chat/stream",
      });
    }

    return new DefaultChatTransport({
      api: problemChatStreamApiPath(problemId),
    });
  }, [problemId]);

  const syncHistoryToCache = useCallback(
    (data: GetProblemChatMessagesResponse) => {
      if (!problemId) {
        return;
      }

      queryClient.setQueryData(problemChatKeys.messages(problemId), data);
    },
    [problemId, queryClient]
  );

  const {
    messages,
    sendMessage: sendChatMessage,
    setMessages,
    status,
    error: chatError,
  } = useChat({
    id: problemId ?? "problem-chat-no-id",
    transport,
    onFinish: async () => {
      if (!problemId) {
        return;
      }

      try {
        const fresh = await getProblemChatMessages(problemId);
        syncHistoryToCache(fresh);
        setMessages(historyDtoToUiMessages(fresh.messages));
      } catch {
        // Keep streamed messages visible if refresh fails.
      }
    },
  });

  useEffect(() => {
    if (!problemId) {
      hydratedProblemIdRef.current = null;
      setMessages([]);
      return;
    }

    if (historyQuery.isPending) {
      return;
    }

    if (hydratedProblemIdRef.current === problemId) {
      return;
    }

    setMessages(historyDtoToUiMessages(historyQuery.data?.messages ?? []));
    hydratedProblemIdRef.current = problemId;
  }, [
    problemId,
    historyQuery.isPending,
    historyQuery.data?.messages,
    setMessages,
  ]);

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text) {
        return;
      }
      if (!canSendMessage(problemId, status)) {
        return;
      }

      await sendChatMessage({ text });
    },
    [problemId, sendChatMessage, status]
  );

  const activeError = chatError ?? historyQuery.error;
  const isSending = status === "submitted" || status === "streaming";
  const submitStatus = mapSubmitStatus(status);

  return {
    messages,
    isLoadingHistory: historyQuery.isPending && !historyQuery.data,
    isSending,
    error: activeError ? errorMessage(activeError) : null,
    sendMessage,
    submitStatus,
    canSend: canSendMessage(problemId, status),
    hasProblemId: Boolean(problemId),
  };
}
