export const problemChatStarterSuggestions = [
  "Give me a hint",
  "What pattern is this?",
  "Explain the brute force solution",
] as const;

export type ProblemChatStarterSuggestion =
  (typeof problemChatStarterSuggestions)[number];
