import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
    getCandidateProfile,
    getProfileCompletion,
    updateCandidateProfile,
    type AcademicInfo,
    type Achievement,
    type CandidateProfileData,
    type IntroductionQuestions,
    type Language,
    type ProfileCompletionData,
    type ProjectPayload,
    type ProjectResponse,
    type TechnicalSkillPayload,
    type TechnicalSkillResponse,
    type UpdateCandidateProfilePayload,
    type WorkExperiencePayload,
    type WorkExperienceResponse,
} from '../../services/candidateProfile';
import {
    getCurrentUserProfile,
    getStoredUser,
    hasValidStoredAccessToken,
    refreshAuthSession,
    updateCurrentUserProfile,
    type AuthUser,
    type UpdateCurrentUserPayload,
} from '../../services/auth';

// ── Form state types ──

export interface ProfileFormState {
    // Step 1: Basic info (user-level fields, persisted through /api/auth/me)
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

    // Step 2: Education & Skills (CandidateProfile API)
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

    saveStep1: () => Promise<boolean>;
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

const PROFILE_DRAFT_STORAGE_KEY = 'candidateProfileDraft';

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const getString = (value: unknown): string => (typeof value === 'string' ? value : '');

const hasText = (value: string | undefined | null): boolean => Boolean(value && value.trim());

const toDateInputValue = (value: unknown): string => {
    const raw = getString(value);
    return raw ? raw.substring(0, 10) : '';
};

const normalizeGender = (value: unknown): string => {
    const raw = getString(value).trim();
    const lower = raw.toLowerCase();
    if (raw === 'Nam' || lower === 'male' || lower === 'nam') return 'Nam';
    if (raw === 'Nữ' || lower === 'female' || lower === 'nu' || lower === 'nữ') return 'Nữ';
    if (raw === 'Khác' || lower === 'other' || lower === 'khac' || lower === 'khác') return 'Khác';
    return raw;
};

const normalizeAcademicInfo = (academicInfo?: Partial<AcademicInfo> | null): AcademicInfo => {
    const graduationYear = Number(academicInfo?.graduationYear);
    const rawGpa = academicInfo?.gpa;
    const gpa = rawGpa === undefined || rawGpa === null || Number.isNaN(Number(rawGpa))
        ? undefined
        : Number(rawGpa);

    return {
        university: getString(academicInfo?.university),
        major: getString(academicInfo?.major),
        graduationYear: graduationYear || EMPTY_ACADEMIC_INFO.graduationYear,
        gpa,
    };
};

const normalizeIntroductionQuestions = (intro?: Partial<IntroductionQuestions> | null): IntroductionQuestions => ({
    preferredRoles: Array.isArray(intro?.preferredRoles)
        ? intro.preferredRoles
            .map((role) => ({ preferredRole: getString(role?.preferredRole) }))
            .filter((role) => hasText(role.preferredRole))
        : [],
    whyTheseRoles: getString(intro?.whyTheseRoles),
    futureGoals: getString(intro?.futureGoals),
    favoriteTechnology: getString(intro?.favoriteTechnology),
});

const readJsonObject = (storageKey: string): Record<string, unknown> | null => {
    if (typeof localStorage === 'undefined') return null;

    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as unknown;
        return isRecord(parsed) ? parsed : null;
    } catch {
        return null;
    }
};

