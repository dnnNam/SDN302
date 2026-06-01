import type { Quiz } from '../types/api.type';
import { quizApi } from './quizApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useQuizzes = () => {
  return useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: () => quizApi.getAll(),
  });
};

export const useQuizById = (id: string) => {
  return useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getById(id),
    enabled: !!id,
  });
};

export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Quiz> }) => 
      quizApi.update(id, data),
    onSuccess: (dataResult, variables) => {
      console.log('Updated quiz:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      queryClient.invalidateQueries({ queryKey: ['quizzes', variables.id] });
    },
  });
};

// 3. Hook xóa một Quiz (Mutation)
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizApi.delete,
    onSuccess: (dataResult) => {
      console.log('Deleted quiz:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

// 4. Hook tạo mới một Quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizApi.create,
    onSuccess: (dataResult) => {
      console.log('Created quiz:', dataResult);
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};