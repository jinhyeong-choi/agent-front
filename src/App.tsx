import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AgentsListPage from './pages/agents/AgentsListPage';
import AgentDetailPage from './pages/agents/AgentDetailPage';
import AgentChatPage from './pages/agents/AgentChatPage';
import AgentBuilderPage from './pages/agents/AgentBuilderPage';
import McpMarketplacePage from './pages/mcp/McpMarketplacePage';
import McpDetailPage from './pages/mcp/McpDetailPage';
import McpRegistrationPage from './pages/mcp/McpRegistrationPage';
import ProfilePage from './pages/settings/ProfilePage';
import TokenUsagePage from './pages/settings/TokenUsagePage';
import BillingPage from './pages/settings/BillingPage';
import NotFoundPage from './pages/NotFoundPage';

// Auth
import { isAuthenticated } from './utils/auth';
import { refreshUser } from './features/auth/authSlice';

// Routes
import * as ROUTES from './config/routes';

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const authenticated = isAuthenticated();
  
  if (!authenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(window.location.pathname)}`} replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated: isAuthenticatedState } = useAppSelector(state => state.auth);
  
  useEffect(() => {
    // If authenticated according to localStorage but not in Redux state, refresh user data
    if (isAuthenticated() && !isAuthenticatedState) {
      dispatch(refreshUser());
    }
  }, [dispatch, isAuthenticatedState]);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path={ROUTES.HOME} element={<MainLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route 
          path={ROUTES.DASHBOARD} 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          
          {/* Agent Routes */}
          <Route path="agents">
            <Route index element={<AgentsListPage />} />
            <Route path="new" element={<AgentBuilderPage />} />
            <Route path=":agentId" element={<AgentDetailPage />} />
            <Route path=":agentId/chat" element={<AgentChatPage />} />
            <Route path=":agentId/edit" element={<AgentBuilderPage />} />
          </Route>
          
          {/* MCP Routes */}
          <Route path="mcp">
            <Route index element={<McpMarketplacePage />} />
            <Route path=":mcpId" element={<McpDetailPage />} />
            <Route path="register" element={<McpRegistrationPage />} />
          </Route>
          
          {/* Settings Routes */}
          <Route path="settings">
            <Route path="profile" element={<ProfilePage />} />
            <Route path="tokens" element={<TokenUsagePage />} />
            <Route path="billing" element={<BillingPage />} />
          </Route>
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;