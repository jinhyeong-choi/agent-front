import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { API_ENDPOINT } from '@/config/constatns';
import { ApiResponse } from '@/types';
import { getToken, removeToken } from './auth';

// Create axios instance
const api = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    
    // Handle authentication errors
    if (status === 401) {
      // Token expired or invalid
      removeToken();
      window.location.href = '/login?session=expired';
    }
    
    // Handle server errors
    if (status === 500) {
      console.error('Server error:', error);
    }
    
    return Promise.reject(error);
  }
);

// Generic request function
export const request = async <T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse = await api(config);
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        message: error.response.data.detail || error.message,
      };
    }
    
    throw error;
  }
};

// Helper methods
export const get = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request<T>({ ...config, method: 'GET', url });
};

export const post = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request<T>({ ...config, method: 'POST', url, data });
};

export const put = <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request<T>({ ...config, method: 'PUT', url, data });
};

export const del = <T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
  return request<T>({ ...config, method: 'DELETE', url });
};

export default api;