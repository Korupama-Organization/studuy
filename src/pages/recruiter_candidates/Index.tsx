import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCurrentRecruiter } from "../../hooks/useCurrentRecruiter";
import { useRecruiterActivity } from "../../hooks/useRecruiterActivity";
import RecruiterSidebar from "../recruiter_dashboard/components/RecruiterSidebar";
import RecruiterTopBar from "../recruiter_dashboard/components/RecruiterTopBar";
import ActivityPanel from "../recruiter_dashboard/components/ActivityPanel";
import "../recruiter_dashboard/recruiter.css";

const candidatePhotoFallback =
  "https://www.figma.com/api/mcp/asset/1880ebb6-d692-4b48-8841-0be386f46699";
const linkedinIcon =
  "https://www.figma.com/api/mcp/asset/8fdfaf84-6ded-4c1c-840f-4c1db44b9e44";
const messengerIcon =
  "https://www.figma.com/api/mcp/asset/c057f064-eab4-4045-968b-4f8c38e411c2";
const instagramIcon =
  "https://www.figma.com/api/mcp/asset/e4f3174f-74d5-415e-8611-11f4dd20f468";
const aiScoreRing =
  "https://www.figma.com/api/mcp/asset/e973b280-e68b-4981-bf37-976a4d39207d";
const timelineIcon =
  "https://www.figma.com/api/mcp/asset/4df0bec7-ea83-41b4-96eb-901dff9c1b6f";
const timelineCheckIcon =
  "https://www.figma.com/api/mcp/asset/85781c1e-90ce-4fee-9368-bf50a26e334c";

interface CandidateItem {
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
}

