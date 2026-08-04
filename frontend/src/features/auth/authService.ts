/**
 * Client Authentication Service (SPR-302 / ARCH-002)
 */

import apiClient from '../../lib/apiClient';
import type { ApiResponse } from '../../types/foundation';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'SUPER_ADMIN';
  emailVerified: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthDataPayload {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  verificationToken?: string;
}

export const authService = {
  register: async (data: { email: string; name: string; password: string }): Promise<ApiResponse<AuthDataPayload>> => {
    const response = await apiClient.post<ApiResponse<AuthDataPayload>>('/v1/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }): Promise<ApiResponse<AuthDataPayload>> => {
    const response = await apiClient.post<ApiResponse<AuthDataPayload>>('/v1/auth/login', data);
    return response.data;
  },

  getMe: async (): Promise<ApiResponse<{ user: UserProfile }>> => {
    const response = await apiClient.get<ApiResponse<{ user: UserProfile }>>('/v1/auth/me');
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<ApiResponse<{ accessToken: string; refreshToken: string }>> => {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/v1/auth/refresh', { refreshToken });
    return response.data;
  },

  verifyEmail: async (token: string): Promise<ApiResponse<{ emailVerified: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ emailVerified: boolean }>>('/v1/auth/verify-email', { token });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/v1/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse<null>> => {
    const response = await apiClient.post<ApiResponse<null>>('/v1/auth/reset-password', { token, newPassword });
    return response.data;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      const response = await apiClient.post<ApiResponse<null>>('/v1/auth/logout');
      return response.data;
    } catch {
      return { success: true, message: 'Logged out locally', data: null };
    }
  },
};

export default authService;
