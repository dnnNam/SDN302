import type { Quiz } from '../types/api.type'
import { quizApi} from './quizApi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'


export const useQuizzes = () => {
  return useQuery<Quiz[]>({
    queryKey: ['quizzes'],
    queryFn: () => quizApi.getAll(),
  })
}

export const useQuizById = (id: string) => {
  return useQuery<Quiz>({
    queryKey: ['quiz', id],
    queryFn: () => quizApi.getById(id),
    enabled: !!id,
  })
}


export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // Vì hàm quizApi.update nhận 2 tham số (id, data), ta bọc lại thành 1 object nhận vào mutationFn
    mutationFn: ({ id, data }: { id: string; data: Partial<Quiz> }) => 
      quizApi.update(id, data),
    
    onSuccess: (data, variables) => {
      // 1. Làm mới danh sách quizzes tổng
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
      
      // 2. Làm mới luôn cả dữ liệu chi tiết của chính quiz đó nếu đang mở rộng xem
      queryClient.invalidateQueries({ queryKey: ['quizzes', variables.id] });
    },
  });
};

// 3. Hook xóa một Quiz (Mutation)
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizApi.delete,
    onSuccess: () => {
      // Sau khi xóa thành công, thông báo cho React Query làm mới lại danh sách dữ liệu
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

// 4. Hook tạo mới một Quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: quizApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] });
    },
  });
};

