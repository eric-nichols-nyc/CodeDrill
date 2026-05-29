"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import type { ProblemChatSessionSummary } from "../lib/chat-session-types";
import { createProblemChatThread, listProblemChatThreads } from "../lib/problem-chat-api";
import { problemChatKeys } from "../lib/problem-chat-keys";
import type { GetProblemChatMessagesResponse } from "../lib/problem-chat-types";

type UseChatSessionsOptions = {
  historyEnabled: boolean;
};

export function useChatSessions(
  problemId: string | undefined,
  options: UseChatSessionsOptions
) {
  const queryClient = useQueryClient();
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const trackedProblemIdRef = useRef(problemId);

  if (trackedProblemIdRef.current !== problemId) {
    trackedProblemIdRef.current = problemId;
    if (activeThreadId !== null) {
      setActiveThreadId(null);
    }
  }

  const threadsQuery = useQuery({
    queryKey: problemChatKeys.threads(problemId ?? ""),
    queryFn: () => {
      if (!problemId) {
        throw new Error("Missing problem id");
      }
      return listProblemChatThreads(problemId);
    },
    enabled: Boolean(problemId) && options.historyEnabled,
  });

  const invalidateThreadsIfLoaded = useCallback(async () => {
    if (!problemId) {
      return;
    }

    const threadsState = queryClient.getQueryState(
      problemChatKeys.threads(problemId)
    );
    if (threadsState?.fetchStatus === "idle" && threadsState.dataUpdatedAt === 0) {
      return;
    }

    await queryClient.invalidateQueries({
      queryKey: problemChatKeys.threads(problemId),
    });
  }, [problemId, queryClient]);

  const createNewThread = useCallback(async () => {
    if (!problemId) {
      return;
    }

    const { thread } = await createProblemChatThread(problemId);
    const emptyHistory: GetProblemChatMessagesResponse = {
      thread: {
        id: thread.id,
        userId: "",
        problemId,
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
      },
      messages: [],
    };

    queryClient.setQueryData(
      problemChatKeys.messages(problemId, thread.id),
      emptyHistory
    );
    setActiveThreadId(thread.id);
    await invalidateThreadsIfLoaded();
  }, [invalidateThreadsIfLoaded, problemId, queryClient]);

  const selectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
  }, []);

  const threads: ProblemChatSessionSummary[] =
    threadsQuery.data?.threads ?? [];

  return {
    activeThreadId,
    setActiveThreadId,
    threads,
    isLoadingThreads: threadsQuery.isPending && options.historyEnabled,
    createNewThread,
    selectThread,
  };
}
