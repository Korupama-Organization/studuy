import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';
import {
    getCandidateProfile,
    getProfileCompletion,
    updateCandidateProfile,
    type CandidateProfileData,
    type ProfileCompletionData,
    type UpdateCandidateProfilePayload,
    type AcademicInfo,
    type Language,
    type Achievement,
    type TechnicalSkillPayload,
    type TechnicalSkillResponse,
    type ProjectPayload,
    type ProjectResponse,
    type WorkExperiencePayload,
    type WorkExperienceResponse,
    type IntroductionQuestions,
} from '../../services/candidateProfile';
import { hasValidStoredAccessToken, refreshAuthSession } from '../../services/auth';

// ── Form state types ──

export interface ProfileFormState {
    // Step 1: Basic info (user-level — these are not part of candidate-profile API)
    // They are local-only for now since the backend doesn't handle them via candidate-profile
    fullName: string;
    studentId: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    githubUrl: string;
    linkedinUrl: string;
    facebookUrl: string;
    portfolioUrl: string;

    // Step 2: Education & Skills (from CandidateProfile API)
    academicInfo: AcademicInfo;
    technicalSkills: TechnicalSkillPayload[];
    technicalSkillsDisplay: TechnicalSkillResponse[];
    softSkills: string[];
    languages: Language[];

    // Step 3: Projects & Experiences
    projects: ProjectPayload[];
    projectsDisplay: ProjectResponse[];
    workExperiences: WorkExperiencePayload[];
    workExperiencesDisplay: WorkExperienceResponse[];

    // Step 4: Career goals
    introductionQuestions: IntroductionQuestions;
    advantagePoint: string;
    achievements: Achievement[];
}

const EMPTY_ACADEMIC_INFO: AcademicInfo = {
    university: '',
    major: '',
    graduationYear: new Date().getFullYear() + 1,
    gpa: undefined,
};

const EMPTY_INTRODUCTION: IntroductionQuestions = {
    preferredRoles: [],
    whyTheseRoles: '',
    futureGoals: '',
    favoriteTechnology: '',
};

const initialFormState: ProfileFormState = {
    fullName: '',
    studentId: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    githubUrl: '',
    linkedinUrl: '',
    facebookUrl: '',
    portfolioUrl: '',
    academicInfo: { ...EMPTY_ACADEMIC_INFO },
    technicalSkills: [],
    technicalSkillsDisplay: [],
    softSkills: [],
    languages: [],
    projects: [],
    projectsDisplay: [],
    workExperiences: [],
    workExperiencesDisplay: [],
    introductionQuestions: { ...EMPTY_INTRODUCTION },
    advantagePoint: '',
    achievements: [],
};

export interface ProfileFormContextValue {
    form: ProfileFormState;
    setForm: React.Dispatch<React.SetStateAction<ProfileFormState>>;
    updateField: <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => void;

    completion: ProfileCompletionData | null;
    completionLoading: boolean;
    refreshCompletion: () => Promise<void>;

    saving: boolean;
    saveError: string | null;
    saveSuccess: string | null;
    clearMessages: () => void;

    saveStep2: () => Promise<boolean>;
    saveStep3: () => Promise<boolean>;
    saveStep4: () => Promise<boolean>;
    saveAllSteps: () => Promise<boolean>;
    saveDraft: (step?: number) => Promise<boolean>;

    profileLoaded: boolean;
    profileLoading: boolean;
    isAuthenticated: boolean;
    profileData: CandidateProfileData | null;
}

const ProfileFormContext = createContext<ProfileFormContextValue | null>(null);

export const useProfileForm = (): ProfileFormContextValue => {
    const ctx = useContext(ProfileFormContext);
    if (!ctx) {
        throw new Error('useProfileForm must be used inside <ProfileFormProvider>');
    }
    return ctx;
};

// ── Helper to populate form from API data ──

