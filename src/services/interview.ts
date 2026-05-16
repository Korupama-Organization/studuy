import { buildApiUrl } from './api';
import { getStoredAccessToken } from './auth';

interface ApiErrorShape {
  message?: string | string[];
  error?: string | string[];
}

export interface CreateMockInterviewSessionPayload {
  jobId: string;
  candidateId: string;
  interviewMode?: 'technical' | 'hr' | string;
  startTime?: string;
  endTime?: string;
}

export interface CreatedInterviewSession {
  id: string;
  roomUrl: string;
  raw: unknown;
}

const DEFAULT_INTERVIEW_BASE_URL = 'https://seed-interview.vercel.app';
const rawInterviewBaseUrl = import.meta.env.VITE_INTERVIEW_BASE_URL?.toString().trim() || DEFAULT_INTERVIEW_BASE_URL;

export const INTERVIEW_BASE_URL = rawInterviewBaseUrl.replace(/\/+$/, '');

const firstText = (value?: string | string[]): string => {
  if (Array.isArray(value)) {
    return value.find((item) => typeof item === 'string' && item.trim()) || '';
  }

  return typeof value === 'string' ? value : '';
};

const toErrorMessage = (fallback: string, payload?: ApiErrorShape | null): string => {
  if (!payload) {
    return fallback;
  }

  return firstText(payload.message).trim() || firstText(payload.error).trim() || fallback;
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const readObjectId = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }

    if (isRecord(value)) {
      const nestedId = readObjectId(value._id, value.id, value.$oid, value.objectId);
      if (nestedId) {
        return nestedId;
      }
    }
  }

  return '';
};

const parseJsonOrNull = async <T>(response: Response): Promise<T | null> => {
  try {
    return (await response.json()) as T;
  } catch {
    return null;
  }
};

const getDefaultSchedule = (): Pick<CreateMockInterviewSessionPayload, 'startTime' | 'endTime'> => {
  const startTime = new Date();
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
};

export const buildInterviewRoomUrl = (interviewSessionId: string): string => {
  return `${INTERVIEW_BASE_URL}/room/${encodeURIComponent(interviewSessionId)}`;
};

const extractInterviewSessionId = (payload: unknown): string => {
  if (!isRecord(payload)) {
    return '';
  }

  const data = isRecord(payload.data) ? payload.data : undefined;
  const session = isRecord(payload.session) ? payload.session : undefined;
  const interviewSession = isRecord(payload.interviewSession) ? payload.interviewSession : undefined;
  const dataSession = data && isRecord(data.session) ? data.session : undefined;
  const dataInterviewSession = data && isRecord(data.interviewSession) ? data.interviewSession : undefined;

  return readObjectId(
    payload._id,
    payload.id,
    payload.objectId,
    payload.sessionId,
    payload.interviewSessionId,
    session,
    interviewSession,
    data?._id,
    data?.id,
    data?.objectId,
    data?.sessionId,
    data?.interviewSessionId,
    dataSession,
    dataInterviewSession,
  );
};

export const createMockInterviewSession = async ({
  jobId,
  candidateId,
  interviewMode = 'technical',
  startTime,
  endTime,
}: CreateMockInterviewSessionPayload): Promise<CreatedInterviewSession> => {
  const normalizedJobId = jobId.trim();
  const normalizedCandidateId = candidateId.trim();

  if (!normalizedJobId) {
    throw new Error('Không tìm thấy mã job để tạo mock interview.');
  }

  if (!normalizedCandidateId) {
    throw new Error('Không tìm thấy mã candidate để tạo mock interview.');
  }

  const schedule = getDefaultSchedule();
  const accessToken = getStoredAccessToken();
  const response = await fetch(buildApiUrl('/api/interview-sessions'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      jobId: normalizedJobId,
      candidateId: normalizedCandidateId,
      sessionType: 'mock',
      interviewMode,
      status: 'scheduled',
      startTime: startTime || schedule.startTime,
      endTime: endTime || schedule.endTime,
    }),
  });

  const payload = await parseJsonOrNull<unknown>(response);

  if (!response.ok) {
    throw new Error(toErrorMessage('Tạo mock interview thất bại.', payload as ApiErrorShape | null));
  }

  const interviewSessionId = extractInterviewSessionId(payload);
  if (!interviewSessionId) {
    throw new Error('Tạo mock interview thành công nhưng không nhận được interview session id.');
  }

  return {
    id: interviewSessionId,
    roomUrl: buildInterviewRoomUrl(interviewSessionId),
    raw: payload,
  };
};
