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
