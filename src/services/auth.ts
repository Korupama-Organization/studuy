import { encryptPassword } from 'uit-authenticator/browser';

export type UserGender = 'Nam' | 'Nữ' | 'Khác';

export interface AuthContactInfo {
    email?: string;
    phone?: string | null;
    githubUrl?: string;
    linkedinUrl?: string;
    facebookUrl?: string;
    portfolioUrl?: string;
}

export interface AuthUser {
    _id?: string;
    fullName?: string;
    role?: string;
    authMethod?: string;
    status?: string;
    studentID?: string;
    studentId?: string;
    dateOfBirth?: string;
    gender?: UserGender | string;
    avatarUrl?: string;
    contactInfo?: AuthContactInfo;
}

export interface LoginResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface RegisterHrResponse {
    message: string;
    user: AuthUser;
}

export interface CurrentUserResponse {
    user: AuthUser;
    isNewbie?: boolean;
    message?: string;
    companyInfo?: unknown;
    membershipRole?: string;
    permissions?: unknown;
}

export interface UpdateCurrentUserPayload {
    fullName?: string;
    dateOfBirth?: string;
    gender?: UserGender | string;
    avatarUrl?: string;
    contactInfo?: AuthContactInfo;
    email?: string;
    phone?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    facebookUrl?: string;
    portfolioUrl?: string;
}

export interface UpdateCurrentUserResponse {
    message: string;
    user: AuthUser;
}

type HrGender = 'Nam' | 'Nữ' | 'Khác';

export interface RegisterHrPayload {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    gender?: HrGender;
    avatarUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    facebookUrl?: string;
    companyName?: string;
    companyWebsite?: string;
    companyAddress?: string;
}

interface ApiErrorShape {
    message?: string | string[];
    error?: string | string[];
    statusCode?: number;
    status?: number;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.toString().trim() ||
    (typeof window !== 'undefined' ? window.location.origin : '');

export const buildApiUrl = (path: string): string => {
    return new URL(path, API_BASE_URL.endsWith('/') ? API_BASE_URL : `${API_BASE_URL}/`).toString();
};

const UIT_AUTH_SECRET =
    import.meta.env.VITE_UIT_AUTH_SECRET?.toString().trim();

const STORAGE_KEYS = {
    accessToken: 'accessToken',
    refreshToken: 'refreshToken',
    currentUser: 'currentUser',
} as const;

const toErrorMessage = (fallback: string, payload?: ApiErrorShape): string => {
    if (!payload) {
        return fallback;
    }

    const messageValue = Array.isArray(payload.message)
        ? payload.message.find((item) => typeof item === 'string' && item.trim())
        : payload.message;

    if (typeof messageValue === 'string' && messageValue.trim()) {
        return messageValue;
    }

    const errorValue = Array.isArray(payload.error)
        ? payload.error.find((item) => typeof item === 'string' && item.trim())
        : payload.error;

    if (typeof errorValue === 'string' && errorValue.trim()) {
        return errorValue;
    }

    return fallback;
};

const extractResponseText = async (response: Response): Promise<string> => {
    try {
        return (await response.text()).trim();
    } catch {
        return '';
    }
};

const extractApiErrorMessage = (rawBody: string): string => {
    if (!rawBody) {
        return '';
    }

    try {
        const parsedBody = JSON.parse(rawBody) as ApiErrorShape;
        return toErrorMessage('', parsedBody).trim();
    } catch {
        return rawBody;
    }
};

const formatAuthFailureMessage = (response: Response, fallback: string, rawBody: string): string => {
    const extractedMessage = extractApiErrorMessage(rawBody);
    if (extractedMessage) {
        return extractedMessage;
    }

    const statusPart = response.status ? ` (${response.status}${response.statusText ? ` ${response.statusText}` : ''})` : '';
    return `${fallback}${statusPart}`;
};

const authHeaders = (): HeadersInit => {
    const token = getStoredAccessToken();
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const storeCurrentUser = (user: AuthUser): void => {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
};

export const loginNormalAuth = async (
    identifier: string,
    password: string,
): Promise<LoginResponse> => {
    const response = await fetch(buildApiUrl('api/auth/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier,
            password,
        }),
    });

