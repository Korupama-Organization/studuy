import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createMockInterviewSession } from '../services/interview';

interface UseMockInterviewLauncherOptions {
  candidateId?: string | null;
}

export const useMockInterviewLauncher = ({ candidateId }: UseMockInterviewLauncherOptions = {}) => {
  const [mockInterviewMessage, setMockInterviewMessage] = useState('');

  const mockInterviewMutation = useMutation({
    mutationFn: () =>
      createMockInterviewSession({
        jobId: null,
        candidateId,
        interviewMode: 'technical',
      }),
    onMutate: () => {
      setMockInterviewMessage('');
    },
    onSuccess: (session) => {
      setMockInterviewMessage('Đã tạo mock interview. Đang chuyển tới phòng phỏng vấn...');
      window.location.assign(session.roomUrl);
    },
    onError: (mutationError) => {
      setMockInterviewMessage(mutationError instanceof Error ? mutationError.message : 'Tạo mock interview thất bại.');
    },
  });

  const { isPending, mutate } = mockInterviewMutation;

  const startMockInterview = useCallback(() => {
    if (!isPending) {
      mutate();
    }
  }, [isPending, mutate]);

  return {
    startMockInterview,
    isStartingMockInterview: isPending,
    mockInterviewMessage,
  };
};
