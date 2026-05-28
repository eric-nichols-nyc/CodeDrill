type ProblemDetails = {
  problem: {
    id: string;
    title: string;
    slug: string;
    difficulty: string;
    description: string;
    constraints?: string | null;
    patternSlug?: string | null;
    loopStructure?: string | null;
    skillFocus?: string | null;
    tutorLevel?: string | null;
  };
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
  examples?: {
    input: string;
    output: string;
    explanation?: string | null;
  }[];
  starterCode?: {
    language: string;
    code: string;
    functionName?: string | null;
  }[];
  learningNotes?: {
    noteType: string;
    body: string;
  }[];
  solutions?: {
    language: string;
    code: string;
    explanation?: string | null;
    timeComplexity?: string | null;
    spaceComplexity?: string | null;
  }[];
};

export type ProblemContext = {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  description: string;
  constraints?: string | null;
  examples: {
    input: string;
    output: string;
    explanation?: string | null;
  }[];
  starterCode: {
    language: string;
    code: string;
    functionName?: string | null;
  }[];
  solutionCode: {
    language: string;
    code: string;
    explanation?: string | null;
    timeComplexity?: string | null;
    spaceComplexity?: string | null;
  }[];
  patternTags: string[];
  relatedConcepts: string[];
  commonMistakes: string[];
  hiddenInsights: string[];
  tutorLevel?: string | null;
};

function unique(values: Array<string | null | undefined>): string[] {
  return [
    ...new Set(
      values.map((value) => value?.trim()).filter(Boolean) as string[]
    ),
  ];
}

export function buildProblemContext(details: ProblemDetails): ProblemContext {
  const { problem } = details;

  const patternTags = unique([
    problem.patternSlug,
    ...(details.tags ?? []).flatMap((tag) => [tag.slug, tag.name]),
  ]);

  const relatedConcepts = unique([problem.skillFocus, problem.loopStructure]);

  const commonMistakes = (details.learningNotes ?? [])
    .filter((note) => note.noteType === "mistake")
    .map((note) => note.body.trim())
    .filter(Boolean);

  const hiddenInsights = (details.learningNotes ?? [])
    .filter(
      (note) =>
        note.noteType === "memory_tip" || note.noteType === "pattern_rule"
    )
    .map((note) => note.body.trim())
    .filter(Boolean);

  return {
    id: problem.id,
    title: problem.title,
    slug: problem.slug,
    difficulty: problem.difficulty,
    description: problem.description,
    constraints: problem.constraints ?? null,
    examples: (details.examples ?? []).map((example) => ({
      input: example.input,
      output: example.output,
      explanation: example.explanation ?? null,
    })),
    starterCode: (details.starterCode ?? []).map((row) => ({
      language: row.language,
      code: row.code,
      functionName: row.functionName ?? null,
    })),
    solutionCode: (details.solutions ?? []).map((solution) => ({
      language: solution.language,
      code: solution.code,
      explanation: solution.explanation ?? null,
      timeComplexity: solution.timeComplexity ?? null,
      spaceComplexity: solution.spaceComplexity ?? null,
    })),
    patternTags,
    relatedConcepts,
    commonMistakes,
    hiddenInsights,
    tutorLevel: problem.tutorLevel ?? null,
  };
}
