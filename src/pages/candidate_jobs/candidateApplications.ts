export interface CandidateApplicationCard {
  id: string;
  jobId: string;
  applicationId: string;
  companyId: string;
  companyName: string;
  companyDetail: string;
  companyDescription: string;
  jobTitle: string;
  location: string;
  logoUrl?: string;
  status: string;
  hasApplied: boolean;
  appliedAt: string;
  currentProcessIndex: number;
  currentStageNote: string;
  currentStageLoggedAt: string;
  currentStageLabel: string;
  summary: string;
  jobDescription: string;
  requirements: string;
  processLabels: string[];
}

interface ApplicationStatusLog {
  status: string;
  note: string;
  createdAt: string;
  updatedAt: string;
  processIndex: number;
}

const PROCESS_LABELS = [
  "Ứng tuyển",
  "Sàng lọc",
  "Phỏng vấn HR",
  "Phỏng vấn kỹ thuật",
  "Đề nghị",
  "Hoàn tất",
];

const STATUS_INDEX: Record<string, number> = {
  applied: 0,
  ung_tuyen: 0,
  pending: 0,
  submitted: 0,
  screening: 1,
  screening_passed: 1,
  sang_loc: 1,
  in_review: 1,
  reviewed: 1,
  interview: 2,
  ai_interview_completed: 2,
  hr_interview: 2,
  phong_van: 2,
  phong_van_hr: 2,
  technical_interview: 3,
  manual_interview_completed: 3,
  tech_interview: 3,
  phong_van_ky_thuat: 3,
  offer: 4,
  offered: 4,
  de_nghi: 4,
  hired: 5,
  accepted: 5,
  completed: 5,
  hoan_tat: 5,
  rejected: 5,
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (isRecord(value)) {
      const objectId = value.$oid;
      if (typeof objectId === "string" && objectId.trim()) {
        return objectId.trim();
      }
    }
  }

  return "";
};

const getNestedRecord = (record: Record<string, unknown>, key: string): Record<string, unknown> => {
  const value = record[key];
  return isRecord(value) ? value : {};
};

const getRecordArray = (...values: unknown[]): Record<string, unknown>[] => {
  for (const value of values) {
    if (Array.isArray(value)) {
      const records = value.filter(isRecord);
      if (records.length > 0) {
        return records;
      }
    }
  }

  return [];
};

const getLocation = (job: Record<string, unknown>, basicInfo: Record<string, unknown>): string => {
  const locations = basicInfo.locations ?? job.locations;

  if (Array.isArray(locations)) {
    return locations.filter((item): item is string => typeof item === "string" && item.trim().length > 0).join(", ");
  }

  return getString(basicInfo.location, job.location, job.workLocation);
};

const normalizeStatusKey = (status: string): string => {
  return status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const isKnownApplicationStatus = (status: string): boolean => {
  return Boolean(status && STATUS_INDEX[normalizeStatusKey(status)] !== undefined);
};

const getProcessIndex = (record: Record<string, unknown>, status: string): number => {
  const explicitStep = record.currentStep ?? record.processStep ?? record.stageIndex;

  if (typeof explicitStep === "number" && Number.isFinite(explicitStep)) {
    return Math.min(Math.max(Math.round(explicitStep), 0), PROCESS_LABELS.length - 1);
  }

  if (typeof explicitStep === "string") {
    const parsed = Number(explicitStep);
    if (!Number.isNaN(parsed)) {
      return Math.min(Math.max(Math.round(parsed), 0), PROCESS_LABELS.length - 1);
    }
  }

  return STATUS_INDEX[normalizeStatusKey(status)] ?? 0;
};

const getTimestamp = (value: string): number => {
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const normalizeStatusLogs = (records: Record<string, unknown>[]): ApplicationStatusLog[] => {
  return records
    .map((record) => {
      const status = getString(record.status, record.stage, record.process, "Ứng tuyển");

      return {
        status,
        note: getString(record.note, record.notes, record.message, record.description),
        createdAt: getString(record.createdAt, record.created_at, record.loggedAt, record.logTime),
        updatedAt: getString(record.updatedAt, record.updated_at),
        processIndex: getProcessIndex(record, status),
      };
    })
    .sort((left, right) => getTimestamp(left.createdAt || left.updatedAt) - getTimestamp(right.createdAt || right.updatedAt));
};

const getCurrentStatusLog = (
  logs: ApplicationStatusLog[],
  currentProcessIndex: number,
  currentStatus: Record<string, unknown>,
): ApplicationStatusLog | null => {
  const matchingLogs = logs.filter((log) => log.processIndex === currentProcessIndex);

  if (matchingLogs.length > 0) {
    return matchingLogs[matchingLogs.length - 1];
  }

  if (Object.keys(currentStatus).length > 0) {
    const status = getString(currentStatus.status, currentStatus.stage, currentStatus.process, "Ứng tuyển");

    return {
      status,
      note: getString(currentStatus.note, currentStatus.notes, currentStatus.message, currentStatus.description),
      createdAt: getString(currentStatus.createdAt, currentStatus.created_at, currentStatus.loggedAt, currentStatus.logTime),
      updatedAt: getString(currentStatus.updatedAt, currentStatus.updated_at),
      processIndex: currentProcessIndex,
    };
  }

  return logs.length > 0 ? logs[logs.length - 1] : null;
};

export const extractCandidateApplications = (payload: unknown): Record<string, unknown>[] => {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.applications)) {
    return payload.applications.filter(isRecord);
  }

  if (Array.isArray(payload.data)) {
    return payload.data.filter(isRecord);
  }

  const data = getNestedRecord(payload, "data");
  if (Array.isArray(data.applications)) {
    return data.applications.filter(isRecord);
  }

  return [];
};

