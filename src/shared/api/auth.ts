import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true, // Обязательно для передачи cookie
});

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

// Регистрация
export const register = async (data: RegisterPayload) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};

// Логин
export const login = async (data: LoginPayload) => {
  const response = await API.post('/auth/login', data);
  return response.data;
};

// Логаут
export const logout = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await API.get('/auth/current-user', { withCredentials: true });
  return response.data;
};