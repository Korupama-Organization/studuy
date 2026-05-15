import { buildApiUrl } from './api';
import { getStoredAccessToken } from './auth';

// ── Types ──

export interface AcademicInfo {
    university: string;
    major: string;
    graduationYear: number;
    gpa?: number;
}

export interface Language {
    certificateName: string;
    score: number;
    issuedAt: string;
    expiresAt: string;
}

export interface Achievement {
    title: string;
    achievedAt: string;
}

export interface TechnicalSkillPayload {
    category?: string;
    name?: string;
    skillId?: string | null;
    yearsOfExperience: number;
    confidence?: boolean;
}

export interface SkillSummary {
    _id: string;
    name: string;
    category: string;
}

export interface TechnicalSkillResponse {
    skillId: string | null;
    yearsOfExperience: number;
    confidence: boolean;
    skill: SkillSummary | null;
}

export interface ProjectPayload {
    name: string;
    description: string;
    technologies: string[];
    role: string;
    contribution: string;
    startDate: string;
    endDate: string;
    teamSize: number;
    repositoryUrl?: string;
    reportUrl?: string;
}

export interface ProjectResponse extends ProjectPayload {
    technologySkills: SkillSummary[];
}

export interface WorkExperiencePayload {
    companyName: string;
    position: string;
    startDate: string;
    endDate?: string;
    description: string;
    technologiesUsed: string[];
}

export interface WorkExperienceResponse extends WorkExperiencePayload {
    technologyUsedSkills: SkillSummary[];
}

export interface IntroductionQuestions {
    preferredRoles: { preferredRole: string }[];
    whyTheseRoles: string;
    futureGoals: string;
    favoriteTechnology: string;
}

export interface CandidateProfileData {
    _id: string;
    userId: string;
    academicInfo?: AcademicInfo;
    languages?: Language[];
    achievements?: Achievement[];
    advantagePoint?: string;
    technicalSkills?: TechnicalSkillResponse[];
    softSkills?: string[];
    projects?: ProjectResponse[];
    workExperiences?: WorkExperienceResponse[];
    introductionQuestions?: IntroductionQuestions;
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdateCandidateProfilePayload {
    academicInfo?: AcademicInfo;
    languages?: Language[];
    achievements?: Achievement[];
    advantagePoint?: string;
    technicalSkills?: TechnicalSkillPayload[];
    softSkills?: string[];
    projects?: ProjectPayload[];
    workExperiences?: WorkExperiencePayload[];
    introductionQuestions?: IntroductionQuestions;
}

export interface CompletionWarning {
    field: string;
    message: string;
}

export interface ProfileCompletionData {
    hasProfile: boolean;
    totalCriteria: number;
    completedCriteria: number;
    completionPercentage: number;
    status: 'empty' | 'incomplete' | 'almost_complete' | 'complete';
    completedFields: string[];
    missingFields: string[];
    warnings: CompletionWarning[];
    nextRecommendedFields: string[];
}

export interface UpdateProfileResponse {
    message: string;
    data: CandidateProfileData;
    meta: {
        matchedCount: number;
        modifiedCount: number;
    } | null;
}

export interface CompletionResponse {
    message: string;
    data: ProfileCompletionData;
}

export interface DashboardJobMatch {
    jobId: string;
    title: string;
    summary: string;
    company: {
        id: string;
        name: string;
        logoUrl: string | null;
    };
    location: string;
    workModel: string;
    level: string;
    jobType: string;
    status: string;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
    requiredSkillCount: number;
    matchedSkillCount: number;
    createdAt: string | null;
}

export interface DashboardProfile {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    role: string;
    hasProfile: boolean;
    completionPercentage: number;
    status: 'empty' | 'incomplete' | 'almost_complete' | 'complete';
    nextRecommendedFields: string[];
}

export interface DashboardQuickStats {
    appliedJobs: number;
    matchedJobs: number;
    profileCompletion: number;
    interviews?: number;
    savedJobs?: number;
}

export interface DashboardAIReport {
    id: string;
    comment: string;
    status: string;
    videoUrl: string | null;
}

export interface DashboardRecentMockInterview {
    id: string;
    overallScore: number;
    scores: Record<string, number>;
    summary: string;
}

export interface CandidateDashboardData {
    profile: DashboardProfile;
    quickStats: DashboardQuickStats;
    jobMatches: DashboardJobMatch[];
    aiInterviewReports?: DashboardAIReport[];
    recentMockInterview?: DashboardRecentMockInterview | null;
}

export interface DashboardResponse {
    message: string;
    data: CandidateDashboardData;
}

// ── Helpers ──

interface ApiErrorShape {
    message?: string | string[];
    error?: string | string[];
}

const firstText = (value?: string | string[]): string => {
    if (Array.isArray(value)) {
        return value.find((item) => typeof item === 'string' && item.trim()) || '';
    }

    return typeof value === 'string' ? value : '';
};

const toErrorMessage = (fallback: string, payload?: ApiErrorShape): string => {
    if (!payload) return fallback;

    const message = firstText(payload.message).trim();
    if (message) return message;

    const error = firstText(payload.error).trim();
    if (error) return error;

    return fallback;
};

const authHeaders = (): HeadersInit => {
    const token = getStoredAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const parseJsonOrNull = async <T>(response: Response): Promise<T | null> => {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
};

// ── API functions ──

export interface GetProfileResponse {
    message: string;
    data: CandidateProfileData | null;
}

export const getCandidateProfile = async (): Promise<GetProfileResponse> => {
    const response = await fetch(buildApiUrl('api/candidate-profiles/me'), {
        method: 'GET',
        headers: authHeaders(),
    });

    const payload = await parseJsonOrNull<GetProfileResponse | ApiErrorShape>(response);

    if (response.status === 404) {
        return {
            message: 'Candidate profile not found',
            data: null,
        };
    }

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Không thể lấy dữ liệu hồ sơ.', payload as ApiErrorShape),
        );
    }

    return (payload || { message: 'OK', data: null }) as GetProfileResponse;
};

export const updateCandidateProfile = async (
    payload: UpdateCandidateProfilePayload,
): Promise<UpdateProfileResponse> => {
    const response = await fetch(buildApiUrl('api/candidate-profiles/me'), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const responsePayload = await parseJsonOrNull<UpdateProfileResponse | ApiErrorShape>(response);

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Cập nhật hồ sơ thất bại.', responsePayload as ApiErrorShape),
        );
    }

    return responsePayload as UpdateProfileResponse;
};

export const getProfileCompletion = async (): Promise<CompletionResponse> => {
    const response = await fetch(buildApiUrl('api/candidate-profiles/me/completion'), {
        method: 'GET',
        headers: authHeaders(),
    });

    const payload = await parseJsonOrNull<CompletionResponse | ApiErrorShape>(response);

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Không thể lấy thông tin hoàn thành hồ sơ.', payload as ApiErrorShape),
        );
    }

    return payload as CompletionResponse;
};

export const getCandidateDashboard = async (): Promise<DashboardResponse> => {
    const response = await fetch(buildApiUrl('api/candidate-profiles/me/dashboard'), {
        method: 'GET',
        headers: authHeaders(),
    });

    const payload = await parseJsonOrNull<DashboardResponse | ApiErrorShape>(response);

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Không thể lấy dữ liệu dashboard.', payload as ApiErrorShape),
        );
    }

    return payload as DashboardResponse;
};