const readDraft = (): Partial<ProfileFormState> => {
    const draft = readJsonObject(PROFILE_DRAFT_STORAGE_KEY);
    if (!draft) return {};

    return {
        fullName: getString(draft.fullName),
        studentId: getString(draft.studentId),
        email: getString(draft.email),
        phone: getString(draft.phone),
        birthDate: toDateInputValue(draft.birthDate),
        gender: normalizeGender(draft.gender),
        githubUrl: getString(draft.githubUrl),
        linkedinUrl: getString(draft.linkedinUrl),
        facebookUrl: getString(draft.facebookUrl),
        portfolioUrl: getString(draft.portfolioUrl),
        academicInfo: normalizeAcademicInfo(draft.academicInfo as Partial<AcademicInfo> | undefined),
        technicalSkills: Array.isArray(draft.technicalSkills) ? (draft.technicalSkills as TechnicalSkillPayload[]) : [],
        technicalSkillsDisplay: Array.isArray(draft.technicalSkillsDisplay) ? (draft.technicalSkillsDisplay as TechnicalSkillResponse[]) : [],
        softSkills: Array.isArray(draft.softSkills) ? (draft.softSkills.filter((item) => typeof item === 'string') as string[]) : [],
        languages: Array.isArray(draft.languages) ? (draft.languages as Language[]) : [],
        projects: Array.isArray(draft.projects) ? (draft.projects as ProjectPayload[]) : [],
        projectsDisplay: Array.isArray(draft.projectsDisplay) ? (draft.projectsDisplay as ProjectResponse[]) : [],
        workExperiences: Array.isArray(draft.workExperiences) ? (draft.workExperiences as WorkExperiencePayload[]) : [],
        workExperiencesDisplay: Array.isArray(draft.workExperiencesDisplay) ? (draft.workExperiencesDisplay as WorkExperienceResponse[]) : [],
        introductionQuestions: normalizeIntroductionQuestions(draft.introductionQuestions as Partial<IntroductionQuestions> | undefined),
        advantagePoint: getString(draft.advantagePoint),
        achievements: Array.isArray(draft.achievements) ? (draft.achievements as Achievement[]) : [],
    };
};

const extractBasicInfoFromUser = (user?: AuthUser | null): Partial<ProfileFormState> => {
    if (!user) return {};

    return {
        fullName: getString(user.fullName),
        studentId: getString(user.studentID) || getString(user.studentId),
        email: getString(user.contactInfo?.email),
        phone: getString(user.contactInfo?.phone),
        birthDate: toDateInputValue(user.dateOfBirth),
        gender: normalizeGender(user.gender),
        githubUrl: getString(user.contactInfo?.githubUrl),
        linkedinUrl: getString(user.contactInfo?.linkedinUrl),
        facebookUrl: getString(user.contactInfo?.facebookUrl),
        portfolioUrl: getString(user.contactInfo?.portfolioUrl),
    };
};

const persistDraft = (form: ProfileFormState): void => {
    try {
        localStorage.setItem(PROFILE_DRAFT_STORAGE_KEY, JSON.stringify(form));
    } catch {
        // Local storage may be unavailable in restricted browser contexts.
    }
};

const buildInitialFormState = (): ProfileFormState => {
    const userFields = extractBasicInfoFromUser(getStoredUser());
    const draft = readDraft();

    return {
        ...initialFormState,
        ...userFields,
        ...draft,
        fullName: draft.fullName || userFields.fullName || '',
        studentId: draft.studentId || userFields.studentId || '',
        email: draft.email || userFields.email || '',
        phone: draft.phone || userFields.phone || '',
        birthDate: draft.birthDate || userFields.birthDate || '',
        gender: draft.gender || userFields.gender || '',
        githubUrl: draft.githubUrl || userFields.githubUrl || '',
        linkedinUrl: draft.linkedinUrl || userFields.linkedinUrl || '',
        facebookUrl: draft.facebookUrl || userFields.facebookUrl || '',
        portfolioUrl: draft.portfolioUrl || userFields.portfolioUrl || '',
        academicInfo: normalizeAcademicInfo(draft.academicInfo),
        introductionQuestions: normalizeIntroductionQuestions(draft.introductionQuestions),
    };
};

const mergeBasicInfo = (current: ProfileFormState, updates: Partial<ProfileFormState>): ProfileFormState => {
    const next = { ...current };
    const keys: (keyof Pick<ProfileFormState, 'fullName' | 'studentId' | 'email' | 'phone' | 'birthDate' | 'gender' | 'githubUrl' | 'linkedinUrl' | 'facebookUrl' | 'portfolioUrl'>)[] = [
        'fullName',
        'studentId',
        'email',
        'phone',
        'birthDate',
        'gender',
        'githubUrl',
        'linkedinUrl',
        'facebookUrl',
        'portfolioUrl',
    ];

    for (const key of keys) {
        const value = updates[key];
        if (typeof value === 'string' && value.trim()) {
            next[key] = value;
        }
    }

    return next;
};

