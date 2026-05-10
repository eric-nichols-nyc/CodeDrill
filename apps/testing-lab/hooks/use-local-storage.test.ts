import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current.value).toBe("initial");
  });

  it("returns stored value when localStorage has value", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored"));
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current.value).toBe("stored");
  });

  it("updates localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current.setValue("updated");
    });

    expect(result.current.value).toBe("updated");
    expect(JSON.parse(window.localStorage.getItem("test-key") || "")).toBe(
      "updated"
    );
  });

  it("supports functional updates", () => {
    const { result } = renderHook(() => useLocalStorage("count", 0));

    act(() => {
      result.current.setValue((prev) => prev + 1);
    });

    expect(result.current.value).toBe(1);

    act(() => {
      result.current.setValue((prev) => prev + 5);
    });

    expect(result.current.value).toBe(6);
  });

  it("removes value from localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    act(() => {
      result.current.setValue("stored");
    });

    expect(window.localStorage.getItem("test-key")).not.toBeNull();

    act(() => {
      result.current.removeValue();
    });

    expect(result.current.value).toBe("initial");
    expect(window.localStorage.getItem("test-key")).toBeNull();
  });

  it("handles complex objects", () => {
    const initialValue = { name: "John", age: 30 };
    const { result } = renderHook(() => useLocalStorage("user", initialValue));

    expect(result.current.value).toEqual(initialValue);

    act(() => {
      result.current.setValue({ name: "Jane", age: 25 });
    });

    expect(result.current.value).toEqual({ name: "Jane", age: 25 });
  });

  it("handles arrays", () => {
    const { result } = renderHook(() => useLocalStorage<string[]>("items", []));

    act(() => {
      result.current.setValue(["a", "b", "c"]);
    });

    expect(result.current.value).toEqual(["a", "b", "c"]);
  });
});
