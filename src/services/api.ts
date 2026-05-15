const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.toString().trim() || '';

const trimTrailingSlashes = (value: string): string => value.replace(/\/+$/, '');

const getDevOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }

  return 'http://localhost:5173';
};

export const API_BASE_URL = rawApiBaseUrl
  ? trimTrailingSlashes(rawApiBaseUrl)
  : import.meta.env.DEV
    ? trimTrailingSlashes(getDevOrigin())
    : '';

const missingApiBaseUrlMessage =
  'Missing VITE_API_BASE_URL. Set this environment variable to your backend URL before deploying the frontend.';

const normalizeApiPath = (path: string): string => {
  const normalizedPath = path.replace(/^\/+/, '');

  if (/\/api$/i.test(API_BASE_URL) && /^api(?:\/|$)/i.test(normalizedPath)) {
    return normalizedPath.replace(/^api\/?/i, '');
  }

  return normalizedPath;
};

export const buildApiUrl = (path: string): string => {
  if (!API_BASE_URL) {
    throw new Error(missingApiBaseUrlMessage);
  }

  return `${API_BASE_URL}/${normalizeApiPath(path)}`;
};

export const getApiConfigErrorMessage = (): string => {
  return API_BASE_URL ? '' : missingApiBaseUrlMessage;
};
