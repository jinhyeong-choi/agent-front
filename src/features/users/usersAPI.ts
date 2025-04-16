import { get, put, post } from '@/utils/api';
import { User, UserUpdateRequest, PasswordUpdate } from '@/types';

/**
 * Fetch current user profile
 * @returns User profile data
 */
export const getUserProfile = async () => {
  const response = await get<User>('/users/me');
  return response.data;
};

/**
 * Update user profile
 * @param userData Profile data to update
 * @returns Updated user profile
 */
export const updateProfile = async (userData: UserUpdateRequest) => {
  const response = await put<User>('/users/me', userData);
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to update profile');
  }
  
  return response.data;
};

/**
 * Update user password
 * @param passwordData Password data to update
 * @returns Success indicator
 */
export const updatePassword = async (passwordData: PasswordUpdate) => {
  const response = await post<User>('/auth/password', passwordData);
  
  if (response.status !== 200) {
    throw new Error(response.message || 'Failed to update password');
  }
  
  return response.data;
};

/**
 * Get token usage statistics
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 * @returns Token usage statistics
 */
export const getTokenUsageStatistics = async (startDate?: string, endDate?: string) => {
  let url = '/tokens/usage';
  const params = new URLSearchParams();
  
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await get(url);
  return response.data;
};

/**
 * Get token transaction history
 * @param limit Number of transactions to fetch
 * @param offset Offset for pagination
 * @returns Token transaction history
 */
export const getTokenTransactions = async (limit: number = 20, offset: number = 0) => {
  const response = await get(`/tokens/transactions?limit=${limit}&offset=${offset}`);
  return response.data;
};

/**
 * Get token usage by agent
 * @param startDate Optional start date for filtering
 * @param endDate Optional end date for filtering
 * @returns Token usage by agent
 */
export const getTokenUsageByAgent = async (startDate?: string, endDate?: string) => {
  let url = '/tokens/usage/agents';
  const params = new URLSearchParams();
  
  if (startDate) params.append('start_date', startDate);
  if (endDate) params.append('end_date', endDate);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await get(url);
  return response.data;
};

/**
 * Get token usage summary
 * @param days Number of days to include in summary
 * @returns Token usage summary
 */
export const getTokenUsageSummary = async (days: number = 30) => {
  const response = await get(`/tokens/summary?days=${days}`);
  return response.data;
};