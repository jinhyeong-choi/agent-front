import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LoginForm from '@/features/auth/LoginForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const sessionExpired = queryParams.get('session') === 'expired';
  const returnUrl = queryParams.get('returnUrl') || '/dashboard';
  
  return (
    <div className="w-full max-w-md">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        
        {sessionExpired && (
          <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p>Your session has expired. Please sign in again.</p>
          </div>
        )}
        
        <LoginForm />
      </div>
      
      <div className="text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            to={`/register${returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
            className="text-blue-500 hover:text-blue-700"
          >
            Sign up here
          </Link>
        </p>
        <p className="text-gray-600 mt-2">
          <Link to="/forgot-password" className="text-blue-500 hover:text-blue-700">
            Forgot your password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;