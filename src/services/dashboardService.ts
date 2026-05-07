/**
 * API Service for Recruitment Dashboard
 * 
 * Gọi API thật từ backend. Nếu API chưa sẵn sàng hoặc lỗi,
 * tự động fallback về dữ liệu mock để dashboard vẫn hiển thị.
 * 
 * Khi backend đã có endpoint, chỉ cần bật USE_REAL_API = true
 * và đảm bảo các endpoint path đúng.
 */

import { getStoredAccessToken } from './auth';

// ══════════════════════════════════════════════════════════════
// Config
// ══════════════════════════════════════════════════════════════

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString().trim() || 'http://localhost:3000';

/** Bật true khi backend đã có endpoint dashboard */
const USE_REAL_API = false;

// ══════════════════════════════════════════════════════════════
// Interfaces
// ══════════════════════════════════════════════════════════════

export interface DashboardStats {
  candidates: { value: number; trend: string };
  positions: { value: number };
  cvsReceived: { value: string };
  hired: { value: number };
}

export interface ApplicationStat {
  day: string;
  count: number;
  secondaryCount: number;
}

export interface RecentApplication {
  id: number;
  name: string;
  position: string;
  recruiter: string;
  recruiterAvatar: string;
  date: string;
  status: 'Review' | 'Interview' | 'Pending';
}

export interface UpcomingInterview {
  id: number;
  tag: string;
  time: string;
  candidateName: string;
  interviewer: string;
  interviewerAvatar: string;
}

// ══════════════════════════════════════════════════════════════
// Auth-aware fetch helper
// ══════════════════════════════════════════════════════════════

const authFetch = async (endpoint: string): Promise<Response> => {
  const token = getStoredAccessToken();
  return fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// ══════════════════════════════════════════════════════════════
// Mock Data
// ══════════════════════════════════════════════════════════════

const MOCK_STATS: DashboardStats = {
  candidates: { value: 2450, trend: '+12%' },
  positions: { value: 18 },
  cvsReceived: { value: '1,204' },
  hired: { value: 45 },
};

const MOCK_CHART_DATA: ApplicationStat[] = [
  { day: 'T2', count: 60, secondaryCount: 40 },
  { day: 'T3', count: 45, secondaryCount: 55 },
  { day: 'T4', count: 85, secondaryCount: 35 },
  { day: 'T5', count: 50, secondaryCount: 70 },
  { day: 'T6', count: 75, secondaryCount: 45 },
  { day: 'T7', count: 40, secondaryCount: 60 },
  { day: 'CN', count: 30, secondaryCount: 25 },
];

const MOCK_APPLICATIONS: RecentApplication[] = [
  {
    id: 1,
    name: 'Nguyễn Văn An',
    position: 'Frontend Developer',
    recruiter: 'Trần Minh',
    recruiterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tran',
    date: '07/05/2026',
    status: 'Review',
  },
  {
    id: 2,
    name: 'Lê Thị Bình',
    position: 'Backend Engineer',
    recruiter: 'Phạm Hương',
    recruiterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pham',
    date: '06/05/2026',
    status: 'Interview',
  },
  {
    id: 3,
    name: 'Phạm Quốc Cường',
    position: 'UI/UX Designer',
    recruiter: 'Ngô Lan',
    recruiterAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ngo',
    date: '05/05/2026',
    status: 'Pending',
  },
];

const MOCK_INTERVIEWS: UpcomingInterview[] = [
  {
    id: 1,
    tag: 'Frontend',
    time: '10:00 - 11:00',
    candidateName: 'Nguyễn Văn An',
    interviewer: 'Trần Minh',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tran',
  },
  {
    id: 2,
    tag: 'Backend',
    time: '14:00 - 15:00',
    candidateName: 'Lê Thị Bình',
    interviewer: 'Phạm Hương',
    interviewerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pham',
  },
];

// ══════════════════════════════════════════════════════════════
// Service helpers
// ══════════════════════════════════════════════════════════════

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchOrFallback<T>(endpoint: string, fallback: T): Promise<T> {
  if (!USE_REAL_API) {
    await delay(600);
    return fallback;
  }

  try {
    const response = await authFetch(endpoint);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return (await response.json()) as T;
  } catch (error) {
    console.warn(`[dashboardService] API call failed for ${endpoint}, using mock data:`, error);
    return fallback;
  }
}

// ══════════════════════════════════════════════════════════════
// Public API
// ══════════════════════════════════════════════════════════════

export const dashboardService = {
  getStats: () => fetchOrFallback<DashboardStats>('/api/dashboard/stats', MOCK_STATS),

  getChartData: () => fetchOrFallback<ApplicationStat[]>('/api/dashboard/chart-data', MOCK_CHART_DATA),

  getRecentApplications: () =>
    fetchOrFallback<RecentApplication[]>('/api/dashboard/recent-applications', MOCK_APPLICATIONS),

  getUpcomingInterviews: () =>
    fetchOrFallback<UpcomingInterview[]>('/api/dashboard/upcoming-interviews', MOCK_INTERVIEWS),
};
