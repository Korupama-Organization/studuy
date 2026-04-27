import { encryptPassword } from 'uit-authenticator/browser';

export interface AuthUser {
    _id?: string;
    fullName?: string;
    role?: string;
    authMethod?: string;
    status?: string;
    contactInfo?: {
        email?: string;
    };
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
}

interface ApiErrorShape {
    message?: string;
    error?: string;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL?.toString().trim() || 'http://localhost:3000';

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

    if (typeof payload.message === 'string' && payload.message.trim()) {
        return payload.message;
    }

    if (typeof payload.error === 'string' && payload.error.trim()) {
        return payload.error;
    }

    return fallback;
};

export const loginNormalAuth = async (
    identifier: string,
    password: string,
): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier,
            password,
        }),
    });

    let payload: LoginResponse | ApiErrorShape | null = null;
    try {
        payload = (await response.json()) as LoginResponse | ApiErrorShape;
    } catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(toErrorMessage('Dang nhap that bai.', payload as ApiErrorShape));
    }

    return payload as LoginResponse;
};

export const loginWithUIT = async (identifier: string, password: string): Promise<LoginResponse> => {
    if (!UIT_AUTH_SECRET) {
        throw new Error('UIT_AUTH_SECRET is not defined in environment variables.');
    }
    const encryptedPassword = await encryptPassword(password, UIT_AUTH_SECRET);
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            identifier,
            password: encryptedPassword,
        }),
    });

    let payload: LoginResponse | ApiErrorShape | null = null;
    try {
        payload = (await response.json()) as LoginResponse | ApiErrorShape;
    }
    catch {
        payload = null;
    }

    if (!response.ok) {
        throw new Error(toErrorMessage('Dang nhap that bai.', payload as ApiErrorShape));
    }

    return payload as LoginResponse;
};

export const registerHrUser = async (
    payload: RegisterHrPayload,
): Promise<RegisterHrResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register/hr`, {
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
        throw new Error(toErrorMessage('Dang ky tai khoan HR that bai.', responsePayload as ApiErrorShape));
    }

    return responsePayload as RegisterHrResponse;
};

export const checkHrEmailAvailability = async (email: string): Promise<void> => {
    const normalizedEmail = email.trim();
    const response = await fetch(
        `${API_BASE_URL}/api/auth/register/hr/check-email?email=${encodeURIComponent(normalizedEmail)}`,
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
        throw new Error(toErrorMessage('Khong the kiem tra email.', payload as ApiErrorShape));
    }
};

export const storeAuthSession = (result: LoginResponse): void => {
    localStorage.setItem(STORAGE_KEYS.accessToken, result.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, result.refreshToken);
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(result.user));
};

export const getStoredAccessToken = (): string => {
    return localStorage.getItem(STORAGE_KEYS.accessToken) || '';
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

export const hasValidStoredAccessToken = (): boolean => {
    const token = getStoredAccessToken();
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
        clearAuthSession();
    }

    return isTokenValid;
};

export const clearAuthSession = (): void => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
};
