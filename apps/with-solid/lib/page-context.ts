/**
 * Helper function to build context string for the chatbot
 * based on the current page's content
 */
export function buildPageContext({
  principle,
  description,
  definition,
  benefits,
  badCode,
  goodCode,
  badDescription,
  goodDescription,
}: {
  principle: string;
  description: string;
  definition: string;
  benefits?: string[];
  badCode: string;
  goodCode: string;
  badDescription?: string;
  goodDescription?: string;
}): string {
  const benefitsText = benefits
    ? `\nBenefits:\n${benefits.map((b) => `- ${b}`).join("\n")}`
    : "";

  const badDesc = badDescription ? `\n${badDescription}` : "";
  const goodDesc = goodDescription ? `\n${goodDescription}` : "";

  return `You are currently viewing the ${principle} page.

Principle: ${principle}
Description: ${description}

Definition:
${definition}${benefitsText}

The page shows two code examples:

1. Bad Example (violates the principle):${badDesc}
\`\`\`typescript
${badCode}
\`\`\`

2. Good Example (follows the principle):${goodDesc}
\`\`\`typescript
${goodCode}
\`\`\`

When answering questions, reference these specific code examples and explain how they demonstrate the principle.`;
}
