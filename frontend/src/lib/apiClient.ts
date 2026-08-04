/**
 * Standardized HTTP API Client (SPR-301 / ARCH-002)
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import config from '../config';
import { STORAGE_KEYS } from '../constants';
import { logger } from './logger';
import type { ApiResponse } from '../types/foundation';

const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.timeouts.requestMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject Bearer JWT Token & Correlation ID
apiClient.interceptors.request.use(
  (reqConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    const requestId = `req_${Math.random().toString(36).substring(2, 11)}`;
    if (reqConfig.headers) {
      reqConfig.headers['X-Request-ID'] = requestId;
    }
    logger.debug(`API Request: ${reqConfig.method?.toUpperCase()} ${reqConfig.url}`);
    return reqConfig;
  },
  (error) => {
    logger.error('API Request Interceptor Error', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize Envelope & Handle 401 Session Expiration
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    logger.debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url} [${response.status}]`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      logger.warn('Session expired or unauthorized. Clearing local token.');
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    logger.error(`API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url} [${error.response?.status || 'Network Error'}]`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
