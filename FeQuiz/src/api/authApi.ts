import axiosClient from './axiosClient';

interface RegisterPayload {
  username: string;
  password: string;
}

interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: string;
    username: string;
  };
}

const authApi = {
  register: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await axiosClient.post('/users/register', data);
    return response.data;
  },

  login: async (data: RegisterPayload): Promise<RegisterResponse> => {
    const response = await axiosClient.post('/users/login', data);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authApi;