const populateFormFromProfile = (profile: CandidateProfileData): Partial<ProfileFormState> => {
    const techSkillsPayload: TechnicalSkillPayload[] = (profile.technicalSkills || []).map((ts) => ({
        skillId: ts.skillId,
        category: ts.skill?.category || 'Khác',
        name: ts.skill?.name || '',
        yearsOfExperience: ts.yearsOfExperience || 0,
        confidence: typeof ts.confidence === 'boolean' ? ts.confidence : true,
    }));

    const projectsPayload: ProjectPayload[] = (profile.projects || []).map((p) => ({
        name: p.name,
        description: p.description,
        technologies: p.technologies || [],
        role: p.role,
        contribution: p.contribution,
        startDate: p.startDate ? p.startDate.substring(0, 10) : '',
        endDate: p.endDate ? p.endDate.substring(0, 10) : '',
        teamSize: p.teamSize,
        repositoryUrl: p.repositoryUrl || '',
        reportUrl: p.reportUrl || '',
    }));

    const workExpsPayload: WorkExperiencePayload[] = (profile.workExperiences || []).map((w) => ({
        companyName: w.companyName,
        position: w.position,
        startDate: w.startDate ? w.startDate.substring(0, 10) : '',
        endDate: w.endDate ? w.endDate.substring(0, 10) : '',
        description: w.description,
        technologiesUsed: w.technologiesUsed || [],
    }));

    return {
        academicInfo: profile.academicInfo || { ...EMPTY_ACADEMIC_INFO },
        technicalSkills: techSkillsPayload,
        technicalSkillsDisplay: profile.technicalSkills || [],
        softSkills: profile.softSkills || [],
        languages: (profile.languages || []).map((l) => ({
            ...l,
            issuedAt: l.issuedAt ? l.issuedAt.substring(0, 10) : '',
            expiresAt: l.expiresAt ? l.expiresAt.substring(0, 10) : '',
        })),
        projects: projectsPayload,
        projectsDisplay: profile.projects || [],
        workExperiences: workExpsPayload,
        workExperiencesDisplay: profile.workExperiences || [],
        introductionQuestions: profile.introductionQuestions || { ...EMPTY_INTRODUCTION },
        advantagePoint: profile.advantagePoint || '',
        achievements: (profile.achievements || []).map((a) => ({
            ...a,
            achievedAt: a.achievedAt ? a.achievedAt.substring(0, 10) : '',
        })),
    };
};

// ── Provider ──

