import { API_BASE_URL, buildApiUrl } from "../../services/api";
import type {
  Notification as DashboardNotification,
  RecentApplication,
} from "../../services/dashboardService";
import type {
  ApiApplicantProfileResponse,
  ApiApplicationStatus,
  ApiCandidateProfile,
  ApiCandidateSummary,
  ApiJobApplicant,
  CandidateAppliedJob,
  CandidateDetail,
  CandidateItem,
} from "./types";

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

const defaultSummary = [
  "Ứng viên chưa cập nhật tóm tắt hồ sơ.",
];

const defaultSkills = [
  { label: "Kỹ năng", detail: "Chưa cập nhật" },
];

const defaultTimeline = [{ phase: "Chưa có dữ liệu trạng thái", date: "-" }];
const missingJobTitle = "Vị trí chưa cập nhật";

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

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  isRecord(value) ? value : undefined;

const readString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
};

const readEntityId = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    const direct = readString(value);
    if (direct) return direct;

    if (isRecord(value)) {
      const nested = readString(value.$oid, value._id, value.id);
      if (nested) return nested;
    }
  }

  return undefined;
};

const getRecordArray = (...values: unknown[]): Record<string, unknown>[] => {
  for (const value of values) {
    if (Array.isArray(value)) {
      return value.filter(isRecord);
    }
  }

  return [];
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

const normalizeScore = (score: unknown): number | null => {
  if (typeof score !== "number" || !Number.isFinite(score)) {
    return null;
  }
  const normalized = score > 10 ? score / 10 : score;
  return Math.min(10, Math.max(0, Math.round(normalized)));
};

const statusLabelMap: Record<string, string> = {
  applied: "Đã nộp",
  pending: "Chờ xử lý",
  submitted: "Đã nộp",
  in_review: "Đang xem xét",
  screening: "Sàng lọc",
  screening_passed: "Qua vòng lọc",
  interview: "Phỏng vấn",
  interview_scheduled: "Đã hẹn phỏng vấn",
  hr_interview: "Phỏng vấn HR",
  technical_interview: "Phỏng vấn kỹ thuật",
  ai_interview_completed: "Phỏng vấn AI",
  manual_interview_completed: "Phỏng vấn trực tiếp",
  offered: "Đề nghị",
  hired: "Tuyển dụng",
  rejected: "Từ chối tuyển dụng",
};

const statusActionOptions = [
  { value: "screening_passed", label: "Qua vòng lọc" },
  { value: "ai_interview_completed", label: "Hoàn thành phỏng vấn AI" },
  { value: "manual_interview_completed", label: "Hoàn thành phỏng vấn trực tiếp" },
  { value: "offered", label: "Gửi đề nghị" },
  { value: "hired", label: "Tuyển dụng" },
  { value: "rejected", label: "Từ chối tuyển dụng" },
];

const statusActionEndpointMap: Record<string, string> = {
  screening_passed: "shortlist",
  ai_interview_completed: "interview",
  manual_interview_completed: "interview-2",
  offered: "offer",
  hired: "hire",
  rejected: "reject",
};

const statusActionSequence = statusActionOptions
  .map((option) => option.value)
  .filter((status) => status !== "rejected");
const terminalStatusActions = new Set(["hired", "rejected"]);

const getDefaultStatusAction = (currentStatus?: string): string => {
  const normalized = normalizeStatusKey(currentStatus);
  if (terminalStatusActions.has(normalized)) {
    return normalized;
  }

  const currentIndex = statusActionSequence.indexOf(normalized);

  if (currentIndex === -1) {
    return statusActionSequence[0];
  }

  return statusActionSequence[
    Math.min(currentIndex + 1, statusActionSequence.length - 1)
  ];
};

const normalizeStatusKey = (status?: string): string =>
  (status || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const getStatusLabel = (status?: string): string => {
  const normalized = normalizeStatusKey(status);
  if (!normalized) return "Chưa xử lý";
  return statusLabelMap[normalized] || status || "Chưa xử lý";
};

const getLatestStatus = (
  statusList?: ApiApplicationStatus[],
  currentStatus?: ApiApplicationStatus | null,
  fallbackStatus?: string | null,
): string | undefined => {
  const current = readString(currentStatus?.status);
  if (current) return current;

  const latest = [...(statusList || [])].sort((left, right) => {
    const leftDate = new Date(left.updatedAt || left.createdAt || 0).getTime();
    const rightDate = new Date(right.updatedAt || right.createdAt || 0).getTime();
    return rightDate - leftDate;
  })[0];

  return readString(latest?.status, fallbackStatus);
};

const formatLongDate = (value?: string | null): string => {
  if (!value) return "Chưa cập nhật";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN");
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
      skill.name ||
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

const mapAppliedJobFromRecord = (
  source: Record<string, unknown>,
): CandidateAppliedJob | null => {
  const job = asRecord(source.job) || asRecord(source.jobInfo) || asRecord(source.jobId);
  const basicInfo = asRecord(job?.basicInfo);
  const company =
    asRecord(source.company) ||
    asRecord(source.companyId) ||
    asRecord(job?.company) ||
    asRecord(job?.companyId);
  const statusList = getRecordArray(
    source.applicationStatus,
    source.statusHistory,
    source.logs,
  ) as ApiApplicationStatus[];
  const currentStatus = asRecord(source.currentStatus) as ApiApplicationStatus | undefined;
  const jobId = readEntityId(
    source.jobId,
    source.job,
    source.jobInfo,
    job?._id,
    job?.id,
  );
  const title = readString(
    source.jobTitle,
    source.positionApplied,
    source.position,
    source.title,
    job?.title,
    basicInfo?.title,
    basicInfo?.roleType,
  );
  const hasApplicationSignal = Boolean(
    source.applicationId ||
      source.currentStatus ||
      source.screeningResults ||
      source.finalDecision ||
      source.candidateUserId ||
      source.candidateId ||
      source.candidate ||
      source.applicant ||
      source.jobId ||
      source.appliedAt ||
      source.submittedAt ||
      statusList.length,
  );
  const hasJobSignal = Boolean(
    jobId ||
      title ||
      source.job ||
      source.jobInfo ||
      source.jobId ||
      source.jobTitle ||
      source.positionApplied,
  );

  if (!hasJobSignal) {
    return null;
  }

  const applicationId = readEntityId(
    source.applicationId,
    hasApplicationSignal ? source._id : undefined,
    hasApplicationSignal ? source.id : undefined,
  );

  if (!jobId && !applicationId && !title) {
    return null;
  }

  const status = getLatestStatus(
    statusList,
    currentStatus || null,
    hasApplicationSignal ? readString(source.status) : undefined,
  );

  return {
    id: jobId || applicationId || title || "unknown-job",
    applicationId,
    title: title || missingJobTitle,
    companyName: readString(
      source.companyName,
      company?.name,
      company?.companyName,
      job?.companyName,
    ),
    location: readString(
      source.location,
      source.workLocation,
      basicInfo?.location,
      job?.location,
      job?.workLocation,
    ),
    status,
    statusLabel: getStatusLabel(status),
    appliedAt: readString(source.createdAt, source.appliedAt, source.submittedAt),
    updatedAt: readString(source.updatedAt, currentStatus?.updatedAt),
  };
};

const extractAppliedJobs = (...sources: unknown[]): CandidateAppliedJob[] => {
  const jobs: CandidateAppliedJob[] = [];

  sources.forEach((source) => {
    if (!isRecord(source)) return;

    const direct = mapAppliedJobFromRecord(source);
    if (direct) jobs.push(direct);

    [
      ...getRecordArray(source.appliedJobs),
      ...getRecordArray(source.jobs),
      ...getRecordArray(source.applications),
      ...getRecordArray(source.jobApplications),
    ].forEach((record) => {
      const mapped = mapAppliedJobFromRecord(record);
      if (mapped) jobs.push(mapped);
    });
  });

  return mergeAppliedJobs(jobs);
};

function mergeAppliedJobs(...jobLists: CandidateAppliedJob[][]): CandidateAppliedJob[] {
  const byKey = new Map<string, CandidateAppliedJob>();

  jobLists.flat().forEach((job) => {
    const key = job.id || job.applicationId || `${job.title}-${job.companyName || ""}`;
    const current = byKey.get(key);
    const nextTitle =
      job.title === missingJobTitle && current?.title
        ? current.title
        : job.title || current?.title || missingJobTitle;
    byKey.set(key, {
      ...current,
      ...job,
      title: nextTitle,
      companyName: job.companyName || current?.companyName,
      location: job.location || current?.location,
      status: job.status || current?.status,
      statusLabel: getStatusLabel(job.status || current?.status),
    });
  });

  const mergedJobs = Array.from(byKey.values());
  const realJobs = mergedJobs.filter((job) => job.title !== missingJobTitle);

  if (!realJobs.length) {
    return mergedJobs;
  }

  const placeholderJobs = mergedJobs.filter((job) => job.title === missingJobTitle);
  const consumedPlaceholders = new Set<CandidateAppliedJob>();

  placeholderJobs.forEach((placeholderJob) => {
    const target =
      realJobs.find(
        (job) =>
          (placeholderJob.applicationId &&
            job.applicationId === placeholderJob.applicationId) ||
          (placeholderJob.id && job.id === placeholderJob.id),
      ) || (realJobs.length === 1 ? realJobs[0] : undefined);

    if (!target) return;

    target.id =
      target.id && target.id !== target.title
        ? target.id
        : placeholderJob.id || target.id;
    target.applicationId = target.applicationId || placeholderJob.applicationId;
    target.status = target.status || placeholderJob.status;
    target.statusLabel = getStatusLabel(target.status);
    target.appliedAt = target.appliedAt || placeholderJob.appliedAt;
    target.updatedAt = target.updatedAt || placeholderJob.updatedAt;
    consumedPlaceholders.add(placeholderJob);
  });

  return mergedJobs.filter((job) => !consumedPlaceholders.has(job));
}

const getAppliedJobsLabel = (jobs: CandidateAppliedJob[]): string =>
  jobs.length
    ? jobs.map((job) => job.title).filter(Boolean).join(", ")
    : "Chưa có job ứng tuyển";

const getAppliedJobKey = (job: CandidateAppliedJob): string =>
  job.applicationId || job.id || job.title;

const normalizeMatchKey = (value?: string | null): string =>
  (value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getCandidateMatchKeys = (candidate: CandidateItem): string[] =>
  [candidate.id, candidate.userId, candidate.name, candidate.email]
    .map(normalizeMatchKey)
    .filter(Boolean);

const getNotificationCandidateKeys = (
  notification: DashboardNotification,
): string[] =>
  [notification.candidate.id, notification.candidate.fullName]
    .map(normalizeMatchKey)
    .filter(Boolean);

const mapNotificationToAppliedJob = (
  notification: DashboardNotification,
): CandidateAppliedJob | null => {
  const title = readString(notification.job.title, notification.job.roleType);
  const id = readEntityId(notification.job.id, notification.job.title);

  if (!title && !id) {
    return null;
  }

  return {
    id: id || title || notification.id,
    title: title || missingJobTitle,
    status: "applied",
    statusLabel: getStatusLabel("applied"),
    appliedAt: notification.createdAt || undefined,
    updatedAt: notification.createdAt || undefined,
  };
};

const getRecentApplicationCandidateKeys = (
  application: RecentApplication,
): string[] =>
  [application.candidateId, application.name, application.candidateEmail]
    .map(normalizeMatchKey)
    .filter(Boolean);

const mapRecentApplicationToAppliedJob = (
  application: RecentApplication,
): CandidateAppliedJob | null => {
  const title = readString(application.jobTitle, application.jobRoleType, application.position);
  const jobId = readEntityId(application.jobId);

  if (!title && !jobId) {
    return null;
  }

  return {
    id: jobId || title || application.id,
    applicationId: application.id,
    title: title || missingJobTitle,
    status: application.rawStatus,
    statusLabel: application.statusLabel || getStatusLabel(application.rawStatus),
    appliedAt: application.appliedAt || undefined,
    updatedAt: application.updatedAt || undefined,
  };
};

const getRecentApplicationJobsForCandidate = (
  candidate: CandidateItem,
  applications: RecentApplication[],
): CandidateAppliedJob[] => {
  const candidateKeys = new Set(getCandidateMatchKeys(candidate));

  return applications
    .filter((application) =>
      getRecentApplicationCandidateKeys(application).some((key) =>
        candidateKeys.has(key),
      ),
    )
    .map(mapRecentApplicationToAppliedJob)
    .filter((job): job is CandidateAppliedJob => Boolean(job));
};

const getNotificationJobsForCandidate = (
  candidate: CandidateItem,
  notifications: DashboardNotification[],
): CandidateAppliedJob[] => {
  const candidateKeys = new Set(getCandidateMatchKeys(candidate));

  return notifications
    .filter((notification) =>
      getNotificationCandidateKeys(notification).some((key) =>
        candidateKeys.has(key),
      ),
    )
    .map(mapNotificationToAppliedJob)
    .filter((job): job is CandidateAppliedJob => Boolean(job));
};

const mapNotificationToCandidateItem = (
  notification: DashboardNotification,
): CandidateItem | null => {
  const job = mapNotificationToAppliedJob(notification);
  const candidateId = readEntityId(notification.candidate.id);
  const candidateName = readString(notification.candidate.fullName);

  if (!candidateId && !candidateName) {
    return null;
  }

  return {
    id: candidateId || candidateName || notification.id,
    userId: candidateId || "",
    name: candidateName || "Ứng viên",
    email: "-",
    phone: "-",
    major: "-",
    school: "-",
    desiredRole: job?.title || "Chưa cập nhật",
    avatarUrl: notification.candidate.avatarUrl || undefined,
    jobId: job?.id,
    appliedJobs: job ? [job] : [],
    sortDate: notification.createdAt || undefined,
  };
};

const mapRecentApplicationToCandidateItem = (
  application: RecentApplication,
): CandidateItem | null => {
  const job = mapRecentApplicationToAppliedJob(application);
  const candidateId = readEntityId(application.candidateId);
  const candidateName = readString(application.name);

  if (!candidateId && !candidateName) {
    return null;
  }

  return {
    id: candidateId || candidateName || application.id,
    userId: candidateId || "",
    name: candidateName || "Ứng viên",
    email: application.candidateEmail || "-",
    phone: "-",
    major: "-",
    school: "-",
    desiredRole: job?.title || "Chưa cập nhật",
    jobId: job?.id,
    applicationId: application.id,
    appliedJobs: job ? [job] : [],
    sortDate: application.updatedAt || application.appliedAt || undefined,
  };
};

const enrichCandidatesWithNotifications = (
  items: CandidateItem[],
  notifications: DashboardNotification[],
  recentApplications: RecentApplication[],
): CandidateItem[] => {
  const enrichedItems = items.map((candidate) => {
    const notificationJobs = getNotificationJobsForCandidate(candidate, notifications);
    const recentApplicationJobs = getRecentApplicationJobsForCandidate(
      candidate,
      recentApplications,
    );
    const appliedJobs = mergeAppliedJobs(
      candidate.appliedJobs,
      notificationJobs,
      recentApplicationJobs,
    );

    return {
      ...candidate,
      jobId: candidate.jobId || appliedJobs[0]?.id,
      applicationId: candidate.applicationId || appliedJobs[0]?.applicationId,
      appliedJobs,
      desiredRole: appliedJobs[0]?.title || candidate.desiredRole,
      sortDate:
        candidate.sortDate ||
        appliedJobs[0]?.updatedAt ||
        appliedJobs[0]?.appliedAt,
    };
  });

  const knownKeys = new Set(enrichedItems.flatMap(getCandidateMatchKeys));
  const candidatesFromNotifications = notifications
    .map(mapNotificationToCandidateItem)
    .filter((candidate): candidate is CandidateItem => Boolean(candidate))
    .map((candidate) => {
      const appliedJobs = mergeAppliedJobs(
        candidate.appliedJobs,
        getRecentApplicationJobsForCandidate(candidate, recentApplications),
      );

      return {
        ...candidate,
        jobId: candidate.jobId || appliedJobs[0]?.id,
        applicationId: candidate.applicationId || appliedJobs[0]?.applicationId,
        appliedJobs,
        desiredRole: appliedJobs[0]?.title || candidate.desiredRole,
      };
    })
    .filter((candidate) => {
      const keys = getCandidateMatchKeys(candidate);
      return !keys.some((key) => knownKeys.has(key));
    });
  candidatesFromNotifications.forEach((candidate) => {
    getCandidateMatchKeys(candidate).forEach((key) => knownKeys.add(key));
  });

  const candidatesFromRecentApplications = recentApplications
    .map(mapRecentApplicationToCandidateItem)
    .filter((candidate): candidate is CandidateItem => Boolean(candidate))
    .filter((candidate) => {
      const keys = getCandidateMatchKeys(candidate);
      return !keys.some((key) => knownKeys.has(key));
    });

  return [
    ...enrichedItems,
    ...candidatesFromNotifications,
    ...candidatesFromRecentApplications,
  ];
};

const mapCandidateSummaryToItem = (candidate: ApiCandidateSummary): CandidateItem => {
  const profileSummary =
    candidate.profile ||
    (candidate.academicInfo
      ? {
          academicInfo: candidate.academicInfo,
          updatedAt: candidate.updatedAt || candidate.createdAt || null,
        }
      : null);
  const academicInfo = profileSummary?.academicInfo;
  const appliedJobs = extractAppliedJobs(candidate);
  const desiredRole =
    appliedJobs[0]?.title ||
    (profileSummary?.advantagePoint || "").trim() ||
    "Chưa cập nhật";
  const candidateId =
    readEntityId(candidate.id, candidate._id, candidate.userId) ||
    readString(candidate.fullName) ||
    "unknown-candidate";
  const candidateUserId =
    readEntityId(candidate.userId, candidate.id, candidate._id) || candidateId;

  return {
    id: candidateId,
    userId: candidateUserId,
    name: candidate.fullName || "-",
    email: readString(candidate.contactInfo?.email, candidate.email) || "-",
    phone: readString(candidate.contactInfo?.phone, candidate.phone) || "-",
    major: academicInfo?.major || "-",
    school: academicInfo?.university || "-",
    desiredRole,
    avatarUrl: candidate.avatarUrl || undefined,
    profileSummary,
    cvUrl: extractCvUrl(candidate, profileSummary),
    cvFileName: extractCvFileName(candidate, profileSummary),
    appliedJobs,
    sortDate:
      candidate.updatedAt ||
      candidate.createdAt ||
      profileSummary?.updatedAt ||
      undefined,
  };
};

const mapApplicantToItem = (applicant: ApiJobApplicant): CandidateItem | null => {
  if (!applicant.candidate) {
    return null;
  }

  const mapped = mapCandidateSummaryToItem(applicant.candidate);
  const appliedJobs = mergeAppliedJobs(
    mapped.appliedJobs,
    extractAppliedJobs(applicant),
  );
  const resolvedJobId = readEntityId(applicant.jobId, applicant.job, applicant.jobInfo);
  const resolvedApplicationId = readEntityId(applicant.applicationId);

  return {
    ...mapped,
    jobId: resolvedJobId,
    applicationId: resolvedApplicationId,
    applicationStatus: applicant.applicationStatus || [],
    screeningScore: applicant.screeningResults?.score ?? null,
    desiredRole: appliedJobs[0]?.title || mapped.desiredRole,
    appliedJobs,
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

const buildPersonalInfo = (
  candidate: CandidateItem,
  apiCandidate?: ApiCandidateSummary | null,
  profile?: ApiCandidateProfile | null,
): CandidateDetail["personalInfo"] => {
  const candidateContact = apiCandidate?.contactInfo;
  const profileContact = profile?.contactInfo;

  return {
    gender:
      readString(profile?.gender, apiCandidate?.gender) || "Chưa cập nhật",
    dob: formatLongDate(
      readString(
        profile?.dateOfBirth,
        profile?.birthDate,
        profile?.dob,
        apiCandidate?.dateOfBirth,
        apiCandidate?.birthDate,
        apiCandidate?.dob,
      ),
    ),
    email:
      readString(
        profileContact?.email,
        candidateContact?.email,
        apiCandidate?.email,
        candidate.email,
      ) ||
      "Chưa cập nhật",
    phone:
      readString(
        profileContact?.phone,
        candidateContact?.phone,
        apiCandidate?.phone,
        candidate.phone,
      ) ||
      "Chưa cập nhật",
    address:
      readString(
        profile?.address,
        profileContact?.address,
        apiCandidate?.address,
        candidateContact?.address,
      ) || "Chưa cập nhật",
  };
};

const buildSocials = (
  apiCandidate?: ApiCandidateSummary | null,
  profile?: ApiCandidateProfile | null,
): CandidateDetail["socials"] => {
  const candidateContact = apiCandidate?.contactInfo;
  const profileContact = profile?.contactInfo;

  return [
    {
      label: "LinkedIn",
      href: readString(profileContact?.linkedinUrl, candidateContact?.linkedinUrl),
      icon: linkedinIcon,
    },
    {
      label: "Messenger",
      href: readString(profileContact?.messengerUrl, candidateContact?.messengerUrl),
      icon: messengerIcon,
    },
    {
      label: "Instagram",
      href: readString(profileContact?.instagramUrl, candidateContact?.instagramUrl),
      icon: instagramIcon,
    },
    {
      label: "Facebook",
      href: readString(profileContact?.facebookUrl, candidateContact?.facebookUrl),
      icon: instagramIcon,
    },
  ].filter((social): social is { label: string; href: string; icon: string } =>
    Boolean(social.href),
  );
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
    positionApplied: candidate.appliedJobs[0]?.title || candidate.desiredRole,
    university: academicInfo?.university || candidate.school,
    gpa,
    aiScore: normalizeScore(candidate.screeningScore),
    technicalScore: normalizeScore(candidate.screeningScore),
    experienceScore: normalizeScore(candidate.screeningScore),
    softScore: normalizeScore(candidate.screeningScore),
    summary: candidate.profileSummary?.advantagePoint
      ? [candidate.profileSummary.advantagePoint]
      : defaultSummary,
    personalInfo: buildPersonalInfo(candidate),
    skills: defaultSkills,
    timeline: buildTimelineFromStatus(candidate.applicationStatus),
    socials: [],
  };
};

const buildCandidateDetailFromProfile = (
  candidate: CandidateItem,
  profile?: ApiCandidateProfile | null,
  application?: ApiApplicantProfileResponse["application"] | null,
  responseData?: ApiApplicantProfileResponse | null,
): CandidateDetail => {
  const apiCandidate = responseData?.candidate;
  const academicInfo =
    profile?.academicInfo ||
    apiCandidate?.profile?.academicInfo ||
    apiCandidate?.academicInfo ||
    candidate.profileSummary?.academicInfo;
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
  const appliedJobs = mergeAppliedJobs(
    candidate.appliedJobs,
    extractAppliedJobs(responseData, apiCandidate, application),
  );
  const resolvedCandidateId =
    readEntityId(apiCandidate?.id, apiCandidate?._id, apiCandidate?.userId, candidate.id) ||
    candidate.id;
  const resolvedUserId =
    readEntityId(apiCandidate?.userId, apiCandidate?.id, apiCandidate?._id, candidate.userId) ||
    candidate.userId;
  const resolvedJobId =
    readEntityId(
      responseData?.jobId,
      application?.jobId,
      application?.job,
      application?.jobInfo,
      candidate.jobId,
      appliedJobs[0]?.id,
    ) || candidate.jobId;
  const resolvedApplicationId =
    readEntityId(
      responseData?.applicationId,
      application?.applicationId,
      application?._id,
      application?.id,
      candidate.applicationId,
      appliedJobs[0]?.applicationId,
    ) || candidate.applicationId;

  return {
    ...candidate,
    id: resolvedCandidateId,
    userId: resolvedUserId,
    jobId: resolvedJobId,
    applicationId: resolvedApplicationId,
    name: readString(apiCandidate?.fullName, candidate.name) || candidate.name,
    email:
      readString(
        apiCandidate?.contactInfo?.email,
        apiCandidate?.email,
        candidate.email,
      ) || candidate.email,
    phone:
      readString(
        apiCandidate?.contactInfo?.phone,
        apiCandidate?.phone,
        candidate.phone,
      ) || candidate.phone,
    major: academicInfo?.major || candidate.major,
    school: academicInfo?.university || candidate.school,
    avatarUrl: apiCandidate?.avatarUrl || candidate.avatarUrl,
    appliedJobs,
    positionApplied: appliedJobs[0]?.title || preferredRole || candidate.desiredRole,
    university: academicInfo?.university || candidate.school,
    gpa,
    aiScore,
    technicalScore: aiScore,
    experienceScore: aiScore,
    softScore: aiScore,
    summary: buildSummaryFromProfile(profile),
    personalInfo: buildPersonalInfo(candidate, apiCandidate, profile),
    skills: buildSkillsFromProfile(profile),
    timeline: buildTimelineFromStatus(
      application?.applicationStatus || candidate.applicationStatus,
    ),
    socials: buildSocials(apiCandidate, profile),
    cvUrl: extractCvUrl(
      responseData,
      application,
      apiCandidate,
      profile,
      candidate.cvUrl,
    ),
    cvFileName:
      extractCvFileName(responseData, application, apiCandidate, profile) ||
      candidate.cvFileName,
  };
};

const looksLikeCandidateProfile = (
  record?: Record<string, unknown>,
): record is ApiCandidateProfile =>
  Boolean(
    record &&
      (record.academicInfo ||
        record.technicalSkills ||
        record.softSkills ||
        record.introductionQuestions ||
        record.advantagePoint),
  );

const normalizeDetailPayload = (payload: unknown): ApiApplicantProfileResponse => {
  const root = asRecord(payload) || {};
  const data = asRecord(root.data) || root;
  const dataCandidate = asRecord(data.candidate);
  const application = asRecord(data.application) || asRecord(data.applicant) || null;
  const applicationCandidate =
    asRecord(application?.candidate) ||
    asRecord(application?.candidateUserId) ||
    asRecord(application?.userId);
  const profileRecord =
    asRecord(data.profile) ||
    asRecord(data.candidateProfile) ||
    asRecord(dataCandidate?.profile) ||
    (looksLikeCandidateProfile(data) ? data : undefined);
  const profileUser = asRecord(profileRecord?.userId) || asRecord(profileRecord?.user);
  const candidateRecord =
    dataCandidate ||
    asRecord(data.user) ||
    asRecord(data.userId) ||
    applicationCandidate ||
    profileUser ||
    null;

  return {
    ...(data as ApiApplicantProfileResponse),
    candidate: candidateRecord as ApiCandidateSummary | null,
    application: application as ApiApplicantProfileResponse["application"],
    profile: (profileRecord as ApiCandidateProfile | undefined) || null,
  };
};

const getCandidateDetailUrls = (
  candidate: CandidateItem,
  jobId: string,
): string[] => {
  const urls: string[] = [];

  if (jobId) {
    const applicantProfileUrl = new URL(
      buildApiUrl(`api/jobs/${encodeURIComponent(jobId)}/applicants/profile`),
    );
    if (candidate.applicationId) {
      applicantProfileUrl.searchParams.set("applicationId", candidate.applicationId);
    } else if (candidate.userId) {
      applicantProfileUrl.searchParams.set("candidateUserId", candidate.userId);
    }
    urls.push(applicantProfileUrl.toString());
  }

  if (candidate.userId) {
    urls.push(
      buildApiUrl(`api/candidate-profiles/${encodeURIComponent(candidate.userId)}`),
      buildApiUrl(`api/candidate-profiles/${encodeURIComponent(candidate.userId)}/profile`),
    );
  }

  if (candidate.id && candidate.id !== candidate.userId) {
    urls.push(
      buildApiUrl(`api/candidate-profiles/${encodeURIComponent(candidate.id)}`),
    );
  }

  return Array.from(new Set(urls));
};

const fetchCandidateDetailData = async (
  candidate: CandidateItem,
  jobId: string,
): Promise<ApiApplicantProfileResponse> => {
  const urls = getCandidateDetailUrls(candidate, jobId);
  let lastError = "Không thể tải hồ sơ ứng viên.";

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        lastError = await parseErrorMessage(response, lastError);
        continue;
      }

      const payload = (await response.json().catch(() => null)) as unknown;
      return normalizeDetailPayload(payload);
    } catch (error) {
      lastError =
        error instanceof Error ? error.message : "Không thể tải hồ sơ ứng viên.";
    }
  }

  throw new Error(lastError);
};

const updateCandidateApplicationStatus = async (
  detail: CandidateDetail,
  job: CandidateAppliedJob,
  nextStatus: string,
): Promise<void> => {
  const applicationId = job.applicationId || detail.applicationId;
  if (!applicationId) {
    throw new Error("Thiếu applicationId nên chưa thể cập nhật trạng thái ứng viên.");
  }

  const endpoint = statusActionEndpointMap[normalizeStatusKey(nextStatus)];
  if (!endpoint) {
    throw new Error(
      `Backend hiện chưa hỗ trợ trạng thái "${getStatusLabel(nextStatus)}" cho thao tác này.`,
    );
  }

  const response = await fetch(
    buildApiUrl(`api/applications/${encodeURIComponent(applicationId)}/${endpoint}`),
    {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        note: `Recruiter updated application to ${nextStatus}`,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response, "Không thể cập nhật trạng thái ứng viên."),
    );
  }
};
export {
  aiScoreRing,
  buildApiUrl,
  buildCandidateDetailFallback,
  buildCandidateDetailFromProfile,
  candidatePhotoFallback,
  downloadCandidateCv,
  enrichCandidatesWithNotifications,
  fetchCandidateDetailData,
  formatDateShort,
  getAppliedJobKey,
  getAppliedJobsLabel,
  getAuthHeaders,
  getDefaultStatusAction,
  getStatusLabel,
  mapApplicantToItem,
  mapCandidateSummaryToItem,
  parseErrorMessage,
  sortCandidates,
  statusActionOptions,
  timelineCheckIcon,
  timelineIcon,
  updateCandidateApplicationStatus,
};
