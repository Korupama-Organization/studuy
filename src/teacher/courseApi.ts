import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const courseApi = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type UploadUrlResponse = {
  uploadUrl: string;
  fileUrl: string;
};

export type RequestUploadUrlInput = {
  fileName: string;
  fileType: string;
  courseId: string;
};

export async function requestUploadUrl(payload: RequestUploadUrlInput) {
  const response = await courseApi.post<UploadUrlResponse>('/api/uploads/get-upload-url', payload);
  return response.data;
}

export type SaveScormCoursePayload = {
  courseId: string;
  courseInfo: {
    title: string;
    subtitle: string;
    description: string;
    category: string;
    level: string;
    language: string;
    estimatedHours: string;
  };
  settings: {
    navigationMode: 'linear' | 'free';
    passScore: number;
    allowRetakes: boolean;
    trackTimeSpent: boolean;
  };
  metadata: {
    identifier: string;
    version: string;
    author: string;
    keywords: string;
    notes: string;
  };
  chapters: Array<{
    order: number;
    title: string;
    description: string;
    durationMinutes: number;
    assets: Array<{
      contentType: 'video' | 'slides' | 'pdf' | 'images';
      fileName: string;
      fileType: string;
      fileSize: number;
      fileUrl: string;
      uploadedAt: string;
    }>;
    questions: Array<{
      prompt: string;
      explanation: string;
      options: string[];
      correctOptionId: string;
    }>;
  }>;
};

export async function saveScormCourse(payload: SaveScormCoursePayload) {
  const response = await courseApi.post('/api/courses/scorm-drafts', payload);
  return response.data;
}