    const rawBody = await extractResponseText(response);

    if (!response.ok) {
        const message = formatAuthFailureMessage(response, 'Đăng nhập thất bại.', rawBody);

        throw new Error(message || 'Đăng nhập thất bại.');
    }

    return JSON.parse(rawBody) as LoginResponse;
};

export const loginWithUIT = async (identifier: string, password: string): Promise<LoginResponse> => {
    if (!UIT_AUTH_SECRET) {
        throw new Error('Biến môi trường VITE_UIT_AUTH_SECRET chưa được thiết lập.');
    }
    const encryptedPassword = await encryptPassword(password, UIT_AUTH_SECRET);
    const response = await fetch(buildApiUrl('api/auth/login'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier,
            password: encryptedPassword,
        }),
    });

    const rawBody = await extractResponseText(response);

    if (!response.ok) {
        const message = formatAuthFailureMessage(response, 'Đăng nhập thất bại.', rawBody);

        throw new Error(message || 'Đăng nhập thất bại.');
    }

    return JSON.parse(rawBody) as LoginResponse;
};

export const registerHrUser = async (
    payload: RegisterHrPayload,
): Promise<RegisterHrResponse> => {
    const response = await fetch(buildApiUrl('api/auth/register/hr'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    let responsePayload: RegisterHrResponse | ApiErrorShape | null = null;
    try {
        responsePayload = (await response.json()) as RegisterHrResponse | ApiErrorShape;
    } catch {
        responsePayload = null;
    }

    if (!response.ok) {
        throw new Error(toErrorMessage('Đăng ký tài khoản HR thất bại.', responsePayload as ApiErrorShape));
    }

    return responsePayload as RegisterHrResponse;
};

export const checkHrEmailAvailability = async (email: string): Promise<void> => {
    const normalizedEmail = email.trim();
    const response = await fetch(
        buildApiUrl(`api/auth/register/hr/check-email?email=${encodeURIComponent(normalizedEmail)}`),
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        },
    );

    let payload: ApiErrorShape | null = null;
    try {
        payload = (await response.json()) as ApiErrorShape;
    } catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(toErrorMessage('Không thể kiểm tra email.', payload as ApiErrorShape));
    }
};

export const createCompany = async (
    token: string,
    payload: Record<string, unknown>,
): Promise<unknown> => {
    const response = await fetch(buildApiUrl('api/companies'), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const rawBody = await extractResponseText(response);

    if (!response.ok) {
        const message = extractApiErrorMessage(rawBody);
        throw new Error(message || 'Tạo công ty thất bại.');
    }

    return JSON.parse(rawBody);
};

export const storeAuthSession = (result: LoginResponse): void => {
    localStorage.setItem(STORAGE_KEYS.accessToken, result.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, result.refreshToken);
    storeCurrentUser(result.user);
};

export const getStoredAccessToken = (): string => {
    return localStorage.getItem(STORAGE_KEYS.accessToken) || '';
};

export const getStoredUser = (): AuthUser | null => {
    const userStr = localStorage.getItem(STORAGE_KEYS.currentUser);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr) as AuthUser;
    } catch {
        return null;
    }
};

const parseJwtPayload = (token: string): Record<string, unknown> | null => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return null;
    }

    try {
        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = atob(base64);
        return JSON.parse(json) as Record<string, unknown>;
    } catch {
        return null;
    }
};

const isAuthErrorEndpoint = (requestUrl: string): boolean => {
    return /\/api\/auth\/(login|register|refresh)|\/api\/auth\/register\/hr\/check-email/i.test(requestUrl);
};

