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

export const storeAuthSession = (result: LoginResponse): void => {
    localStorage.setItem(STORAGE_KEYS.accessToken, result.accessToken);
    localStorage.setItem(STORAGE_KEYS.refreshToken, result.refreshToken);
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(result.user));
};

export const getStoredAccessToken = (): string => {
    return localStorage.getItem(STORAGE_KEYS.accessToken) || '';
};

export const clearAuthSession = (): void => {
    localStorage.removeItem(STORAGE_KEYS.accessToken);
    localStorage.removeItem(STORAGE_KEYS.refreshToken);
    localStorage.removeItem(STORAGE_KEYS.currentUser);
};
