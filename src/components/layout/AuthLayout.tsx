import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/assets/images/logo.svg"
            alt="LAIVDATA Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            LAIVDATA AI Agent Platform
          </h2>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;