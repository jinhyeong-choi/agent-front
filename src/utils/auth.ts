import { STORAGE_KEYS } from '@/config/constatns';
import { User } from '@/types';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const setToken = (token: string, expiresIn: number): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  
  // Calculate and store expiration time
  const expiryTime = new Date().getTime() + expiresIn * 1000;
  localStorage.setItem('token_expiry', expiryTime.toString());
};

export const removeToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  localStorage.removeItem('token_expiry');
};

export const isTokenExpired = (): boolean => {
  const expiry = localStorage.getItem('token_expiry');
  if (!expiry) return true;
  
  const expiryTime = parseInt(expiry, 10);
  const now = new Date().getTime();
  
  return now >= expiryTime;
};

// User management
export const getUser = (): User | null => {
  const userString = localStorage.getItem(STORAGE_KEYS.USER);
  if (!userString) return null;
  
  try {
    return JSON.parse(userString);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null;
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const removeUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Authentication state
export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token || isTokenExpired()) {
    return false;
  }
  
  const user = getUser();
  return !!user;
};

// Logout functionality
export const logout = (): void => {
  removeToken();
  removeUser();
  // Clear any other auth-related data from localStorage if needed
};

// Role-based authorization
export const isAdmin = (): boolean => {
  const user = getUser();
  return !!user && user.is_superuser;
};

export const hasPermission = (requiredRole: 'user' | 'admin'): boolean => {
  if (requiredRole === 'user') {
    return isAuthenticated();
  }
  
  if (requiredRole === 'admin') {
    return isAdmin();
  }
  
  return false;
};