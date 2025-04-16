import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAgents } from '@/features/agents/agentsSlice';
import { formatTokens, formatDate } from '@/utils/formatting';
import { Agent } from '@/types';

const DashboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector(state => state.auth);
  const { agents, status: agentsStatus } = useAppSelector(state => state.agents);
  
  const [recentAgents, setRecentAgents] = useState<Agent[]>([]);
  
  // Fetch user's agents
  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);
  
  // Sort agents by updated_at and take the most recent 3
  useEffect(() => {
    if (agents.length > 0) {
      const sorted = [...agents]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 3);
      setRecentAgents(sorted);
    }
  }, [agents]);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>
      
      {/* Welcome Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.username || 'User'}!</h2>
        <p className="text-gray-600">
          This is your AI Agent Platform dashboard. Create, manage, and interact with your AI agents powered by MCP technology.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Token Balance */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Token Balance</h3>
            <Link 
              to="/dashboard/settings/tokens" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Details
            </Link>
          </div>
          <div className="text-3xl font-bold text-blue-600">{formatTokens(user?.token_balance || 0)}</div>
          <div className="mt-4">
            <Link
              to="/dashboard/settings/tokens"
              className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              Purchase Tokens
            </Link>
          </div>
        </div>
        
        {/* Agent Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">Your Agents</h3>
            <Link 
              to="/dashboard/agents" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All
            </Link>
          </div>
          <div className="text-3xl font-bold text-blue-600">{agents.length}</div>
          <div className="mt-4">
            <Link
              to="/dashboard/agents/new"
              className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              Create New Agent
            </Link>
          </div>
        </div>
        
        {/* MCP Marketplace */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold">MCP Marketplace</h3>
            <Link 
              to="/dashboard/mcp" 
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Browse
            </Link>
          </div>
          <p className="text-gray-600 mb-4">Enhance your agents with powerful MCP integrations</p>
          <div className="mt-4">
            <Link
              to="/dashboard/mcp"
              className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              Explore MCPs
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent Agents */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Agents</h3>
          <Link 
            to="/dashboard/agents" 
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View All
          </Link>
        </div>
        
        {agentsStatus === 'loading' ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recentAgents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentAgents.map((agent) => (
                  <tr key={agent.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={agent.avatar || "/assets/images/agent-placeholder.png"}
                            alt={agent.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                          <div className="text-sm text-gray-500">{agent.description.substring(0, 50)}{agent.description.length > 50 ? '...' : ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agent.type}</div>
                      <div className="text-sm text-gray-500">{agent.llm_provider}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(agent.updated_at, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        agent.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agent.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/dashboard/agents/${agent.id}/chat`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Chat
                      </Link>
                      <Link
                        to={`/dashboard/agents/${agent.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>You haven't created any agents yet.</p>
            <Link
              to="/dashboard/agents/new"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Agent
            </Link>
          </div>
        )}
      </div>
      
      {/* Quick Start Guide */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Start Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">1</div>
            <h4 className="font-medium mb-2">Create an Agent</h4>
            <p className="text-sm text-gray-600 mb-3">Build a custom AI agent with your desired LLM model and configuration.</p>
            <Link
              to="/dashboard/agents/new"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Create Agent →
            </Link>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">2</div>
            <h4 className="font-medium mb-2">Add MCP Capabilities</h4>
            <p className="text-sm text-gray-600 mb-3">Connect your agent to external services with MCPs from the marketplace.</p>
            <Link
              to="/dashboard/mcp"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Browse MCPs →
            </Link>
          </div>
          
          <div className="border rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-2">3</div>
            <h4 className="font-medium mb-2">Start Chatting</h4>
            <p className="text-sm text-gray-600 mb-3">Interact with your agent through our intuitive chat interface.</p>
            <Link
              to="/dashboard/agents"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View Agents →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;