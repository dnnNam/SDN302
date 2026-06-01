import type { Question } from '../types/api.type';
import axiosClient from './axiosClient';

export const questionApi = {
  getAll: async (): Promise<Question[]> => {
    const res = await axiosClient.get('/questions');
    return res.data;
  },

  getById: async (id: string): Promise<Question> => {
    const res = await axiosClient.get(`/questions/${id}`);
    return res.data;
  },

  create: async (data: Partial<Question> & { quizId: string }): Promise<Question> => {
    // Backend yêu cầu route phẳng /questions và truyền quizId trong body
    const res = await axiosClient.post('/questions', data);
    return res.data;
  },

  update: async (questionId: string, data: Partial<Question>): Promise<Question> => {
    const res = await axiosClient.put(`/questions/${questionId}`, data);
    return res.data;
  },

  delete: async (questionId: string): Promise<{ message: string }> => {
    const res = await axiosClient.delete(`/questions/${questionId}`);
    return res.data;
  },
};