export const normalizeCandidateApplication = (raw: Record<string, unknown>): CandidateApplicationCard => {
  const jobInfo = getNestedRecord(raw, "jobInfo");
  const job = Object.keys(jobInfo).length > 0 ? jobInfo : getNestedRecord(raw, "job");
  const basicInfo = getNestedRecord(job, "basicInfo");
  const company = getNestedRecord(raw, "company");
  const rawCompanyId = getNestedRecord(raw, "companyId");
  const companyId = getNestedRecord(job, "companyId");
  const jobCompany = Object.keys(companyId).length > 0 ? companyId : getNestedRecord(job, "company");
  const requirements = getNestedRecord(job, "requirements");
  const currentStatus = getNestedRecord(raw, "currentStatus");
  const statusLogs = normalizeStatusLogs(getRecordArray(raw.applicationStatus, raw.applicationStatusHistory, raw.statusHistory, raw.logs));
  const explicitApplicationId = getString(raw.applicationId);
  const applicationStatus = getString(raw.applicationStatus, raw.latestStatus, raw.currentApplicationStatus);
  const rawStatus = getString(raw.status);
  const rawApplicationStatus = isKnownApplicationStatus(rawStatus) ? rawStatus : "";
  const appliedAt = getString(raw.appliedAt, raw.applied_at);
  const hasApplied = Boolean(
    explicitApplicationId || applicationStatus || appliedAt || statusLogs.length > 0 || rawApplicationStatus,
  );
  const applicationId = hasApplied ? getString(explicitApplicationId, raw._id, raw.id) : "";
  const status = hasApplied
    ? getString(
        currentStatus.status,
        applicationStatus,
        statusLogs.at(-1)?.status,
        raw.stage,
        raw.process,
        rawApplicationStatus,
        "applied",
      )
    : "Chưa ứng tuyển";
  const companyDescription = getString(
    company.description,
    jobCompany.description,
    raw.companyDescription,
    "Thông tin công ty sẽ được cập nhật sau.",
  );
  const jobDescription = getString(
    basicInfo.jobDescription,
    job.jobDescription,
    job.description,
    raw.jobDescription,
    "Mô tả công việc sẽ được cập nhật sau.",
  );
  const summary = getString(
    raw.summary,
    job.summary,
    basicInfo.summary,
    basicInfo.shortDescription,
    jobDescription,
    "Tóm tắt công việc sẽ được cập nhật sau.",
  );
  const jobId = getString(raw.jobId, job._id, job.id, raw._id, raw.id, job.slug);
  const resolvedCompanyId = getString(
    job.companyId,
    jobCompany._id,
    jobCompany.id,
    company._id,
    company.id,
    raw.companyId,
    rawCompanyId._id,
    rawCompanyId.id,
  );
  const currentProcessIndex = hasApplied
    ? getProcessIndex(Object.keys(currentStatus).length > 0 ? currentStatus : raw, status)
    : -1;
  const currentStatusLog = getCurrentStatusLog(statusLogs, currentProcessIndex, currentStatus);
  const defaultStageNote = hasApplied
    ? "Bạn đã ứng tuyển vào vị trí này."
    : "Bạn chưa ứng tuyển vào vị trí này.";

  return {
    id: getString(applicationId, raw._id, raw.id, jobId, crypto.randomUUID()),
    jobId,
    applicationId,
    companyId: resolvedCompanyId,
    companyName: getString(company.name, jobCompany.name, raw.companyName, job.companyName, "Tên công ty"),
    companyDescription,
    companyDetail: getString(
      company.industry,
      jobCompany.industry,
      basicInfo.roleType,
      basicInfo.workModel,
      "Thông tin chi tiết",
    ),
    jobTitle: getString(job.title, basicInfo.title, raw.jobTitle, raw.title, "Vị trí tuyển dụng"),
    location: getLocation(job, basicInfo) || "Vị trí",
    logoUrl: getString(company.logoUrl, company.logo, jobCompany.logoUrl, jobCompany.logo) || undefined,
    status,
    hasApplied,
    appliedAt,
    currentProcessIndex,
    currentStageNote: currentStatusLog?.note || defaultStageNote,
    currentStageLoggedAt: currentStatusLog?.createdAt || currentStatusLog?.updatedAt || appliedAt || getString(raw.createdAt, raw.created_at),
    currentStageLabel: hasApplied ? PROCESS_LABELS[currentProcessIndex] || status : "Chưa ứng tuyển",
    summary,
    jobDescription,
    requirements: getString(
      raw.requirements,
      requirements.requiredEducation,
      requirements.description,
      basicInfo.requirements,
      basicInfo.jobDescription,
      "Yêu cầu công việc sẽ được cập nhật sau.",
    ),
    processLabels: PROCESS_LABELS,
  };
};
