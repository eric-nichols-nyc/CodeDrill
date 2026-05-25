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
  activeThreadId: string | null,
  status: "submitted" | "streaming" | "ready" | "error"
): boolean {
  if (!problemId) {
    return false;
  }
  if (!activeThreadId) {
    return false;
  }
  return status !== "submitted" && status !== "streaming";
}

function parseJsonErrorMessage(text: string): string | undefined {
  try {
    const parsed = JSON.parse(text) as { error?: unknown; message?: unknown };
    if (typeof parsed.error === "string" && parsed.error.length > 0) {
      return parsed.error;
    }
    if (typeof parsed.message === "string" && parsed.message.length > 0) {
      return parsed.message;
    }
  } catch {
    // plain text
  }
  return;
}

function errorMessage(error: unknown): string {
  if (isProblemChatApiError(error)) {
    return error.userMessage;
  }
  if (error instanceof Error && error.message.length > 0) {
    return parseJsonErrorMessage(error.message) ?? error.message;
  }
  return "Something went wrong. Try again.";
}

export function useProblemChat(
  problemId: string | undefined,
  options?: {
    initialData?: GetProblemChatMessagesResponse;
    activeThreadId?: string | null;
    onActiveThreadResolved?: (threadId: string) => void;
  }
) {
  const queryClient = useQueryClient();
  const hydratedKeyRef = useRef<string | null>(null);
  const bootstrapResolvedRef = useRef(false);
  const activeThreadIdRef = useRef<string | null>(null);
  const trackedProblemIdRef = useRef(problemId);

  const activeThreadId = options?.activeThreadId ?? null;
  activeThreadIdRef.current = activeThreadId;

  if (trackedProblemIdRef.current !== problemId) {
    trackedProblemIdRef.current = problemId;
    bootstrapResolvedRef.current = false;
    hydratedKeyRef.current = null;
  }

  const onActiveThreadResolved = options?.onActiveThreadResolved;
  const initialData = options?.initialData;

  const historyQuery = useQuery({
    queryKey: problemChatKeys.messages(
      problemId ?? "",
      activeThreadId ?? undefined
    ),
    queryFn: () => {
      if (!problemId) {
        throw new Error("Missing problem id");
      }
      if (activeThreadId) {
        return getProblemChatMessages(problemId, activeThreadId);
      }
      return getProblemChatMessages(problemId);
    },
    enabled: Boolean(problemId),
    initialData: activeThreadId === null ? initialData : undefined,
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
      // Merge threadId into the default body (id, messages, trigger, …). A custom
      // prepareSendMessagesRequest replaces the whole body and drops messages.
      body: () => ({
        threadId: activeThreadIdRef.current ?? undefined,
      }),
    });
  }, [problemId]);

  const syncHistoryToCache = useCallback(
    (data: GetProblemChatMessagesResponse, threadId: string) => {
      if (!problemId) {
        return;
      }

      queryClient.setQueryData(
        problemChatKeys.messages(problemId, threadId),
        data
      );
    },
    [problemId, queryClient]
  );

  const chatId = activeThreadId
    ? `${problemId}:${activeThreadId}`
    : `pending:${problemId ?? "no-id"}`;

  const {
    messages,
    sendMessage: sendChatMessage,
    setMessages,
    status,
    error: chatError,
  } = useChat({
    id: chatId,
    transport,
    onFinish: async () => {
      if (!problemId) {
        return;
      }
      if (!activeThreadId) {
        return;
      }

      try {
        const fresh = await getProblemChatMessages(problemId, activeThreadId);
        syncHistoryToCache(fresh, activeThreadId);
        setMessages(historyDtoToUiMessages(fresh.messages));

        const threadsState = queryClient.getQueryState(
          problemChatKeys.threads(problemId)
        );
        if (
          threadsState?.fetchStatus !== "idle" ||
          threadsState.dataUpdatedAt > 0
        ) {
          await queryClient.invalidateQueries({
            queryKey: problemChatKeys.threads(problemId),
          });
        }
      } catch {
        // Keep streamed messages visible if refresh fails.
      }
    },
  });

  useEffect(() => {
    if (!problemId) {
      return;
    }
    if (activeThreadId !== null) {
      return;
    }
    if (bootstrapResolvedRef.current) {
      return;
    }

    if (historyQuery.isPending || !historyQuery.data) {
      return;
    }

    bootstrapResolvedRef.current = true;
    const { thread } = historyQuery.data;
    queryClient.setQueryData(
      problemChatKeys.messages(problemId, thread.id),
      historyQuery.data
    );
    onActiveThreadResolved?.(thread.id);
  }, [
    activeThreadId,
    historyQuery.data,
    historyQuery.isPending,
    onActiveThreadResolved,
    problemId,
    queryClient,
  ]);

  useEffect(() => {
    if (!problemId) {
      hydratedKeyRef.current = null;
      setMessages([]);
      return;
    }

    if (!activeThreadId) {
      return;
    }

    if (status === "submitted" || status === "streaming") {
      return;
    }

    hydratedKeyRef.current = null;
    setMessages([]);
  }, [activeThreadId, problemId, setMessages, status]);

  useEffect(() => {
    if (!problemId) {
      return;
    }
    if (!activeThreadId) {
      return;
    }

    if (status === "submitted" || status === "streaming") {
      return;
    }

    if (historyQuery.isPending) {
      return;
    }

    const hydrationKey = `${problemId}:${activeThreadId}`;
    if (hydratedKeyRef.current === hydrationKey) {
      return;
    }

    setMessages(historyDtoToUiMessages(historyQuery.data?.messages ?? []));
    hydratedKeyRef.current = hydrationKey;
  }, [
    activeThreadId,
    historyQuery.data?.messages,
    historyQuery.isPending,
    problemId,
    setMessages,
    status,
  ]);

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!text) {
        return;
      }
      if (!canSendMessage(problemId, activeThreadId, status)) {
        return;
      }

      await sendChatMessage(
        { text },
        { body: { threadId: activeThreadId ?? undefined } }
      );
    },
    [activeThreadId, problemId, sendChatMessage, status]
  );

  const activeError = chatError ?? historyQuery.error;
  const isSending = status === "submitted" || status === "streaming";
  const submitStatus = mapSubmitStatus(status);

  return {
    messages,
    isLoadingHistory:
      Boolean(problemId) &&
      (activeThreadId === null || (historyQuery.isPending && !historyQuery.data)),
    isSending,
    error: activeError ? errorMessage(activeError) : null,
    sendMessage,
    submitStatus,
    canSend: canSendMessage(problemId, activeThreadId, status),
    hasProblemId: Boolean(problemId),
    hasActiveThread: Boolean(activeThreadId),
  };
}
