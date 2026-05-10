import { useCallback, useEffect, useState } from "react";

type UseFetchState<T> = {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
};

export function useFetch<T>(url: string) {
  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null });

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({
        data: null,
        isLoading: false,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}
