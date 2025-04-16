import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { refreshUser } from '@/features/auth/authSlice';
import { isAuthenticated as checkAuth } from '@/utils/auth';

/**
 * Hook to handle authentication state and redirects
 * @param redirectTo URL to redirect to if not authenticated
 * @returns Auth state and functions
 */
export const useAuth = (redirectTo: string = '/login') => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, isLoading, error } = useAppSelector(state => state.auth);
  
  // Check authentication status on mount
  useEffect(() => {
    const checkAuthentication = async () => {
      // If localStorage says we're authenticated but Redux state doesn't, refresh the user
      if (checkAuth() && !isAuthenticated) {
        try {
          await dispatch(refreshUser()).unwrap();
        } catch (err) {
          // If refresh fails, redirect to login
          navigate(`${redirectTo}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
        }
      } else if (!checkAuth() && !isAuthenticated) {
        // If not authenticated, redirect
        navigate(`${redirectTo}?returnUrl=${encodeURIComponent(window.location.pathname)}`);
      }
    };
    
    checkAuthentication();
  }, [isAuthenticated, navigate, dispatch, redirectTo]);
  
  return {
    isAuthenticated,
    user,
    isLoading,
    error,
  };
};

export default useAuth;