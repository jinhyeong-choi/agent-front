interface Route {
  path: string;
  label: string;
  icon?: string;
  children?: Route[];
  showInNav?: boolean;
  requiredRole?: 'user' | 'admin';
}

// Public routes
export const HOME = '/';
export const LOGIN = '/login';
export const REGISTER = '/register';
export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';

// Protected routes
export const DASHBOARD = '/dashboard';
export const AGENTS = '/dashboard/agents';
export const AGENT_DETAIL = '/dashboard/agents/:agentId';
export const AGENT_CHAT = '/dashboard/agents/:agentId/chat';
export const AGENT_CREATE = '/dashboard/agents/new';
export const AGENT_EDIT = '/dashboard/agents/:agentId/edit';

export const MCP = '/dashboard/mcp';
export const MCP_DETAIL = '/dashboard/mcp/:mcpId';
export const MCP_REGISTER = '/dashboard/mcp/register';

export const SETTINGS = '/dashboard/settings';
export const SETTINGS_PROFILE = '/dashboard/settings/profile';
export const SETTINGS_TOKENS = '/dashboard/settings/tokens';
export const SETTINGS_BILLING = '/dashboard/settings/billing';

// Navigation structure
export const NAV_ROUTES: Route[] = [
  {
    path: DASHBOARD,
    label: 'Dashboard',
    icon: 'dashboard',
    showInNav: true,
  },
  {
    path: AGENTS,
    label: 'Agents',
    icon: 'robot',
    showInNav: true,
    children: [
      {
        path: AGENT_CREATE,
        label: 'Create New Agent',
        showInNav: false,
      },
      {
        path: AGENT_DETAIL,
        label: 'Agent Details',
        showInNav: false,
      },
      {
        path: AGENT_CHAT,
        label: 'Chat with Agent',
        showInNav: false,
      },
      {
        path: AGENT_EDIT,
        label: 'Edit Agent',
        showInNav: false,
      },
    ],
  },
  {
    path: MCP,
    label: 'MCP Marketplace',
    icon: 'apps',
    showInNav: true,
    children: [
      {
        path: MCP_DETAIL,
        label: 'MCP Details',
        showInNav: false,
      },
      {
        path: MCP_REGISTER,
        label: 'Register MCP Server',
        showInNav: false,
      },
    ],
  },
  {
    path: SETTINGS,
    label: 'Settings',
    icon: 'settings',
    showInNav: true,
    children: [
      {
        path: SETTINGS_PROFILE,
        label: 'Profile',
        showInNav: true,
      },
      {
        path: SETTINGS_TOKENS,
        label: 'Tokens',
        showInNav: true,
      },
      {
        path: SETTINGS_BILLING,
        label: 'Billing',
        showInNav: true,
      },
    ],
  },
];