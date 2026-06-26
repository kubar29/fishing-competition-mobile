import { User } from '../types/user';
import { apiClient } from './apiClient';

type LoginRequest = {
  email: string;
  password: string;
};

type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  role?: 'USER' | 'JUDGE';
};


export type LoginResponse = {
  token: string;
  user: User;
};

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await apiClient.get<User>('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function registerUser(data: RegisterRequest): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', data);
  return response.data;
}