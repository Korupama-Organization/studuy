export interface CandidateApplicationCard {
  id: string;
  companyName: string;
  companyDetail: string;
  jobTitle: string;
  location: string;
  logoUrl?: string;
  status: string;
  currentProcessIndex: number;
  summary: string;
  requirements: string;
  processLabels: string[];
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
  submitted: 0,
  screening: 1,
  reviewed: 1,
  interview: 2,
  hr_interview: 2,
  technical_interview: 3,
  offer: 4,
  offered: 4,
  hired: 5,
  accepted: 5,
  completed: 5,
  rejected: 5,
};

export const mockCandidateApplications: CandidateApplicationCard[] = [
  {
    id: "mock-application-1",
    companyName: "CodeQuest Solutions",
    companyDetail: "Công ty công nghệ sản phẩm tại Việt Nam",
    jobTitle: "Frontend Developer",
    location: "Thành phố Hồ Chí Minh",
    status: "Phỏng vấn HR",
    currentProcessIndex: 2,
    summary: "Tham gia xây dựng giao diện web cho nền tảng tuyển dụng, làm việc cùng đội sản phẩm và backend để tối ưu trải nghiệm ứng viên.",
    requirements: "React, TypeScript, tư duy UI tốt và có kinh nghiệm làm việc với REST API.",
    processLabels: PROCESS_LABELS,
  },
  {
    id: "mock-application-2",
    companyName: "TechVision Inc.",
    companyDetail: "Đội ngũ AI tuyển dụng và đánh giá năng lực",
    jobTitle: "Full Stack Developer",
    location: "Hà Nội",
    status: "Sàng lọc",
    currentProcessIndex: 1,
    summary: "Phát triển các tính năng quản lý ứng tuyển, dashboard và luồng phỏng vấn thử cho candidate.",
    requirements: "Node.js, React, MongoDB, khả năng giao tiếp rõ ràng và chủ động xử lý vấn đề.",
    processLabels: PROCESS_LABELS,
  },
];

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
};

const getNestedRecord = (record: Record<string, unknown>, key: string): Record<string, unknown> => {
  const value = record[key];
  return isRecord(value) ? value : {};
};

const getLocation = (job: Record<string, unknown>, basicInfo: Record<string, unknown>): string => {
  const locations = basicInfo.locations ?? job.locations;

  if (Array.isArray(locations)) {
    return locations.filter((item): item is string => typeof item === "string" && item.trim().length > 0).join(", ");
  }

  return getString(basicInfo.location, job.location, job.workLocation);
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

  const normalizedStatus = status.toLowerCase().replace(/[\s-]+/g, "_");
  return STATUS_INDEX[normalizedStatus] ?? 0;
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
  const job = getNestedRecord(raw, "job");
  const basicInfo = getNestedRecord(job, "basicInfo");
  const company = getNestedRecord(raw, "company");
  const jobCompany = getNestedRecord(job, "company");
  const requirements = getNestedRecord(job, "requirements");
  const status = getString(raw.status, raw.stage, raw.process, "Ứng tuyển");
  const summary = getString(
    raw.summary,
    job.summary,
    basicInfo.summary,
    basicInfo.shortDescription,
    basicInfo.jobDescription,
    "Thông tin mô tả công việc sẽ được cập nhật sau.",
  );

  return {
    id: getString(raw._id, raw.id, raw.applicationId, crypto.randomUUID()),
    companyName: getString(company.name, jobCompany.name, raw.companyName, job.companyName, "Tên công ty"),
    companyDetail: getString(company.description, jobCompany.description, company.industry, jobCompany.industry, "Thông tin chi tiết"),
    jobTitle: getString(job.title, basicInfo.title, raw.jobTitle, raw.title, "Vị trí tuyển dụng"),
    location: getLocation(job, basicInfo) || "Vị trí",
    logoUrl: getString(company.logoUrl, company.logo, jobCompany.logoUrl, jobCompany.logo) || undefined,
    status,
    currentProcessIndex: getProcessIndex(raw, status),
    summary,
    requirements: getString(
      raw.requirements,
      requirements.requiredEducation,
      requirements.description,
      basicInfo.requirements,
      "Yêu cầu công việc sẽ được cập nhật sau.",
    ),
    processLabels: PROCESS_LABELS,
  };
};