// ── Helper to populate form from API data ──

const populateFormFromProfile = (profile: CandidateProfileData): Partial<ProfileFormState> => {
    const techSkillsPayload: TechnicalSkillPayload[] = (profile.technicalSkills || []).map((ts) => ({
        skillId: ts.skillId,
        category: ts.skill?.category || 'Khác',
        name: ts.skill?.name || '',
        yearsOfExperience: Number(ts.yearsOfExperience) || 0,
        confidence: typeof ts.confidence === 'boolean' ? ts.confidence : true,
    }));

    const projectsPayload: ProjectPayload[] = (profile.projects || []).map((project) => ({
        name: project.name || '',
        description: project.description || '',
        technologies: project.technologySkills?.length
            ? project.technologySkills.map((skill) => skill.name).filter(Boolean)
            : project.technologies || [],
        role: project.role || '',
        contribution: project.contribution || '',
        startDate: toDateInputValue(project.startDate),
        endDate: toDateInputValue(project.endDate),
        teamSize: Number(project.teamSize) || 1,
        repositoryUrl: project.repositoryUrl || '',
        reportUrl: project.reportUrl || '',
    }));

    const workExpsPayload: WorkExperiencePayload[] = (profile.workExperiences || []).map((workExperience) => ({
        companyName: workExperience.companyName || '',
        position: workExperience.position || '',
        startDate: toDateInputValue(workExperience.startDate),
        endDate: toDateInputValue(workExperience.endDate),
        description: workExperience.description || '',
        technologiesUsed: workExperience.technologyUsedSkills?.length
            ? workExperience.technologyUsedSkills.map((skill) => skill.name).filter(Boolean)
            : workExperience.technologiesUsed || [],
    }));

    return {
        academicInfo: normalizeAcademicInfo(profile.academicInfo),
        technicalSkills: techSkillsPayload,
        technicalSkillsDisplay: profile.technicalSkills || [],
        softSkills: profile.softSkills || [],
        languages: (profile.languages || []).map((language) => ({
            certificateName: language.certificateName || '',
            score: Number(language.score) || 0,
            issuedAt: toDateInputValue(language.issuedAt),
            expiresAt: toDateInputValue(language.expiresAt),
        })),
        projects: projectsPayload,
        projectsDisplay: profile.projects || [],
        workExperiences: workExpsPayload,
        workExperiencesDisplay: profile.workExperiences || [],
        introductionQuestions: normalizeIntroductionQuestions(profile.introductionQuestions),
        advantagePoint: profile.advantagePoint || '',
        achievements: (profile.achievements || []).map((achievement) => ({
            title: achievement.title || '',
            achievedAt: toDateInputValue(achievement.achievedAt),
        })),
    };
};

const buildAcademicInfoPayload = (academicInfo: AcademicInfo): AcademicInfo => ({
    university: academicInfo.university.trim(),
    major: academicInfo.major.trim(),
    graduationYear: Number(academicInfo.graduationYear) || new Date().getFullYear() + 1,
    gpa:
        academicInfo.gpa === undefined || academicInfo.gpa === null || Number.isNaN(Number(academicInfo.gpa))
            ? undefined
            : Number(academicInfo.gpa),
});

const buildTechnicalSkillsPayload = (skills: TechnicalSkillPayload[]): TechnicalSkillPayload[] => {
    return skills
        .filter((skill) => hasText(skill.name) || hasText(skill.skillId || ''))
        .map((skill) => {
            const payload: TechnicalSkillPayload = {
                category: skill.category?.trim() || 'Khác',
                yearsOfExperience: Number(skill.yearsOfExperience) || 0,
                confidence: typeof skill.confidence === 'boolean' ? skill.confidence : true,
            };

            if (hasText(skill.skillId || '')) {
                payload.skillId = skill.skillId;
            }

            if (hasText(skill.name)) {
                payload.name = skill.name?.trim();
            }

            return payload;
        });
};

