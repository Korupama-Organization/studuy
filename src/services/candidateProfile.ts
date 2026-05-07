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
    skillId?: string;
    yearsOfExperience: number;
    confidence?: boolean;
}

export interface TechnicalSkillResponse {
    skillId: string;
    yearsOfExperience: number;
    confidence: boolean;
    skill: {
        _id: string;
        name: string;
        category: string;
    } | null;
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
    technologySkills: {
        _id: string;
        name: string;
        category: string;
    }[];
}

export interface WorkExperiencePayload {
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    technologiesUsed: string[];
}

export interface WorkExperienceResponse extends WorkExperiencePayload {
    technologyUsedSkills: {
        _id: string;
        name: string;
        category: string;
    }[];
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
    academicInfo: AcademicInfo;
    languages: Language[];
    achievements: Achievement[];
    advantagePoint: string;
    technicalSkills: TechnicalSkillResponse[];
    softSkills: string[];
    projects: ProjectResponse[];
    workExperiences: WorkExperienceResponse[];
    introductionQuestions: IntroductionQuestions;
    createdAt: string;
    updatedAt: string;
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
    };
}

export interface CompletionResponse {
    message: string;
    data: ProfileCompletionData;
}

export interface DashboardResponse {
    message: string;
    data: unknown;
}

// ── Helpers ──

interface ApiErrorShape {
    message?: string;
    error?: string;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.toString().trim() || 'http://localhost:3000';

const buildApiUrl = (path: string): string => {
    return new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`).toString();
};

const toErrorMessage = (fallback: string, payload?: ApiErrorShape): string => {
    if (!payload) return fallback;
    if (typeof payload.message === 'string' && payload.message.trim()) return payload.message;
    if (typeof payload.error === 'string' && payload.error.trim()) return payload.error;
    return fallback;
};

const authHeaders = (): HeadersInit => {
    const token = getStoredAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

// ── API functions ──

export const updateCandidateProfile = async (
    payload: UpdateCandidateProfilePayload,
): Promise<UpdateProfileResponse> => {
    const response = await fetch(buildApiUrl('/api/candidate-profiles/me'), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    let responsePayload: UpdateProfileResponse | ApiErrorShape | null = null;
    try {
        responsePayload = (await response.json()) as UpdateProfileResponse | ApiErrorShape;
    } catch {
        responsePayload = null;
    }

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Cập nhật hồ sơ thất bại.', responsePayload as ApiErrorShape),
        );
    }

    return responsePayload as UpdateProfileResponse;
};

export const getProfileCompletion = async (): Promise<CompletionResponse> => {
    const response = await fetch(buildApiUrl('/api/candidate-profiles/me/completion'), {
        method: 'GET',
        headers: authHeaders(),
    });

    let payload: CompletionResponse | ApiErrorShape | null = null;
    try {
        payload = (await response.json()) as CompletionResponse | ApiErrorShape;
    } catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Không thể lấy thông tin hoàn thành hồ sơ.', payload as ApiErrorShape),
        );
    }

    return payload as CompletionResponse;
};

export const getCandidateDashboard = async (): Promise<DashboardResponse> => {
    const response = await fetch(buildApiUrl('/api/candidate-profiles/me/dashboard'), {
        method: 'GET',
        headers: authHeaders(),
    });

    let payload: DashboardResponse | ApiErrorShape | null = null;
    try {
        payload = (await response.json()) as DashboardResponse | ApiErrorShape;
    } catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(
            toErrorMessage('Không thể lấy dữ liệu dashboard.', payload as ApiErrorShape),
        );
    }

    return payload as DashboardResponse;
};
