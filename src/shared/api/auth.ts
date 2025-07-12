import { API } from './index.ts';

// Типы
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}


export type User = {
  id: string;
  username: string;
  email: string;
};

export const register = async (data: RegisterPayload) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginPayload) => {
  const response = await API.post('/auth/login', data);
  return response.data;
};


export const logout = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get<{user: User}>('/auth/current-user', { withCredentials: true });
  return response.data.user;
};