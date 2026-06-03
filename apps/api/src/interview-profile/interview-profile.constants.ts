export const OPENAI_CHAT_COMPLETIONS_URL =
  "https://api.openai.com/v1/chat/completions";

export const AI_PROFILE_EXTRACT_MODEL = "gpt-4o-mini";

export const AI_PROFILE_EXTRACT_SYSTEM_PROMPT = `You extract a structured interview candidate profile from resume text.

Return a single JSON object with exactly these keys (camelCase):
- summary: string — one paragraph overview
- coreSkills: string[] — normalized skill names
- projects: array of { name, role, claims: string[] } — notable roles with verifiable claims
- claimsToVerify: array of { claim, questionAngle } — high-value resume statements and how to probe them
- strengthAreas: string[]
- potentialGapAreas: string[] — topics weak or missing vs senior roles

Be factual; only include claims supported by the resume. No markdown fences.`;