const buildLanguagesPayload = (languages: Language[]): Language[] => {
    return languages
        .filter((language) => hasText(language.certificateName) && hasText(language.issuedAt) && hasText(language.expiresAt))
        .map((language) => ({
            certificateName: language.certificateName.trim(),
            score: Number(language.score) || 0,
            issuedAt: language.issuedAt,
            expiresAt: language.expiresAt,
        }));
};

const buildProjectsPayload = (projects: ProjectPayload[]): ProjectPayload[] => {
    return projects
        .filter((project) => (
            hasText(project.name) &&
            hasText(project.description) &&
            hasText(project.role) &&
            hasText(project.contribution) &&
            hasText(project.startDate) &&
            hasText(project.endDate) &&
            Number(project.teamSize) > 0
        ))
        .map((project) => ({
            name: project.name.trim(),
            description: project.description.trim(),
            role: project.role.trim(),
            contribution: project.contribution.trim(),
            startDate: project.startDate,
            endDate: project.endDate,
            teamSize: Number(project.teamSize) || 1,
            technologies: (project.technologies || []).map((technology) => technology.trim()).filter(Boolean),
            repositoryUrl: project.repositoryUrl?.trim() || undefined,
            reportUrl: project.reportUrl?.trim() || undefined,
        }));
};

const buildWorkExperiencesPayload = (workExperiences: WorkExperiencePayload[]): WorkExperiencePayload[] => {
    return workExperiences
        .filter((workExperience) => (
            hasText(workExperience.companyName) &&
            hasText(workExperience.position) &&
            hasText(workExperience.startDate) &&
            hasText(workExperience.description)
        ))
        .map((workExperience) => ({
            companyName: workExperience.companyName.trim(),
            position: workExperience.position.trim(),
            startDate: workExperience.startDate,
            endDate: workExperience.endDate || undefined,
            description: workExperience.description.trim(),
            technologiesUsed: (workExperience.technologiesUsed || []).map((technology) => technology.trim()).filter(Boolean),
        }));
};

const buildIntroductionPayload = (introductionQuestions: IntroductionQuestions): IntroductionQuestions => ({
    preferredRoles: (introductionQuestions.preferredRoles || [])
        .map((role) => ({ preferredRole: role.preferredRole.trim() }))
        .filter((role) => hasText(role.preferredRole)),
    whyTheseRoles: introductionQuestions.whyTheseRoles.trim(),
    futureGoals: introductionQuestions.futureGoals.trim(),
    favoriteTechnology: introductionQuestions.favoriteTechnology.trim(),
});

const buildAchievementsPayload = (achievements: Achievement[]): Achievement[] => {
    return achievements
        .filter((achievement) => hasText(achievement.title) && hasText(achievement.achievedAt))
        .map((achievement) => ({
            title: achievement.title.trim(),
            achievedAt: achievement.achievedAt,
        }));
};

// ── Provider ──

