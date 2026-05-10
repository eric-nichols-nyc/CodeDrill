import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCounter } from "./use-counter";

describe("useCounter", () => {
  it("initializes with default value of 0", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it("initializes with provided value", () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it("increments count", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.increment());
    expect(result.current.count).toBe(1);
  });

  it("decrements count", () => {
    const { result } = renderHook(() => useCounter(5));
    act(() => result.current.decrement());
    expect(result.current.count).toBe(4);
  });

  it("resets to initial value", () => {
    const { result } = renderHook(() => useCounter(10));
    act(() => result.current.increment());
    act(() => result.current.increment());
    act(() => result.current.reset());
    expect(result.current.count).toBe(10);
  });

  it("sets count to specific value", () => {
    const { result } = renderHook(() => useCounter(0));
    act(() => result.current.set(42));
    expect(result.current.count).toBe(42);
  });

  describe("with min/max bounds", () => {
    it("respects max boundary on increment", () => {
      const { result } = renderHook(() => useCounter(9, { max: 10 }));
      act(() => result.current.increment());
      expect(result.current.count).toBe(10);
      act(() => result.current.increment());
      expect(result.current.count).toBe(10);
    });

    it("respects min boundary on decrement", () => {
      const { result } = renderHook(() => useCounter(1, { min: 0 }));
      act(() => result.current.decrement());
      expect(result.current.count).toBe(0);
      act(() => result.current.decrement());
      expect(result.current.count).toBe(0);
    });

    it("clamps initial value to bounds", () => {
      const { result } = renderHook(() => useCounter(100, { min: 0, max: 10 }));
      expect(result.current.count).toBe(10);
    });

    it("clamps set value to bounds", () => {
      const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));
      act(() => result.current.set(100));
      expect(result.current.count).toBe(10);
      act(() => result.current.set(-100));
      expect(result.current.count).toBe(0);
    });
  });

  describe("with custom step", () => {
    it("increments by step amount", () => {
      const { result } = renderHook(() => useCounter(0, { step: 5 }));
      act(() => result.current.increment());
      expect(result.current.count).toBe(5);
    });

    it("decrements by step amount", () => {
      const { result } = renderHook(() => useCounter(10, { step: 3 }));
      act(() => result.current.decrement());
      expect(result.current.count).toBe(7);
    });
  });
});
