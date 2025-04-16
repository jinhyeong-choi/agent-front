import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';

const NotFoundPage: React.FC = () => {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-6xl font-extrabold text-gray-900">404</h2>
          <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
          <p className="mt-2 text-gray-500">
            The page you are looking for does not exist.
          </p>
          <div className="mt-6">
            <Link
              to={isAuthenticated ? '/dashboard' : '/'}
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isAuthenticated ? 'Back to Dashboard' : 'Back to Home'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;