export const getStoredAccessTokenExpiry = (): number | null => {
    const token = getStoredAccessToken();
    if (!token) {
        return null;
    }

    const payload = parseJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
        return null;
    }

    return payload.exp;
};

export const redirectToLogin = (): void => {
    clearAuthSession();

    if (typeof window === 'undefined') {
        return;
    }

    if (!window.location.pathname.startsWith('/login')) {
        window.location.replace('/login');
    }
};

export const installAuthRedirectInterceptor = (): void => {
    if (typeof window === 'undefined') {
        return;
    }

    const globalWindow = window as typeof window & { __seedAuthFetchInstalled?: boolean };
    if (globalWindow.__seedAuthFetchInstalled) {
        return;
    }

    globalWindow.__seedAuthFetchInstalled = true;

    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
        const response = await originalFetch(input, init);
        const requestUrl = typeof input === 'string'
            ? input
            : input instanceof URL
                ? input.toString()
                : input.url;

        if (response.status === 401 && !isAuthErrorEndpoint(requestUrl)) {
            redirectToLogin();
        }

        return response;
    };
};

export const getCurrentUserProfile = async (): Promise<CurrentUserResponse> => {
    const response = await fetch(buildApiUrl('api/auth/me'), {
        method: 'GET',
        headers: authHeaders(),
    });

    const rawBody = await extractResponseText(response);

    if (!response.ok) {
        const message = formatAuthFailureMessage(response, 'Không thể lấy thông tin người dùng.', rawBody);
        throw new Error(message || 'Không thể lấy thông tin người dùng.');
    }

    const result = JSON.parse(rawBody) as CurrentUserResponse;
    if (result.user) {
        storeCurrentUser(result.user);
    }
    return result;
};

export const updateCurrentUserProfile = async (
    payload: UpdateCurrentUserPayload,
): Promise<UpdateCurrentUserResponse> => {
    const response = await fetch(buildApiUrl('api/auth/me'), {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify(payload),
    });

    const rawBody = await extractResponseText(response);

    if (!response.ok) {
        const message = formatAuthFailureMessage(response, 'Cập nhật thông tin cá nhân thất bại.', rawBody);
        throw new Error(message || 'Cập nhật thông tin cá nhân thất bại.');
    }

    const result = JSON.parse(rawBody) as UpdateCurrentUserResponse;
    if (result.user) {
        storeCurrentUser(result.user);
    }
    return result;
};

export const refreshAuthSession = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);
    if (!refreshToken) {
        redirectToLogin();
        return false;
    }

    try {
        const response = await fetch(buildApiUrl('api/auth/refresh'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
            const result = await response.json() as Partial<LoginResponse>;
            if (result.accessToken) {
                localStorage.setItem(STORAGE_KEYS.accessToken, result.accessToken);
                if (result.refreshToken) {
                    localStorage.setItem(STORAGE_KEYS.refreshToken, result.refreshToken);
                }
                return true;
            }
        }
    } catch {
        // network error, maybe ignore
    }

    redirectToLogin();
    return false;
};

export const hasValidStoredAccessToken = (): boolean => {
    const token = getStoredAccessToken();
    const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken);

    if (!token) {
        return false;
    }

    const payload = parseJwtPayload(token);
    if (!payload || typeof payload.exp !== 'number') {
        clearAuthSession();
        return false;
    }

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const isTokenValid = payload.exp > nowInSeconds;

    if (!isTokenValid) {
        // If we have a refresh token, we don't clear the session yet, we return false
        // so the caller can attempt to refresh it.
        if (!refreshToken) {
            clearAuthSession();
        }
    }

    return isTokenValid;
};

export const getStoredUserRole = (): string | null => {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.currentUser);
        if (!raw) return null;
        const user = JSON.parse(raw) as AuthUser;
        return user.role ?? null;
    } catch {
        return null;
    }
};

export const clearAuthSession = (): void => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
};
