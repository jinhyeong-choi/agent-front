import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { getAgentById, deleteAgent } from '@/features/agents/agentsSlice';
import { LLM_PROVIDERS } from '@/config/constatns';

const AgentDetailPage: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { currentAgent, status } = useAppSelector(state => state.agents);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  useEffect(() => {
    if (agentId) {
      dispatch(getAgentById(agentId));
    }
  }, [agentId, dispatch]);
  
  const handleEdit = () => {
    navigate(`/dashboard/agents/${agentId}/edit`);
  };
  
  const handleChat = () => {
    navigate(`/dashboard/agents/${agentId}/chat`);
  };
  
  const handleDelete = async () => {
    if (!agentId) return;
    
    setIsDeleting(true);
    
    try {
      await dispatch(deleteAgent(agentId)).unwrap();
      navigate('/dashboard/agents');
    } catch (error) {
      console.error('Failed to delete agent:', error);
      setIsDeleting(false);
    }
  };
  
  // Get LLM provider display name
  const getLlmProviderName = (providerId: string) => {
    const provider = LLM_PROVIDERS.find(p => p.id === providerId);
    return provider?.name || providerId;
  };
  
  // Get model name for display
  const getModelName = (providerId: string, modelId: string) => {
    const provider = LLM_PROVIDERS.find(p => p.id === providerId);
    return provider?.models.includes(modelId) ? modelId : 'Custom model';
  };
  
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!currentAgent) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Agent not found</h2>
        <p className="mb-4">The agent you're looking for doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate('/dashboard/agents')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Agents
        </button>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{currentAgent.name}</h1>
        
        <div className="space-x-3">
          <button
            onClick={handleChat}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-0.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Chat
          </button>
          
          <button
            onClick={handleEdit}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </button>
          
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Delete
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Agent Overview */}
        <div className="p-6 border-b">
          <div className="flex">
            <div className="w-24 h-24 rounded-lg overflow-hidden mr-6 flex-shrink-0">
              <img 
                src={currentAgent.avatar || '/assets/images/agent-placeholder.png'} 
                alt={currentAgent.name}
                className="w-full h-full object-cover" 
              />
            </div>
            
            <div>
              <p className="text-gray-500 mb-3">{currentAgent.description}</p>
              
              <div className="flex space-x-4">
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {getLlmProviderName(currentAgent.llm_provider)}
                </div>
                
                <div className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                  {currentAgent.mcps.length} MCPs
                </div>
                
                {currentAgent.configuration?.reasoning_enabled && (
                  <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Advanced Reasoning
                  </div>
                )}
                
                {!currentAgent.is_active && (
                  <div className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                    Inactive
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Usage Statistics */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">Usage Statistics</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{currentAgent.total_conversations}</div>
              <div className="text-gray-500">Total Conversations</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{currentAgent.total_messages}</div>
              <div className="text-gray-500">Total Messages</div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{currentAgent.tokens_used.toLocaleString()}</div>
              <div className="text-gray-500">Tokens Used</div>
            </div>
          </div>
        </div>
        
        {/* LLM Configuration */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">LLM Configuration</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium text-gray-700">Provider</div>
              <div>{getLlmProviderName(currentAgent.llm_provider)}</div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">Model</div>
              <div>{getModelName(currentAgent.llm_provider, currentAgent.configuration.llm_settings.model)}</div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">Temperature</div>
              <div>{currentAgent.configuration.temperature}</div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">Max Tokens</div>
              <div>{currentAgent.configuration.max_tokens.toLocaleString()}</div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">History Length</div>
              <div>{currentAgent.configuration.history_length} messages</div>
            </div>
            
            <div>
              <div className="font-medium text-gray-700">Advanced Reasoning</div>
              <div>{currentAgent.configuration.reasoning_enabled ? 'Enabled' : 'Disabled'}</div>
            </div>
          </div>
        </div>
        
        {/* System Prompt */}
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold mb-4">System Prompt</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">{currentAgent.configuration.system_prompt}</div>
        </div>
        
        {/* Connected MCPs */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Connected MCPs ({currentAgent.mcps.length})</h2>
          
          {currentAgent.mcps.length === 0 ? (
            <div className="text-gray-500">No MCPs connected to this agent</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentAgent.mcps.map(mcp => (
                <div key={mcp.id} className="border rounded-lg p-4 flex items-start">
                  <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0">
                    <img 
                      src={mcp.icon || '/assets/images/mcp-placeholder.png'}
                      alt={mcp.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <div className="font-medium">{mcp.name}</div>
                    <div className="text-sm text-gray-500">{mcp.description || 'No description'}</div>
                    
                    {!mcp.is_enabled && (
                      <div className="text-xs text-red-600 mt-1">Disabled</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Delete Agent</h2>
            
            <p className="mb-6">
              Are you sure you want to delete <strong>{currentAgent.name}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDetailPage;