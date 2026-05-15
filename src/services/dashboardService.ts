/**
 * API Service for Recruitment Dashboard
 *
 * Gọi API thật từ backend endpoint: GET /api/recruiter-dashboard/me
 * API trả về toàn bộ dữ liệu dashboard trong một response duy nhất.
 */

import { getStoredAccessToken } from './auth';

// ══════════════════════════════════════════════════════════════
// Config
// ══════════════════════════════════════════════════════════════

const API_BASE_URL =
  (
    import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  ).replace(/\/+$/, '');

// ══════════════════════════════════════════════════════════════
// Interfaces — shapes used by the Dashboard component
// ══════════════════════════════════════════════════════════════

export interface DashboardStats {
  candidates: { value: number; trend: string };
  positions: { value: number };
  cvsReceived: { value: number };
  hired: { value: number };
}

export interface ApplicationStat {
  key?: string;
  day: string;
  count: number;
  secondaryCount: number;
}

export interface StatusOverviewItem {
  key: string;
  label: string;
  count: number;
  percentage: number;
}

export interface StatusOverview {
  total: number;
  items: StatusOverviewItem[];
}

export interface RecentApplication {
  id: string;
  name: string;
  position: string;
  recruiter: string;
  recruiterAvatar: string;
  date: string;
  status: 'Review' | 'Interview' | 'Pending' | 'Hired' | 'Offered';
}

export interface UpcomingInterview {
  id: string;
  tag: string;
  time: string;
  candidateName: string;
  interviewer: string;
  interviewerAvatar: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string | null;
  candidate: { id: string; fullName: string; avatarUrl: string | null };
  job: { id: string; title: string; roleType: string };
}

export interface RecruiterInfo {
  id: string;
  fullName: string;
  avatarUrl: string | null;
  role: string;
  email: string | null;
  membershipRole: string;
  jobTitle: string;
}

export interface CompanyInfo {
  id: string;
  name: string;
  shortName: string;
  logoUrl: string | null;
}

export interface DashboardData {
  recruiter: RecruiterInfo;
  company: CompanyInfo;
  stats: DashboardStats;
  chartData: ApplicationStat[];
  statusOverview: StatusOverview;
  recentApplications: RecentApplication[];
  upcomingInterviews: UpcomingInterview[];
  notifications: Notification[];
}

// ══════════════════════════════════════════════════════════════
// API response shape (from backend)
// ══════════════════════════════════════════════════════════════

interface ApiSummaryCard {
  key: string;
  label: string;
  value: number;
  changePercent?: number;
  meta?: Record<string, unknown>;
}

interface ApiChartDataPoint {
  key: string;
  label: string;
  received: number;
  qualified: number;
}

interface ApiRecentApplication {
  id: string;
  candidate: { id: string; fullName: string; avatarUrl: string | null; email?: string | null };
  job: { id: string; title: string; roleType: string; status?: string };
  status: string;
  statusLabel: string;
  screeningScore: number | null;
  appliedAt: string | null;
  updatedAt: string | null;
}

interface ApiUpcomingInterview {
  id: string;
  title: string;
  interviewMode: string;
  sessionType: string;
  status: string;
  startTime: string | null;
  endTime: string | null;
  candidate: { id: string; fullName: string; avatarUrl: string | null };
  job: { id: string; title: string; roleType: string };
}

interface ApiNotification {
  id: string;
  type: string;
  title: string;
  description: string;
  createdAt: string | null;
  candidate: { id: string; fullName: string; avatarUrl: string | null };
  job: { id: string; title: string; roleType: string };
}

interface ApiDashboardResponse {
  message: string;
  data: {
    recruiter: RecruiterInfo;
    company: CompanyInfo;
    overview: Record<string, number>;
    summaryCards: ApiSummaryCard[];
    applicationsChart: { period: string; data: ApiChartDataPoint[] };
    statusOverview: { total: number; items: StatusOverviewItem[] };
    activity: {
      notifications: ApiNotification[];
      upcomingInterviews: ApiUpcomingInterview[];
    };
    recentApplications: ApiRecentApplication[];
    meta: { generatedAt: string };
  };
}

// ══════════════════════════════════════════════════════════════
// Custom error for dashboard API failures
// ══════════════════════════════════════════════════════════════

export class DashboardApiError extends Error {
  status: number;
  isAuthError: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'DashboardApiError';
    this.status = status;
    this.isAuthError = status === 401;
  }
}

// ══════════════════════════════════════════════════════════════
// Auth-aware fetch helper
// ══════════════════════════════════════════════════════════════

