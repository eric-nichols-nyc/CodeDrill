import type { InterviewSuggestedQuestionAngle } from "../database/schema";
import {
  SEED_CATEGORIES,
  SEED_QUESTIONS,
  type SeedQuestionFixture,
} from "./interview-session-seed.constants";

const WHITESPACE = /\s+/g;
const TRAILING_QUESTION = /\?+$/u;
const EXPLORE_EXPERIENCE =
  /^explore\s+(?:your\s+)?experience\s+with\s+(.+)$/iu;
const EXPLORE_TOPIC = /^explore\s+(.+)$/iu;
const TOPIC_STARTS_WITH_EXPERIENCE = /^experience\b/iu;
const INTERVIEWER_NOTE =
  /^(?:ask(?:\s+about)?|probe|discuss|cover|validate|check)\s+(.+)$/iu;
const EXPERIENCE_WITH = /^experience\s+with\s+(.+)$/iu;
const NATURAL_QUESTION =
  /^(?:how|what|why|when|where|who|tell me|walk me through|describe|explain|can you|could you|would you|give me an example)/iu;
const CONTAINS_YOU = /\byou\b/iu;
const TRAILING_PERIOD = /\.+$/u;

type JobAnalysisSeedInput = {
  companyName: string;
  roleTitle: string;
  seniorityLevel: { level: string };
  likelyInterviewCategories: string[];
  requiredSkills: string[];
  mustProve: string[];
  suggestedQuestionAngles: InterviewSuggestedQuestionAngle[];
};

export function buildInterviewTitle(
  companyName: string,
  roleTitle: string
): string {
  const company = companyName.trim();
  const role = roleTitle.trim();
  if (company && role) {
    return `${role} — ${company}`;
  }
  return role || company || "Interview Practice Session";
}

export function buildSeedCategories(
  job: JobAnalysisSeedInput,
  questions: SeedQuestionFixture[]
): string[] {
  const fromJob = job.likelyInterviewCategories.filter(Boolean);
  if (fromJob.length > 0) {
    return fromJob.slice(0, 8);
  }
  const fromQuestions = [...new Set(questions.map((q) => q.category))];
  return fromQuestions.length > 0 ? fromQuestions : [...SEED_CATEGORIES];
}

export function buildQuestionsFromJobAnalysis(
  job: JobAnalysisSeedInput
): SeedQuestionFixture[] {
  const difficulty = job.seniorityLevel.level?.trim() || "Senior";
  const angles = job.suggestedQuestionAngles ?? [];
  const signalPool = [...job.mustProve, ...job.requiredSkills].filter(Boolean);

  if (angles.length >= 1) {
    const selected = angles.slice(0, 3);
    return selected.map((angle, index) => ({
      displayOrder: index + 1,
      category: angle.category.trim() || "General",
      difficulty,
      questionText: angleToInterviewQuestion(angle.angle, angle.category),
      expectedSignals: pickSignals(signalPool, index, 4),
      followUpOpportunities: [] as string[],
    }));
  }

  return SEED_QUESTIONS.map((fixture) => ({
    ...fixture,
    difficulty,
  }));
}

/**
 * Job analysis stores "angles" (interviewer notes), not final questions.
 * Normalize probe text into how a real interviewer would ask aloud.
 */
export function angleToInterviewQuestion(angle: string, category: string): string {
  const cat = category.trim() || "this role";
  const text = normalizeAngleText(angle);

  if (!text) {
    return `Tell me about a recent project that demonstrates your fit for ${cat}.`;
  }

  if (isNaturalInterviewQuestion(text)) {
    return ensureQuestionMark(text);
  }

  const fromProbe = rewriteProbeAngle(text);
  if (fromProbe) {
    return fromProbe;
  }

  if (looksLikeTopicFragment(text)) {
    return `How do you approach ${cleanTopic(text)} in practice?`;
  }

  return `How would you approach ${cleanTopic(text)}?`;
}

function normalizeAngleText(angle: string): string {
  return angle.trim().replace(WHITESPACE, " ").replace(TRAILING_QUESTION, "");
}

function ensureQuestionMark(text: string): string {
  return text.endsWith("?") ? text : `${text}?`;
}

function rewriteProbeAngle(text: string): string | null {
  const exploreExperience = text.match(EXPLORE_EXPERIENCE);
  if (exploreExperience?.[1]) {
    return `Can you walk me through your experience with ${cleanTopic(exploreExperience[1])}?`;
  }

  const exploreTopic = text.match(EXPLORE_TOPIC);
  if (exploreTopic?.[1]) {
    const topic = cleanTopic(exploreTopic[1]);
    if (TOPIC_STARTS_WITH_EXPERIENCE.test(topic)) {
      return `Can you walk me through your ${topic}?`;
    }
    return `Can you walk me through your experience with ${topic}?`;
  }

  const interviewerNote = text.match(INTERVIEWER_NOTE);
  if (interviewerNote?.[1]) {
    const topic = cleanTopic(interviewerNote[1]);
    if (isNaturalInterviewQuestion(topic)) {
      return ensureQuestionMark(topic);
    }
    return `Tell me about ${topic}.`;
  }

  const experienceWith = text.match(EXPERIENCE_WITH);
  if (experienceWith?.[1]) {
    return `Can you walk me through your experience with ${cleanTopic(experienceWith[1])}?`;
  }

  return null;
}

function isNaturalInterviewQuestion(text: string): boolean {
  return NATURAL_QUESTION.test(text);
}

function looksLikeTopicFragment(text: string): boolean {
  if (isNaturalInterviewQuestion(text) || CONTAINS_YOU.test(text)) {
    return false;
  }
  return text.split(WHITESPACE).length <= 14;
}

function cleanTopic(topic: string): string {
  return topic.trim().replace(TRAILING_PERIOD, "");
}

function pickSignals(pool: string[], questionIndex: number, count: number) {
  if (pool.length === 0) {
    return ["clear reasoning", "concrete examples", "role-relevant depth"];
  }
  const picked: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const item = pool[(questionIndex * count + i) % pool.length];
    if (item) {
      picked.push(item);
    }
  }
  return [...new Set(picked)];
}