export const ProfileFormProvider = ({ children }: { children: ReactNode }) => {
    const [form, setForm] = useState<ProfileFormState>(() => buildInitialFormState());
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

    useEffect(() => {
        persistDraft(form);
    }, [form]);

    const updateField = useCallback(<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    }, []);

    const clearMessages = useCallback(() => {
        setSaveError(null);
        setSaveSuccess(null);
    }, []);

    const requireAuthenticated = useCallback(async (): Promise<void> => {
        let validToken = hasValidStoredAccessToken();
        if (!validToken) {
            validToken = await refreshAuthSession();
        }

        if (!validToken) {
            throw new Error('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
        }
    }, []);

    const refreshCompletion = useCallback(async () => {
        try {
            await requireAuthenticated();
        } catch {
            return;
        }

        setCompletionLoading(true);
        try {
            const result = await getProfileCompletion();
            setCompletion(result.data);
        } catch (err: unknown) {
            console.error('Failed to fetch completion:', err);
        } finally {
            setCompletionLoading(false);
        }
    }, [requireAuthenticated]);

    const fetchInitialData = useCallback(async () => {
        try {
            await requireAuthenticated();
        } catch {
            setProfileLoaded(true);
            return;
        }

        setProfileLoading(true);
        try {
            const [userResult, profileResult] = await Promise.allSettled([
                getCurrentUserProfile(),
                getCandidateProfile(),
            ]);

            if (userResult.status === 'fulfilled') {
                const userFields = extractBasicInfoFromUser(userResult.value.user);
                setForm((prev) => mergeBasicInfo(prev, userFields));
            } else {
                console.error('Failed to fetch current user:', userResult.reason);
            }

            if (profileResult.status === 'fulfilled' && profileResult.value.data) {
                setProfileData(profileResult.value.data);
                const formUpdates = populateFormFromProfile(profileResult.value.data);
                setForm((prev) => ({ ...prev, ...formUpdates }));
            } else if (profileResult.status === 'rejected') {
                console.error('Failed to fetch profile:', profileResult.reason);
            }
        } finally {
            setProfileLoaded(true);
            setProfileLoading(false);
        }
    }, [requireAuthenticated]);

    useEffect(() => {
        if (!fetchedRef.current) {
            fetchedRef.current = true;
            void refreshCompletion();
            void fetchInitialData();
        }
    }, [fetchInitialData, refreshCompletion]);

    const runSave = useCallback(async (operation: () => Promise<string>): Promise<boolean> => {
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            await requireAuthenticated();
            const message = await operation();
            setSaveSuccess(message);
            return true;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Lưu hồ sơ thất bại.';
            setSaveError(errorMessage);
            return false;
        } finally {
            setSaving(false);
        }
    }, [requireAuthenticated]);

    const validateStep1 = (): string[] => {
        const missing: string[] = [];
        if (!hasText(form.fullName)) missing.push('Họ và tên');
        if (!hasText(form.studentId)) missing.push('Mã số sinh viên');
        if (!hasText(form.email)) missing.push('Email');
        if (!hasText(form.phone)) missing.push('Số điện thoại');
        if (!hasText(form.birthDate)) missing.push('Ngày sinh');
        if (!hasText(form.gender)) missing.push('Giới tính');
        return missing;
    };

    const validateAcademicInfo = (): string[] => {
        const missing: string[] = [];
        if (!hasText(form.academicInfo.university)) missing.push('Trường đại học');
        if (!hasText(form.academicInfo.major)) missing.push('Ngành học');
        if (!Number(form.academicInfo.graduationYear)) missing.push('Năm tốt nghiệp');
        return missing;
    };

    const validateCareerGoals = (): string[] => {
        const missing: string[] = [];
        if (!form.introductionQuestions.preferredRoles?.some((role) => hasText(role.preferredRole))) missing.push('Vị trí mong muốn');
        if (!hasText(form.introductionQuestions.whyTheseRoles)) missing.push('Lý do chọn vị trí');
        if (!hasText(form.introductionQuestions.futureGoals)) missing.push('Mục tiêu nghề nghiệp');
        if (!hasText(form.introductionQuestions.favoriteTechnology)) missing.push('Công nghệ yêu thích');
        if (!hasText(form.advantagePoint)) missing.push('Điểm mạnh nổi bật');
        return missing;
    };

    const reportMissingFields = (missing: string[]): boolean => {
        if (missing.length === 0) return false;
        setSaveError(`Vui lòng nhập đầy đủ: ${missing.join(', ')}.`);
        setSaveSuccess(null);
        return true;
    };

    const buildBasicInfoPayload = (): UpdateCurrentUserPayload => ({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        dateOfBirth: form.birthDate,
        gender: normalizeGender(form.gender),
        githubUrl: form.githubUrl.trim() || undefined,
        linkedinUrl: form.linkedinUrl.trim() || undefined,
        facebookUrl: form.facebookUrl.trim() || undefined,
        portfolioUrl: form.portfolioUrl.trim() || undefined,
    });

    const applyUpdatedUser = (user: AuthUser): void => {
        const userFields = extractBasicInfoFromUser(user);
        setForm((prev) => mergeBasicInfo(prev, userFields));
    };

    const saveCandidatePayload = async (
        payload: UpdateCandidateProfilePayload,
        successMessage?: string,
    ): Promise<string> => {
        const result = await updateCandidateProfile(payload);
        setProfileData(result.data);
        setProfileLoaded(true);

        const formUpdates = populateFormFromProfile(result.data);
        setForm((prev) => ({ ...prev, ...formUpdates }));

        void refreshCompletion();
        return successMessage || result.message || 'Lưu thành công!';
    };

    const buildStep2Payload = (): UpdateCandidateProfilePayload => ({
        academicInfo: buildAcademicInfoPayload(form.academicInfo),
        technicalSkills: buildTechnicalSkillsPayload(form.technicalSkills),
        softSkills: form.softSkills.map((skill) => skill.trim()).filter(Boolean),
        languages: buildLanguagesPayload(form.languages),
    });

    const buildStep3Payload = (): UpdateCandidateProfilePayload => ({
        projects: buildProjectsPayload(form.projects),
        workExperiences: buildWorkExperiencesPayload(form.workExperiences),
    });

    const buildStep4Payload = (): UpdateCandidateProfilePayload => ({
        introductionQuestions: buildIntroductionPayload(form.introductionQuestions),
        advantagePoint: form.advantagePoint.trim(),
        achievements: buildAchievementsPayload(form.achievements),
    });

    // Step 1: Basic information in User collection
    const saveStep1 = async (): Promise<boolean> => {
        const missing = validateStep1();
        if (reportMissingFields(missing)) return false;

        return runSave(async () => {
            persistDraft(form);
            const result = await updateCurrentUserProfile(buildBasicInfoPayload());
            applyUpdatedUser(result.user);
            return result.message || 'Đã lưu thông tin cơ bản.';
        });
    };

    // Step 2: Education & Skills
    const saveStep2 = async (): Promise<boolean> => {
        const missing = validateAcademicInfo();
        if (reportMissingFields(missing)) return false;

        return runSave(async () => saveCandidatePayload(buildStep2Payload(), 'Đã lưu học vấn và kỹ năng.'));
    };

    // Step 3: Projects & Work Experiences
    const saveStep3 = async (): Promise<boolean> => {
        return runSave(async () => saveCandidatePayload(buildStep3Payload(), 'Đã lưu dự án và kinh nghiệm.'));
    };

    // Step 4: Career goals & Strengths
    const saveStep4 = async (): Promise<boolean> => {
        const missing = validateCareerGoals();
        if (reportMissingFields(missing)) return false;

        return runSave(async () => saveCandidatePayload(buildStep4Payload(), 'Đã lưu mục tiêu nghề nghiệp.'));
    };

    // Save all at once
    const saveAllSteps = async (): Promise<boolean> => {
        const missing = [...validateStep1(), ...validateAcademicInfo(), ...validateCareerGoals()];
        if (reportMissingFields(missing)) return false;

        return runSave(async () => {
            persistDraft(form);
            const userResult = await updateCurrentUserProfile(buildBasicInfoPayload());
            applyUpdatedUser(userResult.user);

            const payload: UpdateCandidateProfilePayload = {
                ...buildStep2Payload(),
                ...buildStep3Payload(),
                ...buildStep4Payload(),
            };
            await saveCandidatePayload(payload);
            return 'Nộp hồ sơ thành công!';
        });
    };

    // Save draft for a specific step (or all steps if not specified)
    const saveDraft = async (step?: number): Promise<boolean> => {
        switch (step) {
            case 1: return saveStep1();
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
        saveStep1,
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
