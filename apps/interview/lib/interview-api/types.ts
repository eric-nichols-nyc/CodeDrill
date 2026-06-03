export type ProjectExperience = {
  name: string;
  role: string;
  claims: string[];
};

export type ResumeClaim = {
  claim: string;
  questionAngle: string;
};

export type ProfilePayload = {
  summary: string;
  coreSkills: string[];
  projects: ProjectExperience[];
  claimsToVerify: ResumeClaim[];
  strengthAreas: string[];
  potentialGapAreas: string[];
};

export type CandidateProfile = ProfilePayload & {
  id: string;
  resumeId: string;
  createdAt: string;
  updatedAt: string;
};

export type ConfidenceLevel = "Low" | "Medium" | "High";

export type SeniorityLevel = {
  level: string;
  confidence: ConfidenceLevel;
};

export type HiddenExpectation = {
  expectation: string;
  reason: string;
};

export type SuggestedQuestionAngle = {
  category: string;
  angle: string;
};

export type JobAnalysisPayload = {
  companyName: string;
  roleTitle: string;
  roleSummary: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniorityLevel: SeniorityLevel;
  likelyInterviewCategories: string[];
  mustProve: string[];
  hiddenExpectations: HiddenExpectation[];
  interviewSignals: string[];
  suggestedQuestionAngles: SuggestedQuestionAngle[];
};

export type JobAnalysis = JobAnalysisPayload & {
  id: string;
  jobDescription: string;
  jobUrl: string | null;
  createdAt: string;
  updatedAt: string;
};
