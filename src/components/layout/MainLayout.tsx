import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';

const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} LAIVDATA AI Agent Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;