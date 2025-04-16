import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import Navbar from '@/components/common/Navbar';
import Sidebar from '@/components/common/Sidebar';

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAppSelector(state => state.auth);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        showMenu={true}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          currentPath={location.pathname}
        />
        
        <main className="flex-1 p-1">
          <div className="relative">
            <div className="absolute top-0 right-0 p-4">
              {user && (
                <div className="bg-white px-3 py-1 rounded-full text-sm flex items-center shadow-sm">
                  <span className="mr-2">Tokens:</span>
                  <span className="font-bold text-blue-600">{user.token_balance}</span>
                </div>
              )}
            </div>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;