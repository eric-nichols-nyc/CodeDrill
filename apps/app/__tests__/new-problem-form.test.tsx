import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NewProblemForm } from "@/app/admin/new-problem-form";

const refreshMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: refreshMock,
  }),
}));

describe("NewProblemForm", () => {
  beforeEach(() => {
    refreshMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows required field indicators for core required fields", () => {
    const { container } = render(<NewProblemForm />);

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Slug (unique)")).toBeInTheDocument();
    expect(screen.getByText("Difficulty")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getAllByText("*").length).toBeGreaterThanOrEqual(6);
    expect(container).toHaveTextContent("Required fields");
  });

  it("adds repeatable rows for tags and starter code", () => {
    render(<NewProblemForm />);

    expect(screen.getAllByText(/Starter \d+/)).toHaveLength(1);
    expect(screen.getAllByLabelText(/Code/)).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Add starter" }));
    fireEvent.click(screen.getByRole("button", { name: "Add tag" }));

    expect(screen.getAllByText(/Starter \d+/)).toHaveLength(2);
    expect(screen.getAllByLabelText(/Code/)).toHaveLength(2);
    expect(screen.getByPlaceholderText("two-pointers")).toBeInTheDocument();
  });

  it("submits nested problem content through the admin endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ id: "problem-123" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<NewProblemForm />);

    fireEvent.change(screen.getByLabelText(/Title/), {
      target: { value: "Valid Palindrome" },
    });
    fireEvent.change(screen.getByLabelText(/Slug/), {
      target: { value: "valid-palindrome" },
    });
    fireEvent.change(screen.getByLabelText(/Description/), {
      target: { value: "Determine whether a string is a palindrome." },
    });
    fireEvent.change(screen.getAllByLabelText(/Code/)[0], {
      target: { value: "function isPalindrome(s) { return true; }" },
    });
    fireEvent.change(screen.getByLabelText(/Function name/), {
      target: { value: "isPalindrome" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add tag" }));
    fireEvent.change(screen.getByPlaceholderText("two-pointers"), {
      target: { value: "string" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add hint" }));
    fireEvent.change(screen.getByLabelText(/Title \(optional\)/), {
      target: { value: "Normalize first" },
    });
    fireEvent.change(screen.getByLabelText(/^Body$/), {
      target: { value: "Strip non-alphanumeric characters before checking." },
    });

    fireEvent.click(screen.getByRole("button", { name: "Add testcase" }));
    fireEvent.change(screen.getByLabelText(/^Input$/), {
      target: { value: 's = "A man, a plan, a canal: Panama"' },
    });
    fireEvent.change(screen.getByLabelText(/Expected output/), {
      target: { value: "true" },
    });
    fireEvent.click(screen.getByLabelText(/Sample testcase/));

    fireEvent.click(screen.getByRole("button", { name: "Create problem" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    const [url, options] = fetchMock.mock.calls[0] as [
      string,
      { body: string; method: string }
    ];
    const payload = JSON.parse(options.body);

    expect(url).toBe("/api/admin/problems");
    expect(options.method).toBe("POST");
    expect(payload).toMatchObject({
      title: "Valid Palindrome",
      slug: "valid-palindrome",
      description: "Determine whether a string is a palindrome.",
      starterCode: [
        {
          language: "javascript",
          code: "function isPalindrome(s) { return true; }",
          functionName: "isPalindrome",
        },
      ],
      tags: ["string"],
      hints: [
        {
          title: "Normalize first",
          body: "Strip non-alphanumeric characters before checking.",
        },
      ],
      testCases: [
        {
          input: 's = "A man, a plan, a canal: Panama"',
          expectedOutput: "true",
          isSample: true,
        },
      ],
    });
    await waitFor(() => {
      expect(refreshMock).toHaveBeenCalledTimes(1);
    });
    expect(await screen.findByText("Problem created.")).toBeInTheDocument();
  });
});
