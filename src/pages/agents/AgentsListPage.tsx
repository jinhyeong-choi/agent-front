import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchAgents } from '@/features/agents/agentsSlice';
import AgentCard from '@/components/agents/AgentCard';
import { Agent } from '@/types';

const AgentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { agents, status, error } = useAppSelector(state => state.agents);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  
  useEffect(() => {
    dispatch(fetchAgents());
  }, [dispatch]);
  
  // Filter agents based on search term and active filter
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActiveFilter = activeFilter === null || agent.is_active === activeFilter;
    
    return matchesSearch && matchesActiveFilter;
  });
  
  const handleCreateAgent = () => {
    navigate('/dashboard/agents/new');
  };
  
  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Your Agents</h1>
        
        <button
          onClick={handleCreateAgent}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create Agent
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter(null)}
            className={`px-4 py-2 border ${
              activeFilter === null
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-300 text-gray-700'
            } rounded-md hover:bg-gray-50`}
          >
            All
          </button>
          
          <button
            onClick={() => setActiveFilter(true)}
            className={`px-4 py-2 border ${
              activeFilter === true
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-300 text-gray-700'
            } rounded-md hover:bg-gray-50`}
          >
            Active
          </button>
          
          <button
            onClick={() => setActiveFilter(false)}
            className={`px-4 py-2 border ${
              activeFilter === false
                ? 'border-blue-500 text-blue-500'
                : 'border-gray-300 text-gray-700'
            } rounded-md hover:bg-gray-50`}
          >
            Inactive
          </button>
        </div>
      </div>
      
      {status === 'loading' ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : status === 'failed' ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>Error loading agents: {error}</p>
          <button
            onClick={() => dispatch(fetchAgents())}
            className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          {agents.length === 0 ? (
            <>
              <h2 className="text-xl font-medium text-gray-700 mb-2">No agents created yet</h2>
              <p className="text-gray-500 mb-4">Create your first AI agent to get started</p>
              <button
                onClick={handleCreateAgent}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Agent
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-gray-700 mb-2">No matching agents</h2>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent: Agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentsListPage;