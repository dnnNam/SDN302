import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi } from './questionApi';
import type { Question } from '../types/api.type';

// Hook tạo mới câu hỏi
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ quizId, data }: { quizId: string; data: Partial<Question> }) =>
      questionApi.create({ ...data, quizId }),
    onSuccess: (_, variables) => {
      // Làm mới dữ liệu chi tiết của bài quiz chứa câu hỏi này để UI đồng bộ lập tức
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

// Hook cập nhật câu hỏi
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({  questionId, data }: { quizId: string; questionId: string; data: Partial<Question> }) =>
      questionApi.update(questionId, data),
    onSuccess: (_, variables) => {
      // Làm mới dữ liệu chi tiết của bài quiz
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};

// Hook xóa câu hỏi
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({  questionId }: { quizId: string; questionId: string }) =>
      questionApi.delete(questionId),
    onSuccess: (_, variables) => {
      // Làm mới dữ liệu chi tiết của bài quiz để xóa câu hỏi khỏi danh sách giao diện
      queryClient.invalidateQueries({ queryKey: ['quiz', variables.quizId] });
    },
  });
};