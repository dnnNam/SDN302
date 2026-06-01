import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi } from './questionApi';
import type { Question } from '../types/api.type';

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: Partial<Question> }) =>
      questionApi.create({ ...data, quizId }),
    onSuccess: (dataResult, variables) => {
      console.log('Created question:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, data }: { quizId: string; questionId: string; data: Partial<Question> }) =>
      questionApi.update(questionId, data),
    onSuccess: (dataResult, variables) => {
      console.log('Updated question:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId }: { quizId: string; questionId: string }) =>
      questionApi.delete(questionId),
    onSuccess: (dataResult, variables) => {
      console.log('Deleted question status:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};