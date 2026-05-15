export interface CandidateAppliedJob {
  id: string;
  applicationId?: string;
  title: string;
  companyName?: string;
  location?: string;
  status?: string;
  statusLabel: string;
  appliedAt?: string;
  updatedAt?: string;
}

export interface CandidateItem {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  major: string;
  school: string;
  desiredRole: string;
  avatarUrl?: string;
  jobId?: string;
  applicationId?: string;
  applicationStatus?: ApiApplicationStatus[];
  screeningScore?: number | null;
  profileSummary?: ApiCandidateProfileSummary | null;
  cvUrl?: string;
  cvFileName?: string;
  sortDate?: string;
  appliedJobs: CandidateAppliedJob[];
}

export interface CandidateDetail extends CandidateItem {
  positionApplied: string;
  university: string;
  gpa: string;
  aiScore: number | null;
  technicalScore: number | null;
  experienceScore: number | null;
  softScore: number | null;
  summary: string[];
  personalInfo: {
    gender: string;
    dob: string;
    email: string;
    phone: string;
    address: string;
  };
  skills: { label: string; detail: string }[];
  timeline: { phase: string; date: string }[];
  socials: { label: string; href: string; icon: string }[];
}

export interface ApiCandidateProfileSummary {
  academicInfo?: {
    university?: string;
    major?: string;
    graduationYear?: number;
    gpa?: number;
  };
  advantagePoint?: string | null;
  technicalSkillsCount?: number;
  softSkillsCount?: number;
  updatedAt?: string | null;
}

export interface ApiCandidateSummary {
  _id?: string;
  id: string;
  userId: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  cvUrl?: string | null;
  resumeUrl?: string | null;
  cv?: unknown;
  resume?: unknown;
  attachments?: unknown[];
  documents?: unknown[];
  files?: unknown[];
  status?: string;
  role?: string;
  studentID?: string | null;
  contactInfo?: {
    email?: string;
    phone?: string | null;
    address?: string | null;
    linkedinUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    messengerUrl?: string | null;
  };
  gender?: string | null;
  dateOfBirth?: string | null;
  birthDate?: string | null;
  dob?: string | null;
  address?: string | null;
  jobs?: unknown[];
  appliedJobs?: unknown[];
  applications?: unknown[];
  jobApplications?: unknown[];
  hasProfile?: boolean;
  academicInfo?: ApiCandidateProfileSummary["academicInfo"] | null;
  profile?: ApiCandidateProfileSummary | null;
}

export interface ApiApplicationStatus {
  status: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiScreeningResults {
  score?: number | null;
  matchedSkills?: string[];
  missingSkills?: string[];
}

export interface ApiJobApplicant {
  applicationId: string;
  jobId: string;
  cvUrl?: string | null;
  resumeUrl?: string | null;
  cv?: unknown;
  resume?: unknown;
  attachments?: unknown[];
  documents?: unknown[];
  files?: unknown[];
  currentStatus?: ApiApplicationStatus | null;
  applicationStatus?: ApiApplicationStatus[];
  screeningResults?: ApiScreeningResults | null;
  finalDecision?: {
    decision?: string | null;
    decidedAt?: string | null;
    decidedBy?: string | null;
  } | null;
  createdAt?: string;
  updatedAt?: string;
  candidate?: ApiCandidateSummary | null;
  job?: unknown;
  jobInfo?: unknown;
  company?: unknown;
  jobTitle?: string;
  title?: string;
  companyName?: string;
  location?: string;
}

export interface ApiTechnicalSkill {
  category?: string;
  name?: string;
  skillId?: { _id?: string; skill_name?: string; category?: string } | string;
  yearsOfExperience?: number;
  confidence?: boolean;
}

export interface ApiLanguage {
  certificateName?: string;
  score?: number;
  issuedAt?: string;
  expiresAt?: string;
}

export interface ApiAchievement {
  title?: string;
  achievedAt?: string;
}

export interface ApiProject {
  name?: string;
  role?: string;
  technologies?: Array<{ _id?: string; skill_name?: string; category?: string }>;
}

export interface ApiWorkExperience {
  companyName?: string;
  position?: string;
  description?: string;
  technologiesUsed?: Array<{ _id?: string; skill_name?: string; category?: string }>;
}

export interface ApiIntroductionQuestions {
  preferredRoles?: { preferredRole?: string }[];
  whyTheseRoles?: string;
  futureGoals?: string;
  favoriteTechnology?: string;
}

export interface ApiCandidateProfile {
  userId?: string | ApiCandidateSummary | null;
  user?: ApiCandidateSummary | null;
  cvUrl?: string | null;
  resumeUrl?: string | null;
  cv?: unknown;
  resume?: unknown;
  attachments?: unknown[];
  documents?: unknown[];
  files?: unknown[];
  academicInfo?: {
    university?: string;
    major?: string;
    graduationYear?: number;
    gpa?: number;
  };
  languages?: ApiLanguage[];
  achievements?: ApiAchievement[];
  advantagePoint?: string;
  technicalSkills?: ApiTechnicalSkill[];
  softSkills?: string[];
  projects?: ApiProject[];
  workExperiences?: ApiWorkExperience[];
  introductionQuestions?: ApiIntroductionQuestions;
  gender?: string | null;
  dateOfBirth?: string | null;
  birthDate?: string | null;
  dob?: string | null;
  address?: string | null;
  contactInfo?: {
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    linkedinUrl?: string | null;
    facebookUrl?: string | null;
    instagramUrl?: string | null;
    messengerUrl?: string | null;
  };
  updatedAt?: string;
}

export interface ApiApplicantProfileResponse {
  jobId?: string;
  applicationId?: string;
  cvUrl?: string | null;
  resumeUrl?: string | null;
  cv?: unknown;
  resume?: unknown;
  attachments?: unknown[];
  documents?: unknown[];
  files?: unknown[];
  currentStatus?: ApiApplicationStatus | null;
  candidate?: ApiCandidateSummary | null;
  job?: unknown;
  jobInfo?: unknown;
  jobs?: unknown[];
  appliedJobs?: unknown[];
  applications?: unknown[];
  application?: {
    _id?: string;
    id?: string;
    applicationId?: string;
    jobId?: unknown;
    candidateUserId?: unknown;
    cvUrl?: string | null;
    resumeUrl?: string | null;
    cv?: unknown;
    resume?: unknown;
    attachments?: unknown[];
    documents?: unknown[];
    files?: unknown[];
    applicationStatus?: ApiApplicationStatus[];
    screeningResults?: ApiScreeningResults | null;
    finalDecision?: {
      decision?: string | null;
      decidedAt?: string | null;
      decidedBy?: string | null;
    } | null;
    createdAt?: string;
    updatedAt?: string;
    job?: unknown;
    jobInfo?: unknown;
  } | null;
  profile?: ApiCandidateProfile | null;
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
