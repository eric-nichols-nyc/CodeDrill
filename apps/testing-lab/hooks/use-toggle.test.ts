import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useToggle } from "./use-toggle";

describe("useToggle", () => {
  it("initializes with false by default", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  it("initializes with provided value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it("toggles value", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.toggle());
    expect(result.current.value).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.value).toBe(false);
  });

  it("setTrue sets value to true", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);
    // Calling again should keep it true
    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);
  });

  it("setFalse sets value to false", () => {
    const { result } = renderHook(() => useToggle(true));
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
    // Calling again should keep it false
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
  });

  it("setValue sets arbitrary value", () => {
    const { result } = renderHook(() => useToggle(false));
    act(() => result.current.setValue(true));
    expect(result.current.value).toBe(true);
    act(() => result.current.setValue(false));
    expect(result.current.value).toBe(false);
  });
});
