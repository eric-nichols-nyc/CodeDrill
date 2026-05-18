import type {
  AdminChatMessage,
  AdminChatModel,
} from "@/features/admin-chat-layout/lib/admin-chat-types";

const id = () => crypto.randomUUID();

export const adminChatModels: AdminChatModel[] = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o",
    name: "GPT-4o",
    providers: ["openai", "azure"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    providers: ["openai", "azure"],
  },
  {
    chef: "Anthropic",
    chefSlug: "anthropic",
    id: "claude-sonnet-4-20250514",
    name: "Claude 4 Sonnet",
    providers: ["anthropic", "azure", "google", "amazon-bedrock"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "gemini-2.0-flash-exp",
    name: "Gemini 2.0 Flash",
    providers: ["google"],
  },
];

export const adminChatChefs = ["OpenAI", "Anthropic", "Google"];

export const adminChatSuggestions = [
  "Draft a clearer problem statement",
  "Suggest edge-case test cases",
  "Improve hint wording for beginners",
  "Review difficulty classification",
  "Write example input/output pairs",
  "Check slug and title consistency",
];

export const adminChatMockResponses = [
  "Static AI response for now. Later this can call the admin assistant endpoint.",
  "Here is a concise rewrite you could use for the problem description. Focus on constraints first, then examples.",
  "For test cases, include at least one minimal example, one typical case, and one edge case that exercises boundary conditions.",
  "The hint could guide the reader toward the invariant without revealing the full solution approach.",
];

export const adminChatInitialMessages: AdminChatMessage[] = [
  {
    from: "user",
    key: id(),
    versions: [
      {
        content: "Help me tighten the wording for a two-pointer problem.",
        id: id(),
      },
    ],
  },
  {
    from: "assistant",
    key: id(),
    sources: [
      {
        href: "https://react.dev/learn",
        title: "Problem authoring guide (static)",
      },
    ],
    tools: [
      {
        description: "Searching problem admin docs",
        error: undefined,
        name: "mcp",
        parameters: {
          query: "two-pointer problem statement best practices",
          source: "codedrill-admin",
        },
        result: `{
  "query": "two-pointer problem statement best practices",
  "results": [
    {
      "title": "State constraints early",
      "snippet": "Lead with input bounds, uniqueness guarantees, and expected time complexity."
    },
    {
      "title": "Examples before hints",
      "snippet": "Provide at least one walkthrough example before optional hints."
    }
  ]
}`,
        status: "input-available",
      },
    ],
    versions: [
      {
        content: `## Problem wording tips

When authoring a two-pointer problem:

1. **State the array properties** (sorted, non-decreasing, distinct values, etc.)
2. **Define the target** in one sentence
3. **Add examples** with explanation of why the answer is correct
4. **Mention acceptable complexity** if relevant

Would you like me to draft a full statement from your rough notes?`,
        id: id(),
      },
    ],
  },
  {
    from: "user",
    key: id(),
    versions: [
      {
        content: "Can you suggest three test cases for a sliding window problem?",
        id: id(),
      },
      {
        content:
          "I need test cases that cover empty input, a single-element window, and maximum window size.",
        id: id(),
      },
    ],
  },
  {
    from: "assistant",
    key: id(),
    reasoning: {
      content: `The user wants test cases for sliding window. I should cover:
- empty or minimal input
- window size of 1
- window spanning the full array
Each case should state input, expected output, and why it matters.`,
      duration: 8,
    },
    versions: [
      {
        content: `### Suggested test cases

1. **Empty array** — verifies the solution handles \`n = 0\` without errors.
2. **Window size 1** — each element is its own window; catches off-by-one in window bounds.
3. **Window equals array length** — only one valid window; ensures aggregation over the full range works.

Static demo only — connect the admin assistant endpoint to generate cases from live problem JSON.`,
        id: id(),
      },
    ],
  },
];
