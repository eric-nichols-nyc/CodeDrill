import { useCallback, useState } from "react";

type UseCounterOptions = {
  min?: number;
  max?: number;
  step?: number;
};

export function useCounter(initialValue = 0, options: UseCounterOptions = {}) {
  const {
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY,
    step = 1,
  } = options;

  const [count, setCount] = useState(() =>
    Math.min(Math.max(initialValue, min), max)
  );

  const increment = useCallback(() => {
    setCount((prev) => Math.min(prev + step, max));
  }, [step, max]);

  const decrement = useCallback(() => {
    setCount((prev) => Math.max(prev - step, min));
  }, [step, min]);

  const reset = useCallback(() => {
    setCount(Math.min(Math.max(initialValue, min), max));
  }, [initialValue, min, max]);

  const set = useCallback(
    (value: number) => {
      setCount(Math.min(Math.max(value, min), max));
    },
    [min, max]
  );

  return { count, increment, decrement, reset, set };
}
