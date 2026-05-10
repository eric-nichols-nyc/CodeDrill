import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "../mocks/server";
import { useFetch } from "./use-fetch";

describe("useFetch", () => {
  it("starts in loading state", () => {
    const { result } = renderHook(() => useFetch("/api/users"));
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("fetches data successfully", async () => {
    const { result } = renderHook(() => useFetch("/api/users"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual([
      { id: 1, name: "John" },
      { id: 2, name: "Jane" },
    ]);
    expect(result.current.error).toBeNull();
  });

  it("handles fetch errors", async () => {
    // Override handler for this test
    server.use(
      http.get("/api/users", () => new HttpResponse(null, { status: 500 }))
    );

    const { result } = renderHook(() => useFetch("/api/users"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toContain("500");
  });

  it("refetches data when refetch is called", async () => {
    let callCount = 0;
    server.use(
      http.get("/api/counter", () => {
        callCount++;
        return HttpResponse.json({ count: callCount });
      })
    );

    const { result } = renderHook(() => useFetch("/api/counter"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ count: 1 });

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.data).toEqual({ count: 2 });
    });
  });
});
