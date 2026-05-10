import { useCallback, useRef, useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Track if we should skip syncing to localStorage (after removeValue)
  const skipSync = useRef(false);

  // Get stored value or use initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        // Sync to localStorage immediately
        if (typeof window !== "undefined") {
          try {
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
          } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
          }
        }
        return valueToStore;
      });
    },
    [key]
  );

  const removeValue = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.removeItem(key);
      skipSync.current = true;
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue };
}
