import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi } from './questionApi';
import type { Question } from '../types/api.type';

// Hook tạo mới câu hỏi
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: Partial<Question> }) =>
      questionApi.create({ ...data, quizId }),
    onSuccess: (dataResult, variables) => {
      // Đổi _ thành dataResult để tránh trùng/lỗi biến không dùng
      console.log('Created question:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

// Hook cập nhật câu hỏi
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

// Hook xóa câu hỏi
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