const authFetch = async (endpoint: string): Promise<Response> => {
  const token = getStoredAccessToken();
  if (!token) {
    throw new DashboardApiError('Chưa đăng nhập. Vui lòng đăng nhập lại.', 401);
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return response;
};

// ══════════════════════════════════════════════════════════════
// Mappers — transform API response to component-friendly shapes
// ══════════════════════════════════════════════════════════════

const mapStatusToDisplay = (status: string): RecentApplication['status'] => {
  switch (status) {
    case 'applied':
    case 'screening_passed':
      return 'Review';
    case 'ai_interview_completed':
    case 'manual_interview_completed':
      return 'Interview';
    case 'offered':
      return 'Offered';
    case 'hired':
      return 'Hired';
    default:
      return 'Pending';
  }
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatTime = (start: string | null, end: string | null): string => {
  if (!start) return '';
  const fmt = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return end ? `${fmt(start)} - ${fmt(end)}` : fmt(start);
};

const formatTrend = (percent: number): string => {
  return percent >= 0 ? `+${percent}%` : `${percent}%`;
};

const mapStats = (summaryCards: ApiSummaryCard[]): DashboardStats => {
  const findCard = (key: string) => summaryCards.find((c) => c.key === key);

  const candidatesCard = findCard('potentialCandidates');
  const positionsCard = findCard('positions');
  const cvsCard = findCard('resumesReceived');
  const hiredCard = findCard('hired');

  return {
    candidates: {
      value: candidatesCard?.value ?? 0,
      trend: formatTrend(candidatesCard?.changePercent ?? 0),
    },
    positions: { value: positionsCard?.value ?? 0 },
    cvsReceived: { value: cvsCard?.value ?? 0 },
    hired: { value: hiredCard?.value ?? 0 },
  };
};

const normalizeCount = (value: unknown): number => {
  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : 0;
};

const mapChartData = (chartPoints: ApiChartDataPoint[]): ApplicationStat[] => {
  if (chartPoints.length === 0) return [];

  return chartPoints.map((point) => ({
    key: point.key,
    day: point.label,
    count: normalizeCount(point.received),
    secondaryCount: normalizeCount(point.qualified),
  }));
};

const mapRecentApplications = (apps: ApiRecentApplication[]): RecentApplication[] => {
  return apps.map((app) => ({
    id: app.id,
    name: app.candidate.fullName || 'N/A',
    position: app.job.roleType || app.job.title || 'N/A',
    recruiter: '',
    recruiterAvatar: app.candidate.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${app.candidate.id}`,
    date: formatDate(app.appliedAt),
    status: mapStatusToDisplay(app.status),
  }));
};

const mapUpcomingInterviews = (interviews: ApiUpcomingInterview[]): UpcomingInterview[] => {
  return interviews.map((iv) => ({
    id: iv.id,
    tag: iv.job.roleType || iv.interviewMode || 'Interview',
    time: formatTime(iv.startTime, iv.endTime),
    candidateName: iv.candidate.fullName || 'Ứng viên',
    interviewer: '',
    interviewerAvatar: iv.candidate.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${iv.candidate.id}`,
  }));
};

const mapNotifications = (notifications: ApiNotification[]): Notification[] => {
  return notifications.map((n) => ({
    id: n.id,
    type: n.type,
    title: n.title,
    description: n.description,
    createdAt: n.createdAt,
    candidate: n.candidate,
    job: n.job,
  }));
};

// ══════════════════════════════════════════════════════════════
// Transform full API response into DashboardData
// ══════════════════════════════════════════════════════════════

const transformApiResponse = (json: ApiDashboardResponse): DashboardData => {
  const data = json.data;

  return {
    recruiter: data.recruiter,
    company: data.company,
    stats: mapStats(data.summaryCards),
    chartData: mapChartData(data.applicationsChart.data),
    statusOverview: data.statusOverview,
    recentApplications: mapRecentApplications(data.recentApplications),
    upcomingInterviews: mapUpcomingInterviews(data.activity.upcomingInterviews),
    notifications: mapNotifications(data.activity.notifications),
  };
};

// ══════════════════════════════════════════════════════════════
// Public API — gọi trực tiếp backend, không fallback mock data
// ══════════════════════════════════════════════════════════════

export const dashboardService = {
  /**
   * Gọi GET /api/recruiter-dashboard/me và map toàn bộ dữ liệu.
   * Throw lỗi nếu API fail — component tự xử lý hiển thị lỗi.
   */
  getDashboard: async (period: 'week' | 'month' = 'week'): Promise<DashboardData> => {
    const response = await authFetch(`/api/recruiter-dashboard/me?period=${period}`);

    if (!response.ok) {
      let errorMessage = 'Không thể tải dữ liệu dashboard.';
      try {
        const errorBody = await response.json();
        errorMessage = errorBody?.error || errorBody?.message || errorMessage;
      } catch {
        // ignore parse errors
      }
      throw new DashboardApiError(errorMessage, response.status);
    }

    const json = (await response.json()) as ApiDashboardResponse;
    return transformApiResponse(json);
  },

  // Convenience methods (all delegate to getDashboard)
  getStats: async (): Promise<DashboardStats> => {
    const data = await dashboardService.getDashboard();
    return data.stats;
  },

  getChartData: async (): Promise<ApplicationStat[]> => {
    const data = await dashboardService.getDashboard();
    return data.chartData;
  },

  getRecentApplications: async (): Promise<RecentApplication[]> => {
    const data = await dashboardService.getDashboard();
    return data.recentApplications;
  },

  getUpcomingInterviews: async (): Promise<UpcomingInterview[]> => {
    const data = await dashboardService.getDashboard();
    return data.upcomingInterviews;
  },
};
