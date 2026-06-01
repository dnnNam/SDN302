import type { Quiz } from '../types/api.type';
import axiosClient from './axiosClient';



export const quizApi = {
  getAll: async (): Promise<Quiz[]> => {
    const res = await axiosClient.get('/quizzes');
    return res.data;
  },

  getById: async (id: string): Promise<Quiz> => {
    const res = await axiosClient.get(`/quizzes/${id}`);
    return res.data;
  },

  create: async (data: Partial<Quiz>): Promise<Quiz> => {
    const res = await axiosClient.post('/quizzes', data);
    return res.data;
  },

  update: async (id: string, data: Partial<Quiz>): Promise<Quiz> => {
    const res = await axiosClient.put(`/quizzes/${id}`, data);
    return res.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const res = await axiosClient.delete(`/quizzes/${id}`);
    return res.data;
  },

};