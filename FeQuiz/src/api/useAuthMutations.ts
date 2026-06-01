import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import authApi from './authApi';

interface RegisterPayload {
  username: string;
  password: string;
}

interface ApiError {
  message: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.register(data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      toast.success(data.message || 'Đăng ký thành công!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi kết nối tới server';
      toast.error(errorMessage);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: RegisterPayload) => authApi.login(data),
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      toast.success(data.message || 'Đăng nhập thành công!');
    },
    onError: (error: AxiosError<ApiError>) => {
      const errorMessage = error?.response?.data?.message || error?.message || 'Lỗi kết nối tới server';
      toast.error(errorMessage);
    },
  });
};
