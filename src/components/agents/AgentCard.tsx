import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '@/types';
import { LLM_PROVIDERS } from '@/config/constatns';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const navigate = useNavigate();
  
  // Get LLM provider display name
  const getLlmProviderName = (providerId: string) => {
    const provider = LLM_PROVIDERS.find(p => p.id === providerId);
    return provider?.name || providerId;
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    
    return formatter.format(date);
  };
  
  const handleCardClick = () => {
    navigate(`/dashboard/agents/${agent.id}`);
  };
  
  const handleChatClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent card click
    navigate(`/dashboard/agents/${agent.id}/chat`);
  };
  
  return (
    <div
      className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-start mb-3">
          <div className="w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
            <img 
              src={agent.avatar || '/assets/images/agent-placeholder.png'} 
              alt={agent.name}
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-lg truncate">{agent.name}</h3>
            <div className="text-xs text-gray-500">
              Created {formatDate(agent.created_at)}
            </div>
          </div>
          
          {!agent.is_active && (
            <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Inactive
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{agent.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {getLlmProviderName(agent.llm_provider)}
          </div>
          
          {agent.mcps.length > 0 && (
            <div className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
              {agent.mcps.length} MCP{agent.mcps.length !== 1 ? 's' : ''}
            </div>
          )}
          
          {agent.configuration?.reasoning_enabled && (
            <div className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Advanced Reasoning
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-gray-50 p-2 border-t">
        <button
          onClick={handleChatClick}
          className="w-full py-2 flex items-center justify-center text-sm font-medium text-blue-600 hover:bg-blue-50 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-0.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          Chat
        </button>
      </div>
    </div>
  );
};

export default AgentCard;