interface CandidateDetail extends CandidateItem {
  positionApplied: string;
  university: string;
  gpa: string;
  aiScore: number;
  technicalScore: number;
  experienceScore: number;
  softScore: number;
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

interface ApiCandidateProfileSummary {
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

interface ApiCandidateSummary {
  id: string;
  userId: string;
  fullName: string;
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
  };
  hasProfile?: boolean;
  profile?: ApiCandidateProfileSummary | null;
}

interface ApiApplicationStatus {
  status: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiScreeningResults {
  score?: number | null;
  matchedSkills?: string[];
  missingSkills?: string[];
}

interface ApiJobApplicant {
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
}

interface ApiTechnicalSkill {
  category?: string;
  skillId?: { _id?: string; skill_name?: string; category?: string } | string;
  yearsOfExperience?: number;
  confidence?: boolean;
}

interface ApiLanguage {
  certificateName?: string;
  score?: number;
  issuedAt?: string;
  expiresAt?: string;
}

interface ApiAchievement {
  title?: string;
  achievedAt?: string;
}

interface ApiProject {
  name?: string;
  role?: string;
  technologies?: Array<{ _id?: string; skill_name?: string; category?: string }>;
}

interface ApiWorkExperience {
  companyName?: string;
  position?: string;
  description?: string;
  technologiesUsed?: Array<{ _id?: string; skill_name?: string; category?: string }>;
}

interface ApiIntroductionQuestions {
  preferredRoles?: { preferredRole?: string }[];
  whyTheseRoles?: string;
  futureGoals?: string;
  favoriteTechnology?: string;
}

interface ApiCandidateProfile {
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
  updatedAt?: string;
}

interface ApiApplicantProfileResponse {
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
  application?: {
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
  } | null;
  profile?: ApiCandidateProfile | null;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const defaultSummary = [
  "Kỹ sư phần mềm với hơn 3 năm kinh nghiệm trong phát triển ứng dụng web và di động. Thành thạo trong việc thiết kế kiến trúc, tối ưu hiệu năng và triển khai các giải pháp công nghệ hiện đại. Có kinh nghiệm làm việc với nhiều khung phát triển như Django, FastAPI, Node.js, Flutter, và thành thạo với MySQL, PostgreSQL, Redis.",
  "Tinh thần chủ động, trách nhiệm cao và luôn học hỏi công nghệ mới để nâng cao hiệu quả công việc.",
];

const defaultSkills = [
  { label: "Danh mục 1", detail: "kỹ năng" },
  { label: "Danh mục 2", detail: "kỹ năng" },
  {
    label: "Danh mục 3",
    detail: "Làm tốt — bạn xử lý hiệu quả và chú ý đến chi tiết.",
  },
  {
    label: "Microsoft",
    detail: "Làm tốt — bạn xử lý hiệu quả và chú ý đến chi tiết.",
  },
  {
    label: "Microsoft",
    detail: "Làm tốt — bạn xử lý hiệu quả và chú ý đến chi tiết.",
  },
];

const defaultTimeline = [
  { phase: "Giai đoạn 1", date: "18/05" },
  { phase: "Giai đoạn 2", date: "18/05" },
  { phase: "Giai đoạn 3", date: "18/05" },
  { phase: "Giai đoạn 4", date: "18/05" },
  { phase: "Giai đoạn 5", date: "18/05" },
  { phase: "Giai đoạn 6", date: "18/05" },
];

const defaultSocials = [
  { label: "LinkedIn", href: "#", icon: linkedinIcon },
  { label: "Messenger", href: "#", icon: messengerIcon },
  { label: "Instagram", href: "#", icon: instagramIcon },
];

const API_BASE_URL =
  (
    import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
    (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");

const buildApiUrl = (path: string): string => {
  const normalizedPath = path.replace(/^\/+/, "");
  return `${API_BASE_URL}/${normalizedPath}`;
};

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getAuthDownloadHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
};

const CV_URL_KEYS = [
  "cvUrl",
  "cvURL",
  "cv_url",
  "resumeUrl",
  "resumeURL",
  "resume_url",
  "fileUrl",
  "fileURL",
  "downloadUrl",
  "downloadURL",
  "publicUrl",
  "secureUrl",
  "url",
  "href",
] as const;

const CV_OBJECT_KEYS = [
  "cv",
  "resume",
  "cvFile",
  "resumeFile",
  "file",
  "document",
  "attachment",
] as const;

const CV_ARRAY_KEYS = ["attachments", "documents", "files"] as const;
const CV_NAME_KEYS = [
  "name",
  "fileName",
  "filename",
  "originalName",
  "title",
  "type",
  "kind",
  "label",
] as const;

const isCvLikeRecord = (record: Record<string, unknown>): boolean => {
  const descriptor = CV_NAME_KEYS.map((key) => readString(record[key]) || "")
    .join(" ")
    .toLowerCase();

  return /(^|\W)(cv|resume|curriculum|hồ sơ|ho so)(\W|$)/i.test(descriptor);
};

const extractCvUrlFromRecord = (
  record: Record<string, unknown>,
): string | undefined => {
  for (const key of CV_URL_KEYS) {
    const value = readString(record[key]);
    if (value) return value;
  }

  for (const key of CV_OBJECT_KEYS) {
    const value = record[key];
    if (typeof value === "string") {
      const url = readString(value);
      if (url) return url;
    }
    if (isRecord(value)) {
      const url = extractCvUrlFromRecord(value);
      if (url) return url;
    }
  }

  for (const key of CV_ARRAY_KEYS) {
    const items = Array.isArray(record[key]) ? record[key] : [];
    const records = items.filter(isRecord);
    const cvRecord = records.find(isCvLikeRecord);
    const url = cvRecord
      ? extractCvUrlFromRecord(cvRecord)
      : records.length === 1
        ? extractCvUrlFromRecord(records[0])
        : undefined;
    if (url) return url;
  }

  return undefined;
};

const extractCvUrl = (...sources: unknown[]): string | undefined => {
  for (const source of sources) {
    const direct = readString(source);
    if (direct) return direct;

    if (isRecord(source)) {
      const url = extractCvUrlFromRecord(source);
      if (url) return url;
    }
  }

  return undefined;
};

const extractCvFileName = (...sources: unknown[]): string | undefined => {
  const fileNameKeys = [
    "cvFileName",
    "resumeFileName",
    "fileName",
    "filename",
    "originalName",
    "name",
    "title",
  ];

  for (const source of sources) {
    if (!isRecord(source)) continue;

    for (const key of fileNameKeys) {
      const value = readString(source[key]);
      if (value) return value;
    }

    for (const key of CV_OBJECT_KEYS) {
      const value = source[key];
      if (isRecord(value)) {
        const fileName = extractCvFileName(value);
        if (fileName) return fileName;
      }
    }
  }

  return undefined;
};

const sanitizeFileName = (value: string): string =>
  value.replace(/[\\/:*?"<>|]+/g, "-").replace(/\s+/g, " ").trim();

const parseContentDispositionFileName = (header: string | null): string | undefined => {
  if (!header) return undefined;

  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const fallbackMatch = header.match(/filename="?([^";]+)"?/i);
  return fallbackMatch?.[1];
};

const getCvFileName = (detail: CandidateDetail, response?: Response): string => {
  const fromHeader = parseContentDispositionFileName(
    response?.headers.get("content-disposition") || null,
  );
  const fallback = `${detail.name || "candidate"} CV.pdf`;
  return sanitizeFileName(fromHeader || detail.cvFileName || fallback);
};

const resolveDownloadUrl = (url: string): string => {
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return buildApiUrl(url);
};

const isApiDownloadUrl = (rawUrl: string, resolvedUrl: string): boolean =>
  !/^(https?:|blob:|data:)/i.test(rawUrl) || resolvedUrl.startsWith(API_BASE_URL);

const triggerBrowserDownload = (url: string, fileName: string, revoke = false) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();

  if (revoke) {
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
};

const getCandidateCvDownloadUrls = (
  detail: CandidateDetail,
  jobIdParam: string,
): string[] => {
  const urls: string[] = [];
  const explicitUrl = extractCvUrl(detail.cvUrl);
  if (explicitUrl) urls.push(explicitUrl);

  const jobId = detail.jobId || jobIdParam;

  if (jobId) {
    const applicantsCvUrl = new URL(
      buildApiUrl(`api/jobs/${encodeURIComponent(jobId)}/applicants/cv`),
    );
    if (detail.applicationId) {
      applicantsCvUrl.searchParams.set("applicationId", detail.applicationId);
    } else if (detail.userId) {
      applicantsCvUrl.searchParams.set("candidateUserId", detail.userId);
    }
    urls.push(applicantsCvUrl.toString());

    if (detail.applicationId) {
      urls.push(
        buildApiUrl(
          `api/jobs/${encodeURIComponent(jobId)}/applicants/${encodeURIComponent(
            detail.applicationId,
          )}/cv`,
        ),
      );
    }
  }

  if (detail.applicationId) {
    urls.push(
      buildApiUrl(`api/applications/${encodeURIComponent(detail.applicationId)}/cv`),
      buildApiUrl(`api/applications/${encodeURIComponent(detail.applicationId)}/resume`),
    );
  }

  if (detail.userId) {
    urls.push(
      buildApiUrl(`api/candidate-profiles/${encodeURIComponent(detail.userId)}/cv`),
      buildApiUrl(`api/candidate-profiles/${encodeURIComponent(detail.userId)}/resume`),
    );
  }

  return Array.from(new Set(urls));
};

const downloadCvFromUrl = async (
  rawUrl: string,
  detail: CandidateDetail,
): Promise<boolean> => {
  const resolvedUrl = resolveDownloadUrl(rawUrl);

  if (!isApiDownloadUrl(rawUrl, resolvedUrl)) {
    triggerBrowserDownload(resolvedUrl, getCvFileName(detail));
    return true;
  }

  const response = await fetch(resolvedUrl, {
    method: "GET",
    headers: getAuthDownloadHeaders(),
  });

  if (!response.ok) {
    return false;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = (await response.json().catch(() => null)) as unknown;
    const nestedUrl = extractCvUrl(payload);
    if (!nestedUrl || nestedUrl === rawUrl) {
      return false;
    }
    return downloadCvFromUrl(nestedUrl, detail);
  }

  const blob = await response.blob();
  if (!blob.size) return false;

  const objectUrl = URL.createObjectURL(blob);
  triggerBrowserDownload(objectUrl, getCvFileName(detail, response), true);
  return true;
};

const downloadCandidateCv = async (
  detail: CandidateDetail,
  jobIdParam: string,
): Promise<void> => {
  const urls = getCandidateCvDownloadUrls(detail, jobIdParam);

  for (const url of urls) {
    try {
      const downloaded = await downloadCvFromUrl(url, detail);
      if (downloaded) return;
    } catch {
      // Try the next known CV endpoint/URL.
    }
  }

  throw new Error("Chưa tìm thấy CV để tải cho ứng viên này.");
};

const parseErrorMessage = async (
  response: Response,
  fallback: string,
): Promise<string> => {
  try {
    const payload = (await response.json()) as { message?: string; error?: string };
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message;
    }
    if (typeof payload.error === "string" && payload.error.trim()) {
      return payload.error;
    }
  } catch {
    return fallback;
  }

  return fallback;
};

const formatDateShort = (value?: string | null): string => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("vi-VN");
};

const getSortTimestamp = (value?: string | null): number => {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortCandidates = (
  items: CandidateItem[],
  sortOrder: "newest" | "oldest",
): CandidateItem[] => {
  return [...items].sort((left, right) => {
    const leftTime = getSortTimestamp(left.sortDate);
    const rightTime = getSortTimestamp(right.sortDate);
    const byTime =
      sortOrder === "newest" ? rightTime - leftTime : leftTime - rightTime;

    return byTime || left.name.localeCompare(right.name, "vi");
  });
};

const normalizeScore = (score: unknown): number => {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return 8;
  }
  const normalized = score > 10 ? score / 10 : score;
  return Math.min(10, Math.max(0, Math.round(normalized)));
};

const statusLabelMap: Record<string, string> = {
  applied: "Đã nộp",
  screening_passed: "Qua vòng lọc",
  ai_interview_completed: "Phỏng vấn AI",
  manual_interview_completed: "Phỏng vấn trực tiếp",
  offered: "Đề nghị",
  hired: "Tuyển dụng",
};

const buildSummaryFromProfile = (profile?: ApiCandidateProfile | null): string[] => {
  if (!profile) return defaultSummary;

  const summaryParts = [
    profile.advantagePoint,
    profile.introductionQuestions?.whyTheseRoles,
    profile.introductionQuestions?.futureGoals,
  ].filter((part): part is string => typeof part === "string" && part.trim().length > 0);

  return summaryParts.length > 0 ? summaryParts : defaultSummary;
};

const buildSkillsFromProfile = (
  profile?: ApiCandidateProfile | null,
): { label: string; detail: string }[] => {
  if (!profile) return defaultSkills;

  const skillGroups = new Map<string, string[]>();

  (profile.technicalSkills || []).forEach((skill) => {
    const category =
      skill.category ||
      (typeof skill.skillId === "object" && skill.skillId?.category
        ? skill.skillId.category
        : "Kỹ năng");
    const name =
      (typeof skill.skillId === "object" && skill.skillId?.skill_name) ||
      (typeof skill.skillId === "string" ? skill.skillId : "") ||
      "";
    if (!name.trim()) return;

    const years =
      typeof skill.yearsOfExperience === "number" && Number.isFinite(skill.yearsOfExperience)
        ? ` (${skill.yearsOfExperience} năm)`
        : "";
    const label = `${name}${years}`.trim();

    if (!skillGroups.has(category)) {
      skillGroups.set(category, []);
    }
    skillGroups.get(category)?.push(label);
  });

  const skills: { label: string; detail: string }[] = [];

  skillGroups.forEach((items, category) => {
    if (items.length) {
      skills.push({ label: category, detail: items.join(" · ") });
    }
  });

  if (profile.softSkills && profile.softSkills.length) {
    skills.push({ label: "Kỹ năng mềm", detail: profile.softSkills.join(" · ") });
  }

  if (profile.languages && profile.languages.length) {
    const certificates = profile.languages
      .map((lang) => {
        const score = typeof lang.score === "number" ? ` ${lang.score}` : "";
        return `${lang.certificateName || ""}${score}`.trim();
      })
      .filter((item) => item);
    if (certificates.length) {
      skills.push({ label: "Chứng chỉ", detail: certificates.join(" · ") });
    }
  }

  if (profile.achievements && profile.achievements.length) {
    const achievementTitles = profile.achievements
      .map((achievement) => achievement.title || "")
      .filter((item) => item);
    if (achievementTitles.length) {
      skills.push({ label: "Thành tích", detail: achievementTitles.join(" · ") });
    }
  }

  return skills.length ? skills : defaultSkills;
};

const buildTimelineFromStatus = (
  statusList?: ApiApplicationStatus[],
): { phase: string; date: string }[] => {
  if (!statusList || statusList.length === 0) {
    return defaultTimeline;
  }

  const sorted = [...statusList].sort((left, right) => {
    const leftDate = new Date(left.createdAt || left.updatedAt || 0).getTime();
    const rightDate = new Date(right.createdAt || right.updatedAt || 0).getTime();
    return leftDate - rightDate;
  });

  return sorted.map((item) => ({
    phase: statusLabelMap[item.status] || item.status,
    date: formatDateShort(item.updatedAt || item.createdAt),
  }));
};

const mapCandidateSummaryToItem = (candidate: ApiCandidateSummary): CandidateItem => {
  const academicInfo = candidate.profile?.academicInfo;
  const desiredRole =
    (candidate.profile?.advantagePoint || "").trim() || "Chưa cập nhật";

  return {
    id: candidate.id || candidate.userId,
    userId: candidate.userId,
    name: candidate.fullName || "-",
    email: candidate.contactInfo?.email || "-",
    phone: candidate.contactInfo?.phone || "-",
    major: academicInfo?.major || "-",
    school: academicInfo?.university || "-",
    desiredRole,
    avatarUrl: candidate.avatarUrl || undefined,
    profileSummary: candidate.profile || null,
    cvUrl: extractCvUrl(candidate, candidate.profile),
    cvFileName: extractCvFileName(candidate, candidate.profile),
    sortDate:
      candidate.updatedAt ||
      candidate.createdAt ||
      candidate.profile?.updatedAt ||
      undefined,
  };
};

const mapApplicantToItem = (applicant: ApiJobApplicant): CandidateItem | null => {
  if (!applicant.candidate) {
    return null;
  }

  const mapped = mapCandidateSummaryToItem(applicant.candidate);

  return {
    ...mapped,
    jobId: applicant.jobId,
    applicationId: applicant.applicationId,
    applicationStatus: applicant.applicationStatus || [],
    screeningScore: applicant.screeningResults?.score ?? null,
    cvUrl: extractCvUrl(applicant, applicant.candidate, mapped.cvUrl),
    cvFileName: extractCvFileName(applicant, applicant.candidate) || mapped.cvFileName,
    sortDate:
      applicant.updatedAt ||
      applicant.createdAt ||
      applicant.currentStatus?.updatedAt ||
      applicant.currentStatus?.createdAt ||
      applicant.applicationStatus?.at(-1)?.updatedAt ||
      applicant.applicationStatus?.at(-1)?.createdAt ||
      mapped.sortDate,
  };
};

const buildCandidateDetailFallback = (candidate: CandidateItem): CandidateDetail => {
  const academicInfo = candidate.profileSummary?.academicInfo;
  const gpaValue = academicInfo?.gpa;
  const gpa =
    typeof gpaValue === "number" && Number.isFinite(gpaValue)
      ? `${gpaValue}/4.0`
      : "Chưa cập nhật";

  return {
    ...candidate,
    positionApplied: candidate.desiredRole,
    university: academicInfo?.university || candidate.school,
    gpa,
    aiScore: normalizeScore(candidate.screeningScore),
    technicalScore: normalizeScore(candidate.screeningScore),
    experienceScore: normalizeScore(candidate.screeningScore),
    softScore: normalizeScore(candidate.screeningScore),
    summary: candidate.profileSummary?.advantagePoint
      ? [candidate.profileSummary.advantagePoint]
      : defaultSummary,
    personalInfo: {
      gender: "Chưa cập nhật",
      dob: "Chưa cập nhật",
      email: candidate.email,
      phone: candidate.phone,
      address: "Chưa cập nhật",
    },
    skills: defaultSkills,
    timeline: defaultTimeline,
    socials: defaultSocials,
  };
};

const buildCandidateDetailFromProfile = (
  candidate: CandidateItem,
  profile?: ApiCandidateProfile | null,
  application?: ApiApplicantProfileResponse["application"] | null,
  responseData?: ApiApplicantProfileResponse | null,
): CandidateDetail => {
  const academicInfo = profile?.academicInfo;
  const gpaValue = academicInfo?.gpa;
  const gpa =
    typeof gpaValue === "number" && Number.isFinite(gpaValue)
      ? `${gpaValue}/4.0`
      : "Chưa cập nhật";
  const preferredRole =
    profile?.introductionQuestions?.preferredRoles?.[0]?.preferredRole;
  const aiScore = normalizeScore(
    application?.screeningResults?.score ?? candidate.screeningScore,
  );

  return {
    ...candidate,
    positionApplied: preferredRole || candidate.desiredRole,
    university: academicInfo?.university || candidate.school,
    gpa,
    aiScore,
    technicalScore: aiScore,
    experienceScore: aiScore,
    softScore: aiScore,
    summary: buildSummaryFromProfile(profile),
    personalInfo: {
      gender: "Chưa cập nhật",
      dob: "Chưa cập nhật",
      email: candidate.email,
      phone: candidate.phone,
      address: "Chưa cập nhật",
    },
    skills: buildSkillsFromProfile(profile),
    timeline: buildTimelineFromStatus(application?.applicationStatus),
    socials: defaultSocials,
    cvUrl: extractCvUrl(
      responseData,
      application,
      responseData?.candidate,
      profile,
      candidate.cvUrl,
    ),
    cvFileName:
      extractCvFileName(responseData, application, responseData?.candidate, profile) ||
      candidate.cvFileName,
  };
};

interface CandidateDetailViewProps {
  detail: CandidateDetail;
  onBack: () => void;
  jobIdParam: string;
}

function CandidateDetailView({ detail, onBack, jobIdParam }: CandidateDetailViewProps) {
  const candidatePhoto = detail.avatarUrl || candidatePhotoFallback;
  const [isCvDownloading, setIsCvDownloading] = useState(false);
  const [cvDownloadError, setCvDownloadError] = useState("");
  const scoreToPercent = (score: number) =>
    Math.min(100, Math.max(0, Math.round(score * 10)));

  const handleDownloadCv = async () => {
    setCvDownloadError("");
    setIsCvDownloading(true);
    try {
      await downloadCandidateCv(detail, jobIdParam);
    } catch (downloadError) {
      setCvDownloadError(
        downloadError instanceof Error
          ? downloadError.message
          : "Không thể tải CV ứng viên.",
      );
    } finally {
      setIsCvDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-[#3f4cf7]"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Danh sách ứng viên
      </button>

      <div className="rounded-[25px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-6 lg:max-w-[460px]">
            <div className="flex gap-4">
              <img
                src={candidatePhoto}
                alt={detail.name}
                className="h-[100px] w-[100px] rounded-[16px] object-cover"
              />
              <div className="flex flex-col gap-2">
                <p className="font-['Poppins'] text-[20px] font-medium text-black">
                  {detail.name}
                </p>
                <p className="text-[14px] text-[#64748b]">
                  Vị trí ứng tuyển: {detail.positionApplied}
                </p>
              </div>
            </div>

            <div className="h-px w-full bg-[#e7eaf3]" />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {detail.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="flex h-11 w-11 items-center justify-center rounded-[8px] bg-[rgba(63,76,247,0.11)]"
                    aria-label={social.label}
                  >
                    <img src={social.icon} alt={social.label} className="h-6 w-6" />
                  </a>
                ))}
              </div>
              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={handleDownloadCv}
                  disabled={isCvDownloading}
                  className="flex h-[35px] items-center justify-center rounded-full border border-[#3f4cf7] bg-[rgba(63,76,247,0.11)] px-6 text-[14px] font-medium text-[#3f4cf7] transition hover:bg-[rgba(63,76,247,0.18)] disabled:cursor-wait disabled:opacity-60"
                >
                  {isCvDownloading ? "Đang tải..." : "Tải CV"}
                </button>
                {cvDownloadError ? (
                  <p className="max-w-[240px] text-right text-[12px] text-red-500">
                    {cvDownloadError}
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="rounded-[16px] bg-[rgba(63,76,247,0.11)] p-6 lg:w-[430px]">
            <div className="space-y-4 text-[14px]">
              <div className="flex items-center justify-between">
                <span className="font-['Poppins'] text-[#182940]">Chuyên ngành</span>
                <span className="font-['Poppins'] font-medium text-black">
                  {detail.major}
                </span>
              </div>
              <div className="h-px w-full bg-[#dde1f4]" />
              <div className="flex items-center justify-between">
                <span className="font-['Poppins'] text-[#182940]">Trường</span>
                <span className="font-['Poppins'] font-medium text-black">
                  {detail.university}
                </span>
              </div>
              <div className="h-px w-full bg-[#dde1f4]" />
              <div className="flex items-center justify-between">
                <span className="font-['Poppins'] text-[#182940]">GPA</span>
                <span className="font-['Poppins'] font-medium text-black">
                  {detail.gpa}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),448px]">
        <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-[16px] font-bold text-black">Điểm AI</p>
              <div className="relative flex h-[145px] w-[145px] items-center justify-center">
                <img
                  src={aiScoreRing}
                  alt="Vòng điểm AI"
                  className="absolute inset-0 h-full w-full"
                />
                <span className="text-[18px] font-medium text-black">
                  {detail.aiScore}/10
                </span>
              </div>
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex items-center gap-4 rounded-[8px] bg-[#24273f] px-3 py-2 text-white">
                <span className="material-symbols-outlined text-[22px]">
                  workspace_premium
                </span>
                <div>
                  <p className="text-[9px] font-bold uppercase">Ứng viên nổi bật</p>
                  <p className="font-['Poppins'] text-[17px] font-bold">
                    #1 Phù hợp nhất
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kỹ năng chuyên môn: {detail.technicalScore}/10
                  </p>
                  <div className="h-[14px] w-full max-w-[260px] rounded-full bg-[#d1d1d1]">
                    <div
                      className="h-[14px] rounded-full bg-[#59d945]"
                      style={{ width: `${scoreToPercent(detail.technicalScore)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kinh nghiệm phù hợp: {detail.experienceScore}/10
                  </p>
                  <div className="h-[14px] w-full max-w-[260px] rounded-full bg-[#d1d1d1]">
                    <div
                      className="h-[14px] rounded-full bg-[#59d945]"
                      style={{ width: `${scoreToPercent(detail.experienceScore)}%` }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[14px] font-medium text-black">
                    Kỹ năng mềm: {detail.softScore}/10
                  </p>
                  <div className="h-[14px] w-full max-w-[260px] rounded-full bg-[#d1d1d1]">
                    <div
                      className="h-[14px] rounded-full bg-[#59d945]"
                      style={{ width: `${scoreToPercent(detail.softScore)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
          <p className="text-[16px] font-semibold text-black">Tóm tắt AI</p>
          <div className="mt-3 space-y-2 text-[16px] text-black">
            {detail.summary.map((paragraph, index) => (
              <p key={`${detail.id}-summary-${index}`}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr),303px]">
        <div className="space-y-5">
          <div className="rounded-[25px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
            <p className="text-[16px] font-semibold text-black">Thông tin cá nhân</p>
            <div className="mt-4 space-y-4">
              {[
                {
                  label: "Giới tính",
                  value: detail.personalInfo.gender,
                  icon: "wc",
                },
                {
                  label: "Ngày sinh",
                  value: detail.personalInfo.dob,
                  icon: "event",
                },
                {
                  label: "Email",
                  value: detail.personalInfo.email,
                  icon: "mail",
                },
                {
                  label: "Số điện thoại",
                  value: detail.personalInfo.phone,
                  icon: "call",
                },
                {
                  label: "Địa chỉ",
                  value: detail.personalInfo.address,
                  icon: "location_on",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[16px] bg-[rgba(63,76,247,0.11)]">
                    <span className="material-symbols-outlined text-[22px] text-[#3f4cf7]">
                      {item.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-[14px] text-[#64748b]">{item.label}</p>
                    <p className="text-[16px] text-black">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[25px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
            <div className="flex items-center justify-between">
              <p className="text-[16px] font-semibold text-black">Kỹ năng</p>
              <button
                type="button"
                className="text-[14px] text-[#3f4cf7]"
              >
                Xem them
              </button>
            </div>
            <div className="mt-4 space-y-4">
              {detail.skills.map((skill, index) => (
                <div
                  key={`${detail.id}-skill-${index}`}
                  className={
                    index === detail.skills.length - 1
                      ? "space-y-2"
                      : "space-y-2 border-b border-[#e7eaf3] pb-4"
                  }
                >
                  <p className="text-[14px] text-[#64748b]">{skill.label}</p>
                  <p className="text-[14px] text-black">{skill.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[16px] bg-white p-5 shadow-[0_6px_18px_rgba(196,203,214,0.12)]">
          <div className="flex items-center gap-3">
            <img src={timelineIcon} alt="Dòng thời gian" className="h-6 w-6" />
            <p className="text-[18px] font-medium text-black">
              Dòng thời gian hoạt động
            </p>
          </div>
          <div className="relative mt-6 pl-10">
            <span className="absolute left-[13px] top-2 h-full w-px bg-black" />
            <div className="space-y-6">
              {detail.timeline.map((item, index) => (
                <div key={`${detail.id}-timeline-${index}`} className="relative">
                  <div className="absolute -left-10 top-0 flex h-[29px] w-[29px] items-center justify-center rounded-full border-2 border-black bg-white">
                    <img
                      src={timelineCheckIcon}
                      alt="Hoàn thành"
                      className="h-[13px] w-[13px]"
                    />
                  </div>
                  <p className="text-[16px] text-black">{item.phase}</p>
                  <p className="text-[12px] text-[#64748b]">{item.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecruiterCandidatesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const jobIdParam = searchParams.get("jobId") || "";
  const jobTitleParam = searchParams.get("jobTitle") || "";

  const topbarRecruiter = useCurrentRecruiter();
  const recruiterActivity = useRecruiterActivity();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(
    null,
  );
  const [candidates, setCandidates] = useState<CandidateItem[]>([]);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 6,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [selectedDetail, setSelectedDetail] = useState<CandidateDetail | null>(
    null,
  );

  const pageSize = 6;

  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (!isActive) return;
      setCurrentPage(1);
      setSelectedCandidateId(null);
      setSelectedDetail(null);
    });

    return () => {
      isActive = false;
    };
  }, [searchQuery, jobIdParam, sortOrder]);

  useEffect(() => {
    let isActive = true;

    const loadCandidates = async () => {
      setIsLoading(true);
      setError("");

      try {
        const endpoint = jobIdParam
          ? `api/jobs/${encodeURIComponent(jobIdParam)}/applicants`
          : "api/jobs/candidates";
        const url = new URL(buildApiUrl(endpoint));
        url.searchParams.set("page", String(currentPage));
        url.searchParams.set("limit", String(pageSize));
        if (searchQuery.trim()) {
          url.searchParams.set("search", searchQuery.trim());
        }
        url.searchParams.set("sort", sortOrder);

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const payload = (await response
          .json()
          .catch(() => null)) as
          | {
              data?: unknown;
              pagination?: PaginationData;
              message?: string;
            }
          | null;

        if (!response.ok) {
          const fallback = jobIdParam
            ? "Không thể tải danh sách ứng viên theo job."
            : "Không thể tải danh sách ứng viên.";
          throw new Error(await parseErrorMessage(response, fallback));
        }

        const rawData = Array.isArray(payload?.data) ? payload?.data : [];
        const items = jobIdParam
          ? rawData
              .map((item) => mapApplicantToItem(item as ApiJobApplicant))
              .filter(Boolean)
          : rawData.map((item) => mapCandidateSummaryToItem(item as ApiCandidateSummary));

        const total = payload?.pagination?.total ?? items.length;
        const totalPages =
          payload?.pagination?.totalPages ??
          Math.max(1, Math.ceil(total / pageSize));

        if (!isActive) return;

        setCandidates(sortCandidates(items as CandidateItem[], sortOrder));
        setPagination({
          page: payload?.pagination?.page ?? currentPage,
          limit: payload?.pagination?.limit ?? pageSize,
          total,
          totalPages,
        });
      } catch (loadError) {
        if (!isActive) return;
        setCandidates([]);
        setPagination({ page: 1, limit: pageSize, total: 0, totalPages: 1 });
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải danh sách ứng viên.",
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void loadCandidates();

    return () => {
      isActive = false;
    };
  }, [currentPage, jobIdParam, pageSize, searchQuery, sortOrder]);

  const totalPages = Math.max(1, pagination.totalPages || 1);

  useEffect(() => {
    let isActive = true;

    void Promise.resolve().then(() => {
      if (!isActive) return;
      setCurrentPage((prev) => Math.min(prev, totalPages));
    });

    return () => {
      isActive = false;
    };
  }, [totalPages]);

  const pageNumbers = useMemo(
    () => Array.from({ length: totalPages }).map((_, index) => index + 1),
    [totalPages],
  );

  const selectedCandidate = useMemo(() => {
    if (!selectedCandidateId) return null;
    return (
      candidates.find((candidate) => candidate.id === selectedCandidateId) ||
      null
    );
  }, [candidates, selectedCandidateId]);

  const handleSortChange = (nextSortOrder: "newest" | "oldest") => {
    setSortOrder(nextSortOrder);
    setIsSortOpen(false);
  };

  useEffect(() => {
    let isActive = true;

    const loadDetail = async () => {
      await Promise.resolve();
      if (!isActive) return;

      if (!selectedCandidate) {
        setSelectedDetail(null);
        setDetailError("");
        return;
      }

      const jobId = selectedCandidate.jobId || jobIdParam;
      const fallbackDetail = buildCandidateDetailFallback(selectedCandidate);

      setSelectedDetail(fallbackDetail);
      if (!jobId) {
        return;
      }

      setIsDetailLoading(true);
      setDetailError("");

      try {
        const url = new URL(
          buildApiUrl(`api/jobs/${encodeURIComponent(jobId)}/applicants/profile`),
        );
        if (selectedCandidate.applicationId) {
          url.searchParams.set("applicationId", selectedCandidate.applicationId);
        } else if (selectedCandidate.userId) {
          url.searchParams.set("candidateUserId", selectedCandidate.userId);
        }

        const response = await fetch(url.toString(), {
          method: "GET",
          headers: getAuthHeaders(),
        });

        const payload = (await response
          .json()
          .catch(() => null)) as { data?: ApiApplicantProfileResponse } | null;

        if (!response.ok) {
          throw new Error(
            await parseErrorMessage(
              response,
              "Không thể tải hồ sơ ứng viên.",
            ),
          );
        }

        if (!isActive) return;

        const profile = payload?.data?.profile;
        const application = payload?.data?.application;
        setSelectedDetail(
          buildCandidateDetailFromProfile(
            selectedCandidate,
            profile,
            application,
            payload?.data,
          ),
        );
      } catch (loadError) {
        if (!isActive) return;
        setDetailError(
          loadError instanceof Error
            ? loadError.message
            : "Không thể tải hồ sơ ứng viên.",
        );
        setSelectedDetail(fallbackDetail);
      } finally {
        if (isActive) {
          setIsDetailLoading(false);
        }
      }
    };

    void loadDetail();

    return () => {
      isActive = false;
    };
  }, [jobIdParam, selectedCandidate]);

  useEffect(() => {
    if (selectedCandidateId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [selectedCandidateId]);

  const renderAvatar = (candidate: CandidateItem) => {
    if (candidate.avatarUrl) {
      return (
        <img
          src={candidate.avatarUrl}
          alt={candidate.name}
          className="h-[50px] w-[50px] rounded-full object-cover"
        />
      );
    }

    const initial = candidate.name.trim().charAt(0).toUpperCase() || "U";
    return (
      <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#E9EBFF] text-base font-bold text-[#3f4cf7]">
        {initial}
      </div>
    );
  };

  const clearJobFilter = useCallback(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("jobId");
    nextParams.delete("jobTitle");
    setSearchParams(nextParams);
  }, [searchParams, setSearchParams]);

  return (
    <div className="rd-layout">
      <RecruiterSidebar activeItem="candidates" />

      <div className="rd-body">
        <div className="rd-content-area">
          <RecruiterTopBar
            recruiter={topbarRecruiter}
            company={null}
            notificationCount={recruiterActivity.notificationCount}
            isActivityPanelOpen={recruiterActivity.isActivityPanelOpen}
            onToggleActivityPanel={recruiterActivity.toggleActivityPanel}
          />

          <div className="rd-main">
            {selectedDetail ? (
              <>
                {detailError ? (
                  <p className="text-sm text-red-500">{detailError}</p>
                ) : null}
                {isDetailLoading ? (
                  <p className="text-sm text-slate-500">
                    Đang tải hồ sơ ứng viên...
                  </p>
                ) : null}
                <CandidateDetailView
                  detail={selectedDetail}
                  onBack={() => setSelectedCandidateId(null)}
                  jobIdParam={jobIdParam}
                />
              </>
            ) : (
              <>
                {jobIdParam ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white px-4 py-3">
                    <div>
                      <p className="text-[12px] text-[#64748b]">Đang xem ứng viên</p>
                      <p className="text-[16px] font-semibold text-[#0a1629]">
                        {jobTitleParam || jobIdParam}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={clearJobFilter}
                      className="rounded-full border border-[#3f4cf7] px-4 py-2 text-[14px] font-medium text-[#3f4cf7]"
                    >
                      Xem tất cả
                    </button>
                  </div>
                ) : null}

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex h-[54px] w-full max-w-[578px] items-center justify-between rounded-[8px] border border-[rgba(63,76,247,0.11)] bg-white px-5">
                    <input
                      className="w-full border-none bg-transparent text-[16px] font-medium text-[#64748b] placeholder:text-[#64748b] focus:outline-none"
                      placeholder="Tìm kiếm..."
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                    />
                    <span className="material-symbols-outlined text-[22px] text-[#64748b]">
                      search
                    </span>
                  </div>
                  <div className="relative w-full max-w-[143px]">
                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={isSortOpen}
                      onClick={() => setIsSortOpen((current) => !current)}
                      className="flex h-[54px] w-full items-center justify-between rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white px-4 shadow-[0_4px_6px_rgba(62,73,84,0.04)]"
                    >
                      <span className="text-[16px] font-medium text-[#141515]">
                        {sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
                      </span>
                      <span className="material-symbols-outlined text-[20px] text-[#141515]">
                        expand_more
                      </span>
                    </button>

                    {isSortOpen ? (
                      <div
                        className="absolute right-0 top-[calc(100%+8px)] z-20 w-full overflow-hidden rounded-[12px] border border-[rgba(63,76,247,0.11)] bg-white shadow-[0_12px_28px_rgba(62,73,84,0.14)]"
                        role="listbox"
                        aria-label="Sắp xếp ứng viên"
                      >
                        <button
                          type="button"
                          role="option"
                          aria-selected={sortOrder === "newest"}
                          onClick={() => handleSortChange("newest")}
                          className={`w-full px-4 py-3 text-left text-[14px] font-medium transition ${
                            sortOrder === "newest"
                              ? "bg-[rgba(63,76,247,0.11)] text-[#3f4cf7]"
                              : "text-[#141515] hover:bg-[#f8fafc]"
                          }`}
                        >
                          Mới nhất
                        </button>
                        <button
                          type="button"
                          role="option"
                          aria-selected={sortOrder === "oldest"}
                          onClick={() => handleSortChange("oldest")}
                          className={`w-full px-4 py-3 text-left text-[14px] font-medium transition ${
                            sortOrder === "oldest"
                              ? "bg-[rgba(63,76,247,0.11)] text-[#3f4cf7]"
                              : "text-[#141515] hover:bg-[#f8fafc]"
                          }`}
                        >
                          Cũ nhất
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                {error ? <p className="text-sm text-red-500">{error}</p> : null}
                {isLoading ? (
                  <p className="text-sm text-slate-500">Đang tải ứng viên...</p>
                ) : null}

                {!isLoading && !candidates.length ? (
                  <p className="text-sm text-slate-500">Chưa có ứng viên.</p>
                ) : (
                  <div className="space-y-4">
                    {candidates.map((candidate) => (
                      <button
                        key={candidate.id}
                        type="button"
                        onClick={() => setSelectedCandidateId(candidate.id)}
                        className="flex w-full flex-col gap-6 rounded-[8px] border border-[rgba(63,76,247,0.11)] bg-white px-5 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(196,203,214,0.2)] lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="flex items-center gap-3">
                          {renderAvatar(candidate)}
                          <div>
                            <p className="text-[16px] font-bold text-[#0a1629]">
                              {candidate.name}
                            </p>
                            <p className="text-[14px] text-[#91929e]">
                              {candidate.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-wrap items-center gap-6 lg:gap-12">
                          <div>
                            <p className="text-[14px] text-[#91929e]">Chuyên ngành</p>
                            <p className="text-[16px] text-[#0a1629]">
                              {candidate.major}
                            </p>
                          </div>
                          <div>
                            <p className="text-[14px] text-[#91929e]">Trường</p>
                            <p className="text-[16px] text-[#0a1629]">
                              {candidate.school}
                            </p>
                          </div>
                          <div>
                            <p className="text-[14px] text-[#91929e]">
                              Vị trí mong muốn
                            </p>
                            <p className="text-[16px] text-[#0a1629]">
                              {candidate.desiredRole}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    className="flex h-[53px] items-center gap-3 rounded-[12px] bg-[#3f4cf7] px-6 text-[18px] font-medium text-white disabled:opacity-60"
                    disabled={currentPage === 1}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      keyboard_double_arrow_left
                    </span>
                    Trước
                  </button>

                  <div className="flex h-[53px] items-center gap-4 rounded-[12px] border border-[#3f4cf7] bg-white px-6 font-['Poppins']">
                    {pageNumbers.map((page) => {
                      const active = page === currentPage;
                      return (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-10 w-10 items-center justify-center rounded-[12px] text-[18px] ${
                            active
                              ? "bg-[#3f4cf7] text-white"
                              : "text-[#3f4cf7]"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    className="flex h-[53px] items-center gap-3 rounded-[12px] bg-[#3f4cf7] px-6 text-[18px] font-medium text-white disabled:opacity-60"
                    disabled={currentPage === totalPages}
                  >
                    Tiếp
                    <span className="material-symbols-outlined text-[22px]">
                      keyboard_double_arrow_right
                    </span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {recruiterActivity.isActivityPanelOpen ? (
          <ActivityPanel
            notifications={recruiterActivity.notifications}
            upcomingInterviews={recruiterActivity.upcomingInterviews}
            isLoading={recruiterActivity.isActivityLoading}
            error={recruiterActivity.activityError}
            unreadCount={recruiterActivity.unreadNotificationCount}
            onMarkAllAsRead={recruiterActivity.markAllNotificationsAsRead}
            onClose={recruiterActivity.closeActivityPanel}
          />
        ) : null}
      </div>
    </div>
  );
}