export const ProfileFormProvider = ({ children }: { children: ReactNode }) => {
    const [form, setForm] = useState<ProfileFormState>({ ...initialFormState });
    const [completion, setCompletion] = useState<ProfileCompletionData | null>(null);
    const [completionLoading, setCompletionLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [profileLoaded, setProfileLoaded] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileData, setProfileData] = useState<CandidateProfileData | null>(null);
    const fetchedRef = useRef(false);
    const isAuthenticated = hasValidStoredAccessToken();

    // Load user info from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                setForm((prev) => ({
                    ...prev,
                    fullName: user.fullName || '',
                    email: user.contactInfo?.email || '',
                }));
            }
        } catch {
            // ignore
        }
    }, []);

    const updateField = useCallback(<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const clearMessages = useCallback(() => {
        setSaveError(null);
        setSaveSuccess(null);
    }, []);

    // Fetch profile completion on mount
    const refreshCompletion = useCallback(async () => {
        let validToken = hasValidStoredAccessToken();
        if (!validToken) {
            validToken = await refreshAuthSession();
        }
        if (!validToken) return;
        
        setCompletionLoading(true);
        try {
            const result = await getProfileCompletion();
            setCompletion(result.data);
        } catch (err: unknown) {
            console.error('Failed to fetch completion:', err);
        } finally {
            setCompletionLoading(false);
        }
    }, []);

    // Fetch existing profile data on mount to hydrate form
    const fetchProfile = useCallback(async () => {
        let validToken = hasValidStoredAccessToken();
        if (!validToken) {
            validToken = await refreshAuthSession();
        }
        if (!validToken) return;

        setProfileLoading(true);
        try {
            const result = await getCandidateProfile();
            if (result.data) {
                setProfileData(result.data);
                const formUpdates = populateFormFromProfile(result.data);
                setForm((prev) => ({ ...prev, ...formUpdates }));
            }
            setProfileLoaded(true);
        } catch (err: unknown) {
            console.error('Failed to fetch profile:', err);
            setProfileLoaded(true);
        } finally {
            setProfileLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            refreshCompletion();
            fetchProfile();
        }
    }, [refreshCompletion, fetchProfile]);

    // Helper: send PATCH and update local state from response
    const performSave = async (payload: UpdateCandidateProfilePayload): Promise<boolean> => {
        let validToken = hasValidStoredAccessToken();
        if (!validToken) {
            validToken = await refreshAuthSession();
        }

        if (!validToken) {
            setSaveError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
            return false;
        }

        setSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            const result = await updateCandidateProfile(payload);
            const updatedProfile = result.data;
            setProfileData(updatedProfile);
            setProfileLoaded(true);

            // Merge API response into form state
            const formUpdates = populateFormFromProfile(updatedProfile);
            setForm((prev) => ({ ...prev, ...formUpdates }));

            setSaveSuccess(result.message || 'Lưu thành công!');

            // Refresh completion
            refreshCompletion();

            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lưu hồ sơ thất bại.';
            setSaveError(errorMessage);
            return false;
        } finally {
            setSaving(false);
        }
    };

    // Step 2: Education & Skills
    const saveStep2 = async (): Promise<boolean> => {
        const payload: UpdateCandidateProfilePayload = {
            academicInfo: {
                ...form.academicInfo,
                graduationYear: Number(form.academicInfo.graduationYear) || new Date().getFullYear() + 1,
                gpa: form.academicInfo.gpa ? Number(form.academicInfo.gpa) : undefined,
            },
            technicalSkills: form.technicalSkills.filter((s) => s.name && s.name.trim()),
            softSkills: form.softSkills,
            languages: form.languages
                .filter((l) => l.certificateName && l.certificateName.trim() && l.issuedAt && l.expiresAt)
                .map((l) => ({
                    ...l,
                    score: Number(l.score),
                })),
        };
        return performSave(payload);
    };

    // Step 3: Projects & Work Experiences
    const saveStep3 = async (): Promise<boolean> => {
        const payload: UpdateCandidateProfilePayload = {
            projects: form.projects
                .filter(p => p.name && p.description && p.role && p.contribution && p.startDate && p.endDate && p.teamSize)
                .map((p) => ({
                    ...p,
                    teamSize: Number(p.teamSize) || 1,
                    technologies: p.technologies,
                })),
            workExperiences: form.workExperiences
                .filter(w => w.companyName && w.position && w.startDate && w.endDate && w.description)
                .map((w) => ({
                    ...w,
                    technologiesUsed: w.technologiesUsed,
                })),
        };
        return performSave(payload);
    };

    // Step 4: Career goals & Strengths
    const saveStep4 = async (): Promise<boolean> => {
        const payload: UpdateCandidateProfilePayload = {
            introductionQuestions: form.introductionQuestions,
            advantagePoint: form.advantagePoint,
            achievements: form.achievements,
        };
        return performSave(payload);
    };

    // Save all at once
    const saveAllSteps = async (): Promise<boolean> => {
        const payload: UpdateCandidateProfilePayload = {
            academicInfo: {
                ...form.academicInfo,
                graduationYear: Number(form.academicInfo.graduationYear) || new Date().getFullYear() + 1,
                gpa: form.academicInfo.gpa ? Number(form.academicInfo.gpa) : undefined,
            },
            technicalSkills: form.technicalSkills.filter((s) => s.name && s.name.trim()),
            softSkills: form.softSkills,
            languages: form.languages
                .filter((l) => l.certificateName && l.certificateName.trim() && l.issuedAt && l.expiresAt)
                .map((l) => ({
                    ...l,
                    score: Number(l.score),
                })),
            projects: form.projects
                .filter(p => p.name && p.description && p.role && p.contribution && p.startDate && p.endDate && p.teamSize)
                .map((p) => ({
                    ...p,
                    teamSize: Number(p.teamSize) || 1,
                    technologies: p.technologies,
                })),
            workExperiences: form.workExperiences.filter(w => w.companyName && w.position && w.startDate && w.endDate && w.description),
            introductionQuestions: form.introductionQuestions,
            advantagePoint: form.advantagePoint,
            achievements: form.achievements,
        };
        return performSave(payload);
    };

    // Save draft for a specific step (or all steps if not specified)
    const saveDraft = async (step?: number): Promise<boolean> => {
        switch (step) {
            case 2: return saveStep2();
            case 3: return saveStep3();
            case 4: return saveStep4();
            default: return saveAllSteps();
        }
    };

    const value: ProfileFormContextValue = {
        form,
        setForm,
        updateField,
        completion,
        completionLoading,
        refreshCompletion,
        saving,
        saveError,
        saveSuccess,
        clearMessages,
        saveStep2,
        saveStep3,
        saveStep4,
        saveAllSteps,
        saveDraft,
        profileLoaded,
        profileLoading,
        isAuthenticated,
        profileData,
    };

    return (
        <ProfileFormContext.Provider value={value}>
            {children}
        </ProfileFormContext.Provider>
    );
};
