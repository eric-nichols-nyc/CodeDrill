import type { CreateProblemBody } from "../lib/create-problem-schema";

/** Deterministic copy for local testing; slug gets a unique suffix when applied. */
export function getDevSampleGroupAnagramsProblem(): CreateProblemBody {
  const suffix = Date.now();

  return {
    title: "Group Anagrams (dev sample)",
    slug: `group-anagrams-dev-${suffix}`,
    difficulty: "medium",
    description:
      "Given an array of strings strs, group the anagrams together. An anagram is formed by rearranging the letters of another string using all the original letters exactly once. The local runner compares JSON exactly: sort the strings inside each group alphabetically, then sort the groups by the lexicographically smallest string in each group (same as the sample outputs).",
    constraints:
      "1 <= strs.length <= 1000. 0 <= strs[i].length <= 100. strs[i] consists of lowercase English letters.",
    isPublished: false,

    patternSlug: "hash-map",
    loopStructure: "single-pass-with-map",
    skillFocus:
      "Use a hash map keyed by a canonical signature (sorted letters or a 26-length frequency tuple) to collect strings that share the same multiset of characters.",
    tutorLevel: "pattern-rep",
    visualizationNotes:
      "Each string maps to a key describing its character counts. All strings sharing a key belong in the same bucket; then normalize bucket order for the judge.",
    editorial: { content: "", embeds: [] },

    tags: ["array", "hash-table", "string", "sorting"],

    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
        explanation:
          "eat, tea, and ate are anagrams; tan and nat are anagrams; bat has no partners.",
      },
      {
        input: 'strs = [""]',
        output: "[[\"\"]]",
        explanation: "A single empty string forms one group.",
      },
      {
        input: 'strs = ["x"]',
        output: '[["x"]]',
        explanation: "A single character forms one group.",
      },
    ],

    starterCode: [
      {
        language: "javascript",
        code: [
          "function groupAnagrams(strs) {",
          "  // Return a list of groups; each group lists all strings that are anagrams of each other.",
          "  // Sort inside each group and sort groups by their smallest string (see problem description).",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "groupAnagrams",
      },
      {
        language: "typescript",
        code: [
          "function groupAnagrams(strs: string[]): string[][] {",
          "  // Return a list of groups; each group lists all strings that are anagrams of each other.",
          "  // Sort inside each group and sort groups by their smallest string (see problem description).",
          "  return [];",
          "}",
        ].join("\n"),
        functionName: "groupAnagrams",
      },
      {
        language: "python",
        code: [
          "def group_anagrams(strs: list[str]) -> list[list[str]]:",
          "    # Return a list of groups; each group lists all strings that are anagrams of each other.",
          "    # Sort inside each group and sort groups by their smallest string (see problem description).",
          "    return []",
        ].join("\n"),
        functionName: "group_anagrams",
      },
    ],

    hints: [
      {
        title: "What identifies an anagram?",
        body: "Two strings are anagrams if they use the same character frequencies. You only need a keyable summary of those frequencies, not the original order.",
      },
      {
        title: "Sorted key",
        body: "Sorting the letters of a string gives the same key for every anagram. Use that string (or a tuple of counts) as the map key.",
      },
      {
        title: "Buckets",
        body: "Iterate strs once. For each word, append it to the list stored at its key, creating the list on first sight.",
      },
      {
        title: "Stable output for tests",
        body: "Sort each bucket's strings. Sort the list of buckets by comparing the first string in each bucket lexicographically.",
      },
    ],

    solutions: [
      {
        language: "javascript",
        code: [
          "function groupAnagrams(strs) {",
          "  const map = new Map();",
          "  for (const s of strs) {",
          "    const key = [...s].sort().join(\"\");",
          "    if (!map.has(key)) map.set(key, []);",
          "    map.get(key).push(s);",
          "  }",
          "  const groups = [...map.values()].map((g) => [...g].sort((a, b) => a.localeCompare(b)));",
          "  groups.sort((a, b) => a[0].localeCompare(b[0]));",
          "  return groups;",
          "}",
        ].join("\n"),
        explanation:
          "Anagrams share the same sorted letter string, so that sorted string is a hash map key. Collect all words per key, then sort each group and order groups by their smallest member for a deterministic result.",
        timeComplexity: "O(m * n log n)",
        spaceComplexity: "O(m * n)",
      },
    ],

    testCases: [
      {
        input: '[["eat","tea","tan","ate","nat","bat"]]',
        expectedOutput: '[["ate","eat","tea"],["bat"],["nat","tan"]]',
        isSample: true,
      },
      {
        input: '[["x"]]',
        expectedOutput: '[["x"]]',
        isSample: true,
      },
      {
        input: '[["",""]]',
        expectedOutput: '[["",""]]',
        isSample: true,
      },
      {
        input: '[["act","pots","tops","cat","stop","hat"]]',
        expectedOutput: '[["act","cat"],["hat"],["pots","stop","tops"]]',
        isSample: false,
      },
      {
        input: '[["abc","cba","def","fed","ghi"]]',
        expectedOutput: '[["abc","cba"],["def","fed"],["ghi"]]',
        isSample: false,
      },
    ],
  